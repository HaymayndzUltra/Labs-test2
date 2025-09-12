#!/usr/bin/env python3
import os
import json
import sys
try:
    from jsonschema import validate, ValidationError
    HAS_JSONSCHEMA = True
except Exception:
    HAS_JSONSCHEMA = False

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
SCHEMA = os.path.join(ROOT, '.cursor', 'dev-workflow', 'policy-dsl', '_schema', 'schema.json')

def main():
    import glob
    schema = json.load(open(SCHEMA))
    errors = []
    import os as _os
    for path in glob.glob(_os.path.join(ROOT, '.cursor', 'dev-workflow', 'policy-dsl', '*.json')):
        # skip schema files or internal schema folder
        fname = os.path.basename(path)
        if fname == 'schema.json' or fname.startswith('_'):
            continue
        try:
            doc = json.load(open(path))
            if HAS_JSONSCHEMA:
                validate(instance=doc, schema=schema)
            else:
                # basic check: required keys present
                for k in ['name','scope','priority','actions']:
                    if k not in doc:
                        errors.append({'path':path,'error':f'missing {k}'})
        except Exception as e:
            errors.append({'path':path,'error':str(e)})
    if errors:
        print('POLICY LINT ERRORS')
        print(json.dumps(errors, indent=2))
        sys.exit(2)
    print('OK')

if __name__ == '__main__':
    main()

