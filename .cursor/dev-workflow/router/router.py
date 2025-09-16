#!/usr/bin/env python3
import os
import json
import uuid
import datetime
import re
from pathlib import Path
from collections import OrderedDict

# Dynamic ROOT detection: prefer env, else walk up until .cursor found, else cwd
def _detect_root() -> Path:
    env_root = os.environ.get('CURSOR_WORKSPACE_ROOT') or os.environ.get('WORKSPACE_ROOT')
    if env_root:
        p = Path(env_root)
        if (p / '.cursor').exists():
            return p
    # Walk up from cwd to find a directory containing .cursor
    cur = Path.cwd()
    for _ in range(10):
        if (cur / '.cursor').exists():
            return cur
        if cur.parent == cur:
            break
        cur = cur.parent
    # Fallback to original default
    return Path('/workspace') if Path('/workspace/.cursor').exists() else Path.cwd()

ROOT = _detect_root()

# Caching controls
CACHE_DISABLED = os.environ.get('ROUTER_CACHE', '').lower() in ('off', '0', 'false')
LRU_MAX_SIZE = int(os.environ.get('ROUTER_LRU_SIZE', '512') or '512')

# Precedence cache
_PREC_CACHE: list[str] | None = None
_PREC_MTIME: float | None = None

# Policies cache
_POLICY_CACHE: list[dict] | None = None
_POLICY_MTIME: float | None = None

# LRU cache for decisions (keyed by epoch:normalized_context)
_LRU: OrderedDict[str, dict] = OrderedDict()
_CACHE_EPOCH = 0  # bumped when precedence/policies change
RULES_DIR = ROOT / '.cursor' / 'rules'
PRECEDENCE_FILE = RULES_DIR / 'master-rules' / '9-governance-precedence.mdc'
BASE_PRECEDENCE = [
    'F8-security-and-compliance-overlay',
    '8-auditor-validator-protocol',
    '4-master-rule-code-modification-safety-protocol',
    '3-master-rule-code-quality-checklist',
    '6-master-rule-complex-feature-context-preservation',
    '2-master-rule-ai-collaboration-guidelines',
    '5-master-rule-documentation-and-context-guidelines',
    '7-dev-workflow-command-router',
    'project-rules',
]
POLICY_DIR = ROOT / '.cursor' / 'dev-workflow' / 'policy-dsl'
ROUTING_LOG_SCHEMA = ROOT / '.cursor' / 'dev-workflow' / 'schemas' / 'routing_log.json'

def load_precedence():
    global _PREC_CACHE, _PREC_MTIME, _CACHE_EPOCH
    if not PRECEDENCE_FILE.exists():
        # Fallback to base precedence to preserve deterministic tie-breaks
        _PREC_CACHE = BASE_PRECEDENCE.copy()
        _PREC_MTIME = None
        return _PREC_CACHE
    mtime = PRECEDENCE_FILE.stat().st_mtime
    if not CACHE_DISABLED and _PREC_CACHE is not None and _PREC_MTIME and abs(mtime - _PREC_MTIME) < 1.0:
        return _PREC_CACHE
    text = PRECEDENCE_FILE.read_text(encoding='utf-8')
    start = text.find('Priority Order')
    if start == -1:
        order = []
    else:
        block = text[start: start + 1000]
        lines = [l.strip() for l in block.splitlines() if l.strip().startswith('-')]
        order = [l.lstrip('-').strip().split(' ')[0] for l in lines]
    _PREC_CACHE = order
    # bump epoch if changed
    if _PREC_MTIME is None or abs(mtime - _PREC_MTIME) >= 1.0:
        _CACHE_EPOCH += 1
    _PREC_MTIME = mtime
    return order

def list_policies():
    global _POLICY_CACHE, _POLICY_MTIME, _CACHE_EPOCH
    if not POLICY_DIR.exists():
        _POLICY_CACHE = []
        _POLICY_MTIME = None
        return _POLICY_CACHE
    # compute dir mtime as max of files' mtimes
    mt = 0.0
    files = list(POLICY_DIR.glob('*.json'))
    for f in files:
        try:
            mt = max(mt, f.stat().st_mtime)
        except Exception:
            continue
    if not CACHE_DISABLED and _POLICY_CACHE is not None and _POLICY_MTIME and abs(mt - _POLICY_MTIME) < 1.0:
        return _POLICY_CACHE
    out: list[dict] = []
    for f in files:
        try:
            doc = json.loads(f.read_text(encoding='utf-8'))
            if isinstance(doc, list):
                out.extend([d for d in doc if isinstance(d, dict)])
            elif isinstance(doc, dict):
                out.append(doc)
        except Exception:
            continue
    _POLICY_CACHE = out
    if _POLICY_MTIME is None or abs(mt - _POLICY_MTIME) >= 1.0:
        _CACHE_EPOCH += 1
    _POLICY_MTIME = mt
    return out

