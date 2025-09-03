#!/usr/bin/env python3
import hashlib, os, sys, yaml

CFG = '/workspace/dev-workflow/ci/gates_config.yaml'

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
        p = os.path.join('/workspace', a['path']) if not a['path'].startswith('/workspace') else a['path']
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
    snap = open('/workspace/frameworks/.snapshot_rev','r').read().strip()
    passed = True

    # Security
    sec = cfg['paths']['security']
    passed &= check_manifest_artifacts(os.path.join('/workspace', sec['manifest']))
    # Critical zero gate: inspect findings summary
    f = load_yaml(os.path.join('/workspace', sec['findings']))
    crit = f.get('summary',{}).get('critical_open')
    if crit != 0:
        print(f"security_critical_zero: FAIL critical_open={crit}")
        passed = False
    # Snapshot consistency across key files
    sec_paths = [os.path.join('/workspace', sec['manifest']), os.path.join('/workspace', sec['findings']), os.path.join('/workspace', sec['exceptions'])]
    passed &= check_snapshot_consistency(snap, sec_paths)

    # QA
    qa = cfg['paths']['qa']
    passed &= check_manifest_artifacts(os.path.join('/workspace', qa['manifest']))
    qa_paths = [os.path.join('/workspace', qa['manifest'])]
    passed &= check_snapshot_consistency(snap, qa_paths)

    # Observability
    obs = cfg['paths']['observability']
    passed &= check_manifest_artifacts(os.path.join('/workspace', obs['manifest']))
    obs_paths = [os.path.join('/workspace', obs['manifest'])]
    passed &= check_snapshot_consistency(snap, obs_paths)

    # Planning FE/BE/Central
    pl = cfg['paths']['planning']
    for key in ['fe_manifest','be_manifest','central_manifest']:
        p = os.path.join('/workspace', pl[key])
        if os.path.exists(p):
            passed &= check_manifest_artifacts(p)
            passed &= check_snapshot_consistency(snap, [p])

    if not passed:
        print('RESULT: FAIL')
        sys.exit(1)
    print('RESULT: PASS')

if __name__ == '__main__':
    main()