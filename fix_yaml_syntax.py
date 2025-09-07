#!/usr/bin/env python3
"""
Fix YAML syntax issues in optimized rules
"""

import os
import re
import glob
from pathlib import Path

def fix_yaml_syntax(file_path):
    """Fix YAML syntax issues in a rule file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if file has YAML frontmatter
    if not content.startswith('---\n'):
        return False
    
    lines = content.split('\n')
    yaml_end = -1
    for i, line in enumerate(lines[1:], 1):
        if line.strip() == '---':
            yaml_end = i
            break
    
    if yaml_end == -1:
        return False
    
    # Extract YAML content
    yaml_lines = lines[1:yaml_end]
    yaml_content = '\n'.join(yaml_lines)
    
    # Fix common syntax issues
    # Fix double brackets in TAGS
    yaml_content = re.sub(r'TAGS: \[\[', 'TAGS: [', yaml_content)
    
    # Fix missing closing brackets
    yaml_content = re.sub(r'TAGS: \[([^\]]*)\s*\|', r'TAGS: [\1] |', yaml_content)
    
    # Fix missing closing brackets in TRIGGERS
    yaml_content = re.sub(r'TRIGGERS: ([^|]*)\s*\|', r'TRIGGERS: [\1] |', yaml_content)
    
    # Ensure proper format
    if 'TAGS: [' not in yaml_content and 'TAGS:' in yaml_content:
        yaml_content = re.sub(r'TAGS: ([^|]*)', r'TAGS: [\1]', yaml_content)
    
    if 'TRIGGERS: [' not in yaml_content and 'TRIGGERS:' in yaml_content:
        yaml_content = re.sub(r'TRIGGERS: ([^|]*)', r'TRIGGERS: [\1]', yaml_content)
    
    # Reconstruct the file
    main_content = '\n'.join(lines[yaml_end + 1:])
    fixed_content = f"---\n{yaml_content}\n---\n\n{main_content}"
    
    # Write back if changed
    if fixed_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        print(f"Fixed YAML syntax: {file_path}")
        return True
    else:
        return False

def main():
    """Fix YAML syntax in all rule files"""
    rule_files = glob.glob('.cursor/rules/**/*.mdc', recursive=True)
    
    fixed_count = 0
    for file_path in rule_files:
        if fix_yaml_syntax(file_path):
            fixed_count += 1
    
    print(f"\nFixed YAML syntax in {fixed_count} files out of {len(rule_files)} total files")

if __name__ == "__main__":
    main()
