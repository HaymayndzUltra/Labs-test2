#!/usr/bin/env python3
import os, sys, subprocess

def _detect_repo_root():
    # 1) environment overrides
    for key in ('WORKSPACE', 'GITHUB_WORKSPACE', 'CURSOR_WORKSPACE'):
        val = os.getenv(key)
        if val and (os.path.exists(os.path.join(val, '.cursor')) or os.path.exists(os.path.join(val, '.git'))):
            return os.path.abspath(val)
    # 2) ascend from this file
    here = os.path.abspath(__file__)
    d = os.path.dirname(here)
    while True:
        if os.path.exists(os.path.join(d, '.cursor')) or os.path.exists(os.path.join(d, '.git')):
            return d
        parent = os.path.dirname(d)
        if parent == d:
            break
        d = parent
    # 3) fallback
    return os.getcwd()

ROOT = _detect_repo_root()
CURSOR = os.path.join(ROOT, '.cursor')
SNAP_DIR = os.path.join(CURSOR, 'dev-workflow', 'snapshots')
FRAMEWORKS = os.path.join(ROOT, 'frameworks')

def run(cmd):
    print('> ' + ' '.join(cmd))
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    print(res.stdout)
    return res.returncode == 0

def main():
    ok = True
    advisory = os.getenv('GOVERNOR_ADVISORY_MODE', 'false').lower() in ('1','true','yes','on')
    # 1) Policy DSL lint
    ok &= run(['python3', os.path.join(CURSOR, 'dev-workflow', 'policy-dsl', 'lint_policy.py')])
    # 2) Routing log schema check
    ok &= run(['python3', os.path.join(CURSOR, 'dev-workflow', 'ci', 'checks', 'routing_log_check.py')])
    # 3) Rule hygiene (includes UI schema presence)
    ok &= run(['python3', os.path.join(CURSOR, 'dev-workflow', 'ci', 'rule_hygiene.py')])
    # 4) Context snapshot check
    ok &= run(['python3', os.path.join(CURSOR, 'dev-workflow', 'ci', 'checks', 'context_snapshot_check.py')])
    # 5) F8 waiver check
    ok &= run(['python3', os.path.join(CURSOR, 'dev-workflow', 'ci', 'checks', 'f8_waiver_check.py')])
    # Ensure frameworks/.snapshot_rev exists using latest snapshot if present
    try:
        os.makedirs(FRAMEWORKS, exist_ok=True)
        snaps = [p for p in os.listdir(SNAP_DIR) if p.startswith('snap-') and p.endswith('.json')]
        snaps.sort()
        if snaps:
            import json
            latest = os.path.join(SNAP_DIR, snaps[-1])
            sid = json.load(open(latest)).get('snapshot_id')
            if sid:
                with open(os.path.join(FRAMEWORKS, '.snapshot_rev'), 'w') as f:
                    f.write(sid)
    except Exception as e:
        print('warn: could not ensure frameworks/.snapshot_rev:', e)
    # 6) Manifests/checksums/security-zero/snapshot-consistency runner
    ok &= run(['python3', os.path.join(CURSOR, 'dev-workflow', 'ci', 'run_gates.py')])

    if not ok:
        if advisory:
            print('ADVISORY MODE: One or more checks failed; not failing the job')
            print('RESULT: ADVISORY-WARN')
            sys.exit(0)
        print('RESULT: FAIL')
        sys.exit(1)
    print('RESULT: PASS')

if __name__ == '__main__':
    main()