def _normalize_context(context_map) -> str:
    try:
        if isinstance(context_map, str):
            return context_map.strip().lower().replace('-', ' ')
        if isinstance(context_map, dict):
            tokens = []
            for v in context_map.values():
                if isinstance(v, (list, tuple, set)):
                    tokens.extend([str(x).strip().lower().replace('-', ' ') for x in v])
                else:
                    tokens.append(str(v).strip().lower().replace('-', ' '))
            return " ".join(tokens)
        return str(context_map).lower().replace('-', ' ')
    except Exception:
        return str(context_map).lower().replace('-', ' ')

def evaluate_policies(policies, context_map):
    """Match policies by exact token/set containment instead of substring.

    Converts the context map into a set of lowercase tokens; a policy matches
    only if its required condition tokens are a subset of the context tokens.
    """
    # Tokenize context into a set
    tokens: set[str] = set()
    try:
        if isinstance(context_map, dict):
            for v in context_map.values():
                if isinstance(v, (list, tuple, set)):
                    for x in v:
                        tokens.update(str(x).lower().replace('-', ' ').split())
                else:
                    tokens.update(str(v).lower().replace('-', ' ').split())
        else:
            tokens.update(str(context_map).lower().replace('-', ' ').split())
    except Exception:
        tokens.update(str(context_map).lower().replace('-', ' ').split())

    matches = []
    for policy in policies:
        raw_conditions = policy.get('conditions') or []
        required = {str(c).lower() for c in raw_conditions}
        if required.issubset(tokens):
            matches.append(policy)
    # Primary ordering by priority (desc)
    matches.sort(key=lambda x: x.get('priority', 0), reverse=True)
    return matches

def _redact_sensitive(value):
    patterns = re.compile(r"(password|secret|token|credential|api[_-]?key)", re.IGNORECASE)
    if isinstance(value, dict):
        clean = {}
        for k, v in value.items():
            if isinstance(k, str) and patterns.search(k):
                # drop or mask sensitive keys entirely
                continue
            clean[k] = _redact_sensitive(v)
        return clean
    if isinstance(value, list):
        return [_redact_sensitive(v) for v in value]
    if isinstance(value, str):
        if patterns.search(value):
            return "[REDACTED]"
        return value
    return value


def route_decision(context):
    precedence = load_precedence()
    policies = list_policies()
    # LRU lookup
    normalized = _normalize_context(context)
    cache_key = f"{_CACHE_EPOCH}:{normalized}"
    cached = None
    if not CACHE_DISABLED:
        cached = _LRU.get(cache_key)
        if cached is not None:
            # move to end (most recently used)
            _LRU.move_to_end(cache_key)
            matched = cached.get('matched')
        else:
            matched = evaluate_policies(policies, context)
    else:
        matched = evaluate_policies(policies, context)
    # Tie-break using precedence_tag against precedence file when priorities tie
    if matched:
        # group by priority
        top_pri = matched[0].get('priority', 0)
        top = [p for p in matched if p.get('priority', 0) == top_pri]
        if len(top) > 1 and precedence:
            # build order map from precedence file
            prec_index = {k: i for i, k in enumerate(precedence)}
            def prec_rank(p):
                tag = p.get('precedence_tag')
                return prec_index.get(str(tag), len(prec_index))
            top.sort(key=prec_rank)
            winning = top[0]
        else:
            winning = matched[0]
    else:
        winning = None

    # Non-null, type-safe fields
    considered = []
    for p in matched:
        name = p.get('name')
        if isinstance(name, str) and name:
            considered.append(name)

    decision = 'none'
    if winning:
        win_name = winning.get('name')
        if isinstance(win_name, str) and win_name:
            decision = win_name

    # Trace correlation
    trace_id = context.get('trace_id') or str(uuid.uuid4())
    log = {
        'session_id': str(uuid.uuid4()),
        'timestamp': datetime.datetime.utcnow().isoformat() + 'Z',
        'decision': decision,
        'rules_considered': considered,
        'winning_rule': decision,
        'trace_id': str(trace_id),
    }
    # populate LRU
    if not CACHE_DISABLED:
        if cached is None:
            _LRU[cache_key] = {'matched': matched, 'decision': decision}
            if len(_LRU) > LRU_MAX_SIZE:
                _LRU.popitem(last=False)
        else:
            _LRU[cache_key]['decision'] = decision
    # persist to routing_logs dir
    outdir = ROOT / '.cursor' / 'dev-workflow' / 'routing_logs'
    outdir.mkdir(parents=True, exist_ok=True)
    fpath = outdir / (log['session_id'] + '.json')
    safe_log = _redact_sensitive(log)
    fpath.write_text(json.dumps(safe_log, indent=2), encoding='utf-8')
    return log

if __name__ == '__main__':
    import sys
    ctx = {'git_commit':'', 'snapshot_id':None}
    if len(sys.argv) > 1:
        ctx['git_commit'] = sys.argv[1]
    res = route_decision(ctx)
    print(json.dumps(res, indent=2))

