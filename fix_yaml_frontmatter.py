#!/usr/bin/env python3
"""
Script to fix malformed YAML frontmatter in .mdc files
"""
import os
import re
import glob
from typing import List

def fix_yaml_frontmatter(file_path: str) -> bool:
    """
    Fix YAML frontmatter in a single .mdc file.

    Returns True when the file was modified, False otherwise.
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if file has proper YAML frontmatter
    if not content.startswith('---\n'):
        print(f"SKIP: {file_path} - No YAML frontmatter")
        return False
    
    # Find the end of YAML frontmatter
    lines = content.split('\n')
    yaml_end = -1
    for i, line in enumerate(lines):
        if i > 0 and line.strip() == '---':
            yaml_end = i
            break
    
    if yaml_end == -1:
        print(f"ERROR: {file_path} - No closing YAML separator")
        return False
    
    # Extract YAML content
    yaml_lines = lines[1:yaml_end]
    yaml_content = '\n'.join(yaml_lines)
    
    # Extract main content (everything after YAML)
    main_content = '\n'.join(lines[yaml_end + 1:])
    
    # Remove extra --- separators from main content
    # Keep only the first occurrence of --- if it appears in content
    main_content_cleaned = re.sub(r'^---\s*$', '', main_content, flags=re.MULTILINE)
    main_content_cleaned = re.sub(r'\n\n+---\s*$', '', main_content_cleaned, flags=re.MULTILINE)
    
    # Reconstruct the file
    fixed_content = f"---\n{yaml_content}\n---\n\n{main_content_cleaned}"
    
    # Write back if changed
    if fixed_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        print(f"FIXED: {file_path}")
        return True
    else:
        print(f"OK: {file_path}")
        return False

def main() -> None:
    """Find and fix YAML frontmatter across all .mdc rule files."""
    rule_files: List[str] = glob.glob('.cursor/rules/**/*.mdc', recursive=True)
    
    fixed_count = 0
    for file_path in rule_files:
        if fix_yaml_frontmatter(file_path):
            fixed_count += 1
    
    print(f"\nFixed {fixed_count} files out of {len(rule_files)} total files")

if __name__ == "__main__":
    main()
