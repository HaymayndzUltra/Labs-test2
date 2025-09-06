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

def evaluate_policies(policies, context):
    # simple evaluator: pick highest priority action whose conditions match substrings in context
    matches = []
    for p in policies:
        conds = p.get('conditions') or []
        if all(any(c in str(context) for context in context.values()) for c in conds):
            matches.append(p)
    matches.sort(key=lambda x: x.get('priority', 0), reverse=True)
    return matches

def route_decision(context):
    precedence = load_precedence()
    policies = list_policies()
    matched = evaluate_policies(policies, context)
    winning = None
    if matched:
        # pick first by priority then precedence
        winning = matched[0]
    # fallback: pick highest precedence rule from precedence list if any
    log = {
        'session_id': str(uuid.uuid4()),
        'timestamp': datetime.datetime.utcnow().isoformat() + 'Z',
        'decision': winning.get('name') if winning else 'none',
        'confidence': 1.0 if winning else 0.0,
        'rules_considered': [p.get('name') for p in matched],
        'winning_rule': winning.get('name') if winning else None,
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

