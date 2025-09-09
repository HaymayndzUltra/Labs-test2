#!/usr/bin/env python3
import os, sys, glob
rules_dir = os.path.join('.cursor','rules')
mdc_files = glob.glob(os.path.join(rules_dir, '*.mdc'))
if not mdc_files:
    print('[RULES] No .mdc rules found; failing pre-commit.')
    sys.exit(1)
print(f'[RULES] Found {len(mdc_files)} rule files.')
