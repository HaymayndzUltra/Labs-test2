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
                # basic check for required fields and simple type validation
                required = ['session_id','timestamp','decision','rules_considered','winning_rule']
                for k in required:
                    if k not in doc:
                        errors.append({'path':path,'error':f'missing {k}'})
                # only proceed with type checks if keys exist
                if all(k in doc for k in required):
                    if not isinstance(doc['session_id'], str) or not doc['session_id'].strip():
                        errors.append({'path':path,'error':'session_id must be non-empty string'})
                    if not isinstance(doc['timestamp'], str) or not doc['timestamp'].strip():
                        errors.append({'path':path,'error':'timestamp must be non-empty string'})
                    if not isinstance(doc['decision'], str):
                        errors.append({'path':path,'error':'decision must be string'})
                    if not isinstance(doc['winning_rule'], str):
                        errors.append({'path':path,'error':'winning_rule must be string'})
                    rc = doc['rules_considered']
                    if not isinstance(rc, list):
                        errors.append({'path':path,'error':'rules_considered must be array'})
                    else:
                        for i, v in enumerate(rc):
                            if not isinstance(v, str) or not v:
                                errors.append({'path':path,'error':f'rules_considered[{i}] must be non-empty string'})
        except Exception as e:
            errors.append({'path':path,'error':str(e)})
    if errors:
        print('ROUTING LOG SCHEMA ERRORS')
        print(json.dumps(errors, indent=2))
        raise SystemExit(2)
    print('routing_log_check OK')

if __name__ == '__main__':
    main()

