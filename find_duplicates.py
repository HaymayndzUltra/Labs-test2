#!/usr/bin/env python3
"""
Script to find duplicate rules based on content similarity
"""
import os
import re
import glob
import hashlib
from collections import defaultdict

def get_rule_content(file_path):
    """Extract the main content (excluding YAML frontmatter) from a rule file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the end of YAML frontmatter
    lines = content.split('\n')
    yaml_end = -1
    for i, line in enumerate(lines):
        if i > 0 and line.strip() == '---':
            yaml_end = i
            break
    
    if yaml_end == -1:
        return content
    
    # Extract main content
    main_content = '\n'.join(lines[yaml_end + 1:])
    return main_content.strip()

def normalize_content(content):
    """Normalize content for comparison"""
    # Remove extra whitespace
    content = re.sub(r'\s+', ' ', content)
    # Remove common variations
    content = re.sub(r'You are an? [^.]*\.', 'You are an expert.', content)
    content = re.sub(r'Key Principles?[:\s]*', '', content)
    content = re.sub(r'## [^#\n]*', '', content)
    content = re.sub(r'### [^#\n]*', '', content)
    return content.lower().strip()

def find_duplicates():
    """Find duplicate rules"""
    rule_files = glob.glob('.cursor/rules/**/*.mdc', recursive=True)
    
    # Group by normalized content
    content_groups = defaultdict(list)
    
    for file_path in rule_files:
        content = get_rule_content(file_path)
        normalized = normalize_content(content)
        
        # Create a hash for exact matching
        content_hash = hashlib.md5(normalized.encode()).hexdigest()
        content_groups[content_hash].append(file_path)
    
    # Find duplicates
    duplicates = []
    for content_hash, files in content_groups.items():
        if len(files) > 1:
            duplicates.append(files)
    
    return duplicates

def main():
    """Find and report duplicates"""
    duplicates = find_duplicates()
    
    if not duplicates:
        print("No duplicate rules found!")
        return
    
    print(f"Found {len(duplicates)} groups of duplicate rules:")
    print()
    
    for i, group in enumerate(duplicates, 1):
        print(f"Group {i}: {len(group)} files")
        for file_path in group:
            print(f"  - {file_path}")
        print()

if __name__ == "__main__":
    main()
