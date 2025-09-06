#!/usr/bin/env python3
import json
try:
    from jsonschema import validate, ValidationError
    HAS_JSONSCHEMA = True
except Exception:
    HAS_JSONSCHEMA = False

SCHEMA = '/workspace/.cursor/dev-workflow/schemas/routing_log.json'

def main():
    import glob
    schema = json.load(open(SCHEMA))
    errors = []
    for path in glob.glob('/workspace/.cursor/dev-workflow/routing_logs/*.json'):
        try:
            doc = json.load(open(path))
            if HAS_JSONSCHEMA:
                validate(instance=doc, schema=schema)
            else:
                # basic check for required fields
                for k in ['session_id','timestamp','decision','rules_considered','winning_rule']:
                    if k not in doc:
                        errors.append({'path':path,'error':f'missing {k}'})
        except Exception as e:
            errors.append({'path':path,'error':str(e)})
    if errors:
        print('ROUTING LOG SCHEMA ERRORS')
        print(json.dumps(errors, indent=2))
        raise SystemExit(2)
    print('routing_log_check OK')

if __name__ == '__main__':
    main()

