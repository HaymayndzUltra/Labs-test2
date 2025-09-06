#!/usr/bin/env python3
import os, sys, json, glob, yaml

ROOT = '/workspace'
CURSOR = os.path.join(ROOT, '.cursor')

sys.path.insert(0, os.path.join(CURSOR, 'dev-workflow', 'router'))

from importlib import util

def load_router():
    path = os.path.join(CURSOR, 'dev-workflow', 'router', 'router.py')
    spec = util.spec_from_file_location('router', path)
    mod = util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod

def run_case(router, case):
    name = case.get('name')
    context = case.get('context') or {}
    expect = case.get('expect_decision')
    res = router.route_decision(context)
    got = res.get('decision')
    ok = (got == expect)
    return ok, name, expect, got

def main():
    router = load_router()
    cases = []
    for path in glob.glob(os.path.join(ROOT, 'policy-tests', '*.yaml')):
        with open(path, 'r') as f:
            docs = list(yaml.safe_load_all(f)) if '---' in f.read(4) else None
        # re-open to actually load content as list if not multi-doc
        with open(path, 'r') as f:
            data = yaml.safe_load(f)
        if isinstance(data, list):
            cases.extend(data)
        elif isinstance(data, dict):
            cases.append(data)
    failures = []
    for c in cases:
        ok, name, exp, got = run_case(router, c)
        print(f"CASE {name}: expect={exp} got={got} => {'OK' if ok else 'FAIL'}")
        if not ok:
            failures.append({'name': name, 'expect': exp, 'got': got})
    if failures:
        print('POLICY TEST FAILURES:')
        print(json.dumps(failures, indent=2))
        sys.exit(2)
    print('All policy decision tests passed')

if __name__ == '__main__':
    main()

