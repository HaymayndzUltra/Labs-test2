#!/usr/bin/env python3
import os
import re
import json

def _root():
    for key in ('WORKSPACE','GITHUB_WORKSPACE','CURSOR_WORKSPACE'):
        v = os.getenv(key)
        if v and (os.path.exists(os.path.join(v,'.cursor')) or os.path.exists(os.path.join(v,'.git'))):
            return os.path.abspath(v)
    here = os.path.abspath(__file__)
    d = os.path.dirname(here)
    while True:
        if os.path.exists(os.path.join(d,'.cursor')) or os.path.exists(os.path.join(d,'.git')):
            return d
        nd = os.path.dirname(d)
        if nd == d:
            break
        d = nd
    return os.getcwd()

ROOT = _root()
RULES_DIR = os.path.join(ROOT, '.cursor', 'rules')
REPORT_PATH = os.path.join(ROOT, '.cursor', 'dev-workflow', 'ci', 'rule_hygiene_report.json')

frontmatter_re = re.compile(r'^---\n(.*?)\n---\n', re.S)

def parse_frontmatter(path):
    with open(path, 'r', encoding='utf-8') as f:
        txt = f.read()
    m = frontmatter_re.search(txt)
    if not m:
        return None
    block = m.group(1)
    # naive YAML: look for description: "..." and alwaysApply: true/false
    desc_m = re.search(r'description:\s*"([\s\S]*?)"', block)
    aa_m = re.search(r'alwaysApply:\s*(true|false)', block, re.I)
    return {
        'description_raw': desc_m.group(1).strip() if desc_m else None,
        'alwaysApply_raw': aa_m.group(1).lower() == 'true' if aa_m else None,
    }

def analyze_description(desc):
    # expected format: TAGS: [...] | TRIGGERS: a,b | SCOPE: foo | DESCRIPTION: text
    parts = [p.strip() for p in desc.split('|')]
    out = {}
    for p in parts:
        if p.upper().startswith('TAGS:'):
            out['TAGS'] = p.split(':',1)[1].strip()
        elif p.upper().startswith('TRIGGERS:'):
            out['TRIGGERS'] = p.split(':',1)[1].strip()
        elif p.upper().startswith('SCOPE:'):
            out['SCOPE'] = p.split(':',1)[1].strip()
        elif p.upper().startswith('DESCRIPTION:'):
            out['DESCRIPTION'] = p.split(':',1)[1].strip()
    return out

def check_scope(scope):
    if not scope:
        return False
    allowed = ['global','common-rules','project-rules']
    if scope in allowed:
        return True
    if scope.startswith('stack:') or scope.startswith('project:'):
        return True
    return False

report = {'files':[], 'summary':{}}

for root, dirs, files in os.walk(RULES_DIR):
    for fn in files:
        if not fn.endswith('.mdc'):
            continue
        path = os.path.join(root, fn)
        entry = {'path': path, 'errors': [], 'suggestions': []}
        fm = parse_frontmatter(path)
        if not fm:
            entry['errors'].append('missing_or_invalid_frontmatter')
            report['files'].append(entry)
            continue
        desc_raw = fm.get('description_raw')
        if desc_raw is None:
            entry['errors'].append('missing_description_in_frontmatter')
        else:
            parsed = analyze_description(desc_raw)
            triggers = parsed.get('TRIGGERS')
            if triggers:
                # split, dedupe
                trig_list = [t.strip() for t in re.split('[,;]', triggers) if t.strip()]
                if len(trig_list) != len(set(trig_list)):
                    entry['errors'].append('duplicate_triggers')
                    entry['suggestions'].append('dedupe TRIGGERS list')
            scope = parsed.get('SCOPE')
            if not check_scope(scope):
                entry['errors'].append('invalid_scope')
                entry['suggestions'].append("use one of: global, common-rules, project-rules, stack:<tech>, project:<slug>")
        # validate alwaysApply exists
        if fm.get('alwaysApply_raw') is None:
            entry['errors'].append('missing_alwaysApply')
        report['files'].append(entry)

# UI schema checks: look for docs/design/tokens.json and docs/interaction/*.json
ui_artifacts = {}
tokens_path = os.path.join(ROOT, 'docs', 'design', 'tokens.json')
ui_artifacts['tokens.json'] = os.path.exists(tokens_path)
interaction_dir = os.path.join(ROOT, 'docs', 'interaction')
ui_artifacts['interaction_specs_present'] = False
if os.path.isdir(interaction_dir):
    for f in os.listdir(interaction_dir):
        if f.endswith('.json'):
            ui_artifacts['interaction_specs_present'] = True
            break

report['ui_artifacts'] = ui_artifacts

summary = {'total_rules_checked': len(report['files'])}
errs = sum(1 for f in report['files'] if f['errors'])
summary['files_with_errors'] = errs
summary['ui_artifacts_missing'] = [k for k,v in ui_artifacts.items() if not v]
report['summary'] = summary

with open(REPORT_PATH, 'w', encoding='utf-8') as out:
    json.dump(report, out, indent=2)

print('RULE HYGIENE REPORT')
print('checked:', summary['total_rules_checked'])
print('files with errors:', summary['files_with_errors'])
if summary['files_with_errors']:
    for f in report['files']:
        if f['errors']:
            print(f"- {f['path']}: {f['errors']} -> {f.get('suggestions')}")
if summary['ui_artifacts_missing']:
    print('Missing UI artifacts:', summary['ui_artifacts_missing'])
print('Full JSON report written to', REPORT_PATH)

