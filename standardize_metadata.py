#!/usr/bin/env python3
"""
Script to standardize metadata format in .mdc files
"""
import os
import re
import glob

def standardize_metadata(file_path):
    """Standardize metadata format in a single file"""
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
    
    # Extract main content
    main_content = '\n'.join(lines[yaml_end + 1:])
    
    # Parse existing metadata
    description_match = re.search(r'description:\s*"([^"]*)"', yaml_content)
    always_apply_match = re.search(r'alwaysApply:\s*(true|false)', yaml_content)
    
    if not description_match:
        print(f"ERROR: {file_path} - No description found")
        return False
    
    description = description_match.group(1)
    always_apply = always_apply_match.group(1) if always_apply_match else 'false'
    
    # Parse description components
    parts = [p.strip() for p in description.split('|')]
    
    # Extract components
    tags = []
    triggers = []
    scope = 'project-rules'  # default
    desc_text = ''
    
    for part in parts:
        if part.upper().startswith('TAGS:'):
            tags_text = part.split(':', 1)[1].strip()
            tags = [t.strip() for t in tags_text.split(',') if t.strip()]
        elif part.upper().startswith('TRIGGERS:'):
            triggers_text = part.split(':', 1)[1].strip()
            triggers = [t.strip() for t in triggers_text.split(',') if t.strip()]
        elif part.upper().startswith('SCOPE:'):
            scope = part.split(':', 1)[1].strip()
        elif part.upper().startswith('DESCRIPTION:'):
            desc_text = part.split(':', 1)[1].strip()
    
    # Determine scope based on file path
    if 'master-rules' in file_path:
        scope = 'global'
        if 'alwaysApply' not in yaml_content:
            always_apply = 'true'
    elif 'common-rules' in file_path:
        scope = 'common-rules'
    else:
        scope = 'project-rules'
        always_apply = 'false'
    
    # Clean up tags and triggers
    tags = [t.strip().lower() for t in tags if t.strip()]
    triggers = [t.strip().lower() for t in triggers if t.strip()]
    
    # Remove duplicates while preserving order
    seen_tags = set()
    unique_tags = []
    for tag in tags:
        if tag not in seen_tags:
            unique_tags.append(tag)
            seen_tags.add(tag)
    
    seen_triggers = set()
    unique_triggers = []
    for trigger in triggers:
        if trigger not in seen_triggers:
            unique_triggers.append(trigger)
            seen_triggers.add(trigger)
    
    # Build standardized description
    standardized_desc = f"TAGS: {','.join(unique_tags)} | TRIGGERS: {','.join(unique_triggers)} | SCOPE: {scope} | DESCRIPTION: {desc_text}"
    
    # Build new YAML frontmatter
    new_yaml = f"---\ndescription: \"{standardized_desc}\"\nalwaysApply: {always_apply}\n---"
    
    # Reconstruct the file
    fixed_content = f"{new_yaml}\n\n{main_content}"
    
    # Write back if changed
    if fixed_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        print(f"STANDARDIZED: {file_path}")
        return True
    else:
        print(f"OK: {file_path}")
        return False

def main():
    """Standardize all .mdc files"""
    rule_files = glob.glob('.cursor/rules/**/*.mdc', recursive=True)
    
    standardized_count = 0
    for file_path in rule_files:
        if standardize_metadata(file_path):
            standardized_count += 1
    
    print(f"\nStandardized {standardized_count} files out of {len(rule_files)} total files")

if __name__ == "__main__":
    main()
