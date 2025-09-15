#!/usr/bin/env python3
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]

def check_precedence_parity() -> int:
    prec_file = ROOT / '.cursor' / 'rules' / 'master-rules' / '9-governance-precedence.mdc'
    base = [
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
    if not prec_file.exists():
        print('[GATES] precedence file missing')
        return 2
    text = prec_file.read_text(encoding='utf-8')
    # Parse only the Priority Order block to avoid YAML frontmatter and notes
    lower = text.lower()
    start = lower.find('priority order')
    block = text[start: start + 2000] if start != -1 else text
    lines = [l.strip() for l in block.splitlines() if l.strip().startswith('-') and not l.strip().startswith('---')]
    # Only collect the first 9 items
    order = []
    for l in lines:
        tok = l.lstrip('-').strip().split(' ')[0]
        order.append(tok)
        if len(order) >= 9:
            break
    if order != base:
        print('[GATES] precedence mismatch')
        print('expected:', json.dumps(base))
        print('found   :', json.dumps(order))
        return 1
    print('[GATES] precedence parity OK')
    return 0

def main() -> int:
    failures = 0
    rc = check_precedence_parity()
    if rc != 0:
        failures += 1
    return 1 if failures else 0

if __name__ == '__main__':
    sys.exit(main())

#!/usr/bin/env python3
import hashlib, os, sys, yaml, importlib.util
from pathlib import Path


def _detect_repo_root() -> Path:
    # 1) environment overrides
    for key in ("WORKSPACE", "GITHUB_WORKSPACE", "CURSOR_WORKSPACE"):
        val = os.getenv(key)
        if val:
            p = Path(val).resolve()
            if (p / '.cursor').exists() or (p / '.git').exists():
                return p
    # 2) helper if present
    try:
        helper_path = Path(__file__).resolve().parents[2] / 'common' / 'paths.py'
        if helper_path.exists():
            spec = importlib.util.spec_from_file_location('cursor_paths', str(helper_path))
            mod = importlib.util.module_from_spec(spec)
            assert spec.loader is not None
            spec.loader.exec_module(mod)  # type: ignore[attr-defined]
            root = mod.get_repo_root()
            return root if isinstance(root, Path) else Path(str(root)).resolve()
    except Exception:
        pass
    # 3) ascend from this file
    here = Path(__file__).resolve()
    for cand in [here.parent] + list(here.parents):
        if (cand / '.cursor').exists() or (cand / '.git').exists():
            return cand
    # 4) fallback
    return Path.cwd().resolve()


ROOT = _detect_repo_root()
CFG = str(ROOT / '.cursor' / 'dev-workflow' / 'ci' / 'gates_config.yaml')

def sha256_file(path):
    with open(path,'rb') as f:
        return hashlib.sha256(f.read()).hexdigest()

def load_yaml(path):
    with open(path,'r') as f:
        return yaml.safe_load(f)

def check_manifest_artifacts(manifest_path):
    m = load_yaml(manifest_path)
    ok = True
    for a in m.get('artifacts', []):
        ap = a['path']
        p = str(ROOT / ap) if not os.path.isabs(ap) else ap
        if not os.path.exists(p):
            print(f"evidence_present: MISSING {p}")
            ok = False
            continue
        h = sha256_file(p)
        if h != a.get('sha256'):
            print(f"checksums_present: MISMATCH for {p}: have {h}, manifest {a.get('sha256')}")
            ok = False
    return ok

def check_snapshot_consistency(snapshot_expected, paths):
    ok = True
    for p in paths:
        y = load_yaml(p)
        s = y.get('snapshot_rev')
        if s != snapshot_expected:
            print(f"snapshot_consistency: {p} has {s} expected {snapshot_expected}")
            ok = False
    return ok

def main():
    cfg = load_yaml(CFG)
    snap_file = ROOT / 'frameworks' / '.snapshot_rev'
    snap = snap_file.read_text().strip() if snap_file.exists() else ''
    passed = True

    # Security
    sec = cfg['paths']['security']
    passed &= check_manifest_artifacts(str(ROOT / sec['manifest']))
    # Critical zero gate: inspect findings summary
    f = load_yaml(str(ROOT / sec['findings']))
    crit = f.get('summary',{}).get('critical_open')
    if crit != 0:
        print(f"security_critical_zero: FAIL critical_open={crit}")
        passed = False
    # Snapshot consistency across key files
    sec_paths = [str(ROOT / sec['manifest']), str(ROOT / sec['findings']), str(ROOT / sec['exceptions'])]
    passed &= check_snapshot_consistency(snap, sec_paths)

    # QA
    qa = cfg['paths']['qa']
    passed &= check_manifest_artifacts(str(ROOT / qa['manifest']))
    qa_paths = [str(ROOT / qa['manifest'])]
    passed &= check_snapshot_consistency(snap, qa_paths)

    # Observability
    obs = cfg['paths']['observability']
    passed &= check_manifest_artifacts(str(ROOT / obs['manifest']))
    obs_paths = [str(ROOT / obs['manifest'])]
    passed &= check_snapshot_consistency(snap, obs_paths)

    # Planning FE/BE/Central
    pl = cfg['paths']['planning']
    for key in ['fe_manifest','be_manifest','central_manifest']:
        p = str(ROOT / pl[key])
        if os.path.exists(p):
            passed &= check_manifest_artifacts(p)
            passed &= check_snapshot_consistency(snap, [p])

    if not passed:
        print('RESULT: FAIL')
        sys.exit(1)
    print('RESULT: PASS')

if __name__ == '__main__':
    main()