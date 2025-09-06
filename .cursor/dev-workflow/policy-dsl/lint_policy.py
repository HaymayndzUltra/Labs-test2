#!/usr/bin/env python3
import json
import sys
try:
    from jsonschema import validate, ValidationError
    HAS_JSONSCHEMA = True
except Exception:
    HAS_JSONSCHEMA = False

SCHEMA = '/workspace/.cursor/dev-workflow/policy-dsl/schema.json'

def main():
    import glob
    schema = json.load(open(SCHEMA))
    errors = []
    for path in glob.glob('/workspace/.cursor/dev-workflow/policy-dsl/*.json'):
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

