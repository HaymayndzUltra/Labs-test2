#!/usr/bin/env python3
import os
import json
import uuid
import datetime
from pathlib import Path

ROOT = Path('/workspace')
RULES_DIR = ROOT / '.cursor' / 'rules'
PRECEDENCE_FILE = RULES_DIR / 'master-rules' / '9-governance-precedence.mdc'
POLICY_DIR = ROOT / '.cursor' / 'dev-workflow' / 'policy-dsl'
ROUTING_LOG_SCHEMA = ROOT / '.cursor' / 'dev-workflow' / 'schemas' / 'routing_log.json'

def load_precedence():
    # naive parse: read precedence section from the file
    if not PRECEDENCE_FILE.exists():
        return []
    text = PRECEDENCE_FILE.read_text(encoding='utf-8')
    # find the Priority Order list
    start = text.find('Priority Order')
    if start == -1:
        return []
    block = text[start: start + 1000]
    lines = [l.strip() for l in block.splitlines() if l.strip().startswith('-')]
    order = [l.lstrip('-').strip().split(' ')[0] for l in lines]
    return order

def list_policies():
    out = []
    if POLICY_DIR.exists():
        for f in POLICY_DIR.glob('*.json'):
            try:
                out.append(json.loads(f.read_text(encoding='utf-8')))
            except Exception:
                continue
    return out

def evaluate_policies(policies, context_map):
    # Normalize context values to a single lower-cased string for robust substring matching
    try:
        tokens = []
        for v in context_map.values():
            if isinstance(v, (list, tuple, set)):
                tokens.extend([str(x).strip().lower() for x in v])
            else:
                tokens.append(str(v).strip().lower())
        normalized_context = " ".join(tokens)
    except Exception:
        normalized_context = str(context_map).lower()
    matches = []
    for policy in policies:
        conditions = policy.get('conditions') or []
        conditions_lc = [str(c).lower() for c in conditions]
        if all(c in normalized_context for c in conditions_lc):
            matches.append(policy)
    # Primary ordering by priority (desc). Tie-break left as stable order for now
    matches.sort(key=lambda x: x.get('priority', 0), reverse=True)
    return matches

def route_decision(context):
    precedence = load_precedence()
    policies = list_policies()
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

    log = {
        'session_id': str(uuid.uuid4()),
        'timestamp': datetime.datetime.utcnow().isoformat() + 'Z',
        'decision': decision,
        'confidence': 1.0 if winning else 0.0,
        'rules_considered': considered,
        'winning_rule': decision,
        'override_reason': None,
        'approver': None,
        'snapshot_id': context.get('snapshot_id')
    }
    # persist to routing_logs dir
    outdir = ROOT / '.cursor' / 'dev-workflow' / 'routing_logs'
    outdir.mkdir(parents=True, exist_ok=True)
    fpath = outdir / (log['session_id'] + '.json')
    fpath.write_text(json.dumps(log, indent=2), encoding='utf-8')
    return log

if __name__ == '__main__':
    import sys
    ctx = {'git_commit':'', 'snapshot_id':None}
    if len(sys.argv) > 1:
        ctx['git_commit'] = sys.argv[1]
    res = route_decision(ctx)
    print(json.dumps(res, indent=2))

