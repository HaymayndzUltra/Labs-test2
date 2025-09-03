#!/usr/bin/env python3
import json, os, sys
from pathlib import Path

CORE = Path('design/tokens/core.json')
SEM = Path('design/tokens/semantic.json')
OUT_DIR = Path('data/pipelines/out')
OUT = OUT_DIR / 'tokens.json'

def read_json(p: Path):
    with open(p, 'r', encoding='utf-8') as f:
        return json.load(f)


def validate_tokens(data: dict):
    # Minimal validation: required top-level keys exist
    if 'typography' not in data.get('core', {}) and 'colors' not in data.get('core', {}):
        raise ValueError('core.typography or core.colors required')


def main():
    core = read_json(CORE)
    sem = read_json(SEM)
    merged = { 'core': core, 'semantic': sem }
    validate_tokens(merged)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(merged, f, indent=2)
    print(f'Wrote {OUT}')

if __name__ == '__main__':
    main()