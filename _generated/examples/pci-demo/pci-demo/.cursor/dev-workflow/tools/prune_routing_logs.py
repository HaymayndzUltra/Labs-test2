#!/usr/bin/env python3
import os
import sys
import time
from datetime import datetime, timedelta, timezone

ROOT = '/workspace'
LOG_DIR = os.path.join(ROOT, '.cursor', 'dev-workflow', 'routing_logs')

USAGE = """
Usage:
  python3 .cursor/dev-workflow/tools/prune_routing_logs.py [--dry-run] [--hot-days N] [--cold-days N]

Defaults:
  --dry-run   : do not delete, only print actions
  --hot-days  : 90 (retain recent logs)
  --cold-days : 730 (2 years; anything older is printed for archival)
"""

def parse_args(argv):
    dry = '--dry-run' in argv
    def get_int(flag, default):
        if flag in argv:
            try:
                return int(argv[argv.index(flag)+1])
            except Exception:
                pass
        return default
    hot = get_int('--hot-days', 90)
    cold = get_int('--cold-days', 730)
    return dry, hot, cold

def main():
    if not os.path.isdir(LOG_DIR):
        print('No routing_logs dir found, nothing to prune')
        return
    dry, hot_days, cold_days = parse_args(sys.argv[1:])
    now = datetime.now(timezone.utc)
    hot_cut = now - timedelta(days=hot_days)
    cold_cut = now - timedelta(days=cold_days)
    to_delete = []
    to_archive = []
    for fn in os.listdir(LOG_DIR):
        if not fn.endswith('.json'):
            continue
        p = os.path.join(LOG_DIR, fn)
        try:
            st = os.stat(p)
            mtime = datetime.fromtimestamp(st.st_mtime, tz=timezone.utc)
            if mtime < cold_cut:
                to_archive.append(p)
            elif mtime < hot_cut:
                to_delete.append(p)
        except Exception:
            continue
    print(f'hot retention cutoff: {hot_cut.isoformat()}')
    print(f'cold archival cutoff: {cold_cut.isoformat()}')
    print('ARCHIVE CANDIDATES (older than cold cutoff):')
    for p in sorted(to_archive):
        print('  ARCHIVE:', p)
    print('DELETE CANDIDATES (older than hot cutoff):')
    for p in sorted(to_delete):
        print('  DELETE :', p)
    if not dry:
        for p in to_delete:
            try:
                os.remove(p)
            except Exception as e:
                print('  WARN  : could not delete', p, e)
        print(f'Deleted {len(to_delete)} files')
    else:
        print('Dry-run: no files deleted')

if __name__ == '__main__':
    if any(arg in ('-h','--help') for arg in sys.argv[1:]):
        print(USAGE.strip())
        sys.exit(0)
    main()

