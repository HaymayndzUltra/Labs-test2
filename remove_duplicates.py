#!/usr/bin/env python3
"""
Script to remove duplicate rules, keeping the most comprehensive one
"""
import os
import glob
from collections import defaultdict

def get_rule_priority(file_path):
    """Determine priority for keeping a rule (higher number = keep)"""
    priority = 0
    
    # Master rules have highest priority
    if 'master-rules' in file_path:
        priority += 1000
    
    # Common rules have medium priority
    elif 'common-rules' in file_path:
        priority += 500
    
    # Prefer shorter, cleaner names
    filename = os.path.basename(file_path)
    if not any(char.isdigit() for char in filename):
        priority += 100
    
    # Prefer files without special characters
    if not any(char in filename for char in ['-', '_', '--', '---']):
        priority += 50
    
    # Prefer files with standard naming
    if filename.count('-') <= 2:
        priority += 25
    
    return priority

def remove_duplicates():
    """Remove duplicate rules, keeping the highest priority one"""
    rule_files = glob.glob('.cursor/rules/**/*.mdc', recursive=True)
    
    # Group by filename similarity (same base technology)
    groups = defaultdict(list)
    
    for file_path in rule_files:
        filename = os.path.basename(file_path)
        
        # Extract base technology name
        base_name = filename.replace('.mdc', '')
        
        # Remove version numbers and special suffixes
        base_name = base_name.split('---')[0]
        base_name = base_name.split('----')[0]
        base_name = base_name.split('-----')[0]
        base_name = base_name.split('------')[0]
        base_name = base_name.split('--')[0]
        base_name = base_name.split('_')[0]
        
        # Handle special cases
        if base_name.startswith('popular'):
            base_name = 'popular'
        elif base_name.startswith('official'):
            base_name = 'official'
        elif base_name.startswith('typescript'):
            base_name = 'typescript'
        elif base_name.startswith('python'):
            base_name = 'python'
        
        groups[base_name].append(file_path)
    
    # Find groups with duplicates
    duplicates_to_remove = []
    
    for base_name, files in groups.items():
        if len(files) > 1:
            # Sort by priority (highest first)
            files.sort(key=get_rule_priority, reverse=True)
            
            # Keep the first (highest priority), remove the rest
            keep_file = files[0]
            remove_files = files[1:]
            
            print(f"Group '{base_name}':")
            print(f"  KEEP: {keep_file}")
            for remove_file in remove_files:
                print(f"  REMOVE: {remove_file}")
                duplicates_to_remove.append(remove_file)
            print()
    
    return duplicates_to_remove

def main():
    """Remove duplicate rules"""
    duplicates = remove_duplicates()
    
    if not duplicates:
        print("No duplicates to remove!")
        return
    
    print(f"Found {len(duplicates)} duplicate files to remove.")
    print("\nRemoving duplicates...")
    
    removed_count = 0
    for file_path in duplicates:
        try:
            os.remove(file_path)
            print(f"REMOVED: {file_path}")
            removed_count += 1
        except Exception as e:
            print(f"ERROR removing {file_path}: {e}")
    
    print(f"\nSuccessfully removed {removed_count} duplicate files.")

if __name__ == "__main__":
    main()
