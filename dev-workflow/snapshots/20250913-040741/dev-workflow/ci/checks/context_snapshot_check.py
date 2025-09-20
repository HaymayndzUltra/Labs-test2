#!/usr/bin/env python3
import os
import json

SNAP_DIR = '/workspace/.cursor/dev-workflow/snapshots'

def main():
    if not os.path.isdir(SNAP_DIR):
        print('no snapshots dir; failing context snapshot check')
        raise SystemExit(2)
    # require at least one snapshot file
    entries = [n for n in os.listdir(SNAP_DIR) if n.endswith('.json')]
    if not entries:
        print('no snapshot JSONs; failing context snapshot check')
        raise SystemExit(2)
    print('context_snapshot_check OK')

if __name__ == '__main__':
    main()

