#!/usr/bin/env python3
"""
Convert scraped cursor rules to proper AI Governor Framework format.
Fixes synchronization issues for rule routing system.
"""

import os
import json
import re
from pathlib import Path
from typing import Dict, List, Tuple

def extract_technology_from_filename(filename: str) -> str:
    """Extract technology name from rules filename."""
    # Remove 'rules-' prefix and '.txt' suffix
    tech = filename.replace('rules-', '').replace('.txt', '')
    # Handle special cases
    tech_mapping = {
        'next-js': 'nextjs',
        'react-native': 'react-native', 
        'tailwind-css': 'tailwindcss',
        'three-js': 'threejs',
        'vue-js': 'vuejs',
        'web3-js': 'web3js',
        'node-js': 'nodejs',
        'asp-net-core': 'aspnet',
        'spring-boot': 'spring',
        '--net': 'dotnet',
        '--appcommon': 'appcommon',
        'pixi-js': 'pixijs'
    }
    return tech_mapping.get(tech, tech)

def generate_yaml_frontmatter(tech: str, description_hint: str = "") -> str:
    """Generate YAML frontmatter for rule file based on technology."""
    
    # Define technology categories and their attributes
    tech_categories = {
        'frontend': {
            'tags': ['frontend', 'ui', 'component'],
            'triggers': ['frontend', 'ui', 'component', 'interface', 'web'],
            'scope': 'frontend'
        },
        'backend': {
            'tags': ['backend', 'api', 'server'],
            'triggers': ['backend', 'api', 'server', 'database'],
            'scope': 'backend'
        },
        'fullstack': {
            'tags': ['fullstack', 'framework'],
            'triggers': ['fullstack', 'framework', 'app'],
            'scope': 'fullstack'
        },
        'mobile': {
            'tags': ['mobile', 'app'],
            'triggers': ['mobile', 'app', 'ios', 'android'],
            'scope': 'mobile'
        },
        'language': {
            'tags': ['language', 'programming'],
            'triggers': ['programming', 'language', 'syntax'],
            'scope': 'language'
        },
        'database': {
            'tags': ['database', 'data'],
            'triggers': ['database', 'data', 'storage'],
            'scope': 'data'
        },
        'devops': {
            'tags': ['devops', 'deployment', 'infrastructure'],
            'triggers': ['devops', 'deploy', 'infrastructure', 'ci', 'cd'],
            'scope': 'devops'
        },
        'testing': {
            'tags': ['testing', 'qa'],
            'triggers': ['test', 'testing', 'qa', 'quality'],
            'scope': 'testing'
        }
    }
    
    # Categorize technologies
    categorization = {
        # Frontend frameworks/libraries
        'react': 'frontend', 'vue': 'frontend', 'angular': 'frontend', 'svelte': 'frontend',
        'sveltekit': 'frontend', 'vuejs': 'frontend', 'nextjs': 'fullstack', 'nuxtjs': 'fullstack',
        'remix': 'fullstack', 'astro': 'frontend', 'gatsby': 'frontend',
        
        # UI/CSS frameworks
        'tailwindcss': 'frontend', 'tailwind': 'frontend', 'bootstrap': 'frontend', 
        'css': 'frontend', 'html': 'frontend', 'ui': 'frontend', 'ux': 'frontend',
        'shadcn-ui': 'frontend', 'radix-ui': 'frontend', 'daisyui': 'frontend',
        
        # Backend frameworks
        'fastapi': 'backend', 'django': 'backend', 'flask': 'backend', 'rails': 'backend',
        'spring': 'backend', 'nestjs': 'backend', 'fastify': 'backend', 'express': 'backend',
        'laravel': 'backend', 'phoenix': 'backend',
        
        # Mobile
        'react-native': 'mobile', 'flutter': 'mobile', 'ionic': 'mobile', 'expo': 'mobile',
        'swift': 'mobile', 'swiftui': 'mobile', 'android': 'mobile', 'kotlin': 'mobile',
        
        # Languages
        'javascript': 'language', 'typescript': 'language', 'python': 'language', 
        'rust': 'language', 'go': 'language', 'golang': 'language', 'java': 'language',
        'csharp': 'language', 'cpp': 'language', 'c': 'language', 'php': 'language',
        'ruby': 'language', 'elixir': 'language', 'lua': 'language', 'swift': 'language',
        
        # Databases
        'mongodb': 'database', 'prisma': 'database', 'supabase': 'database', 
        'firebase': 'database', 'firestore': 'database',
        
        # DevOps/Infrastructure  
        'docker': 'devops', 'kubernetes': 'devops', 'terraform': 'devops',
        'ansible': 'devops', 'azure': 'devops', 'aws': 'devops', 'cloud': 'devops',
        
        # Testing
        'testing': 'testing', 'playwright': 'testing', 'rspec': 'testing',
        
        # Special cases
        'popular': 'frontend',  # Default to frontend for popular rules
        'official': 'frontend', # Default to frontend for official rules
    }
    
    category = categorization.get(tech, 'language')  # Default to language
    attrs = tech_categories[category]
    
    # Add technology-specific tags and triggers
    tags = attrs['tags'] + [tech]
    triggers = attrs['triggers'] + [tech, tech.replace('-', ''), tech.replace('_', '')]
    
    # Create description
    description = f"Expert guidance and best practices for {tech.title()} development"
    if description_hint:
        description = description_hint[:100] + "..." if len(description_hint) > 100 else description_hint
    
    frontmatter = f'''---
description: "TAGS: [{','.join(tags)}] | TRIGGERS: {','.join(triggers)} | SCOPE: {attrs['scope']} | DESCRIPTION: {description}"
alwaysApply: false
---

'''
    return frontmatter

def split_large_file(content: str, max_lines: int = 1000) -> List[Tuple[str, str]]:
    """Split large rule file into manageable chunks."""
    lines = content.split('\n')
    if len(lines) <= max_lines:
        return [("", content)]
    
    chunks = []
    current_chunk = []
    current_section = ""
    
    for line in lines:
        # Detect section headers (lines that look like titles/headers)
        if re.match(r'^(#|##|###|\*\*|==|--)', line.strip()) or line.strip().isupper():
            if current_chunk and len(current_chunk) > 100:  # Minimum chunk size
                chunks.append((current_section, '\n'.join(current_chunk)))
                current_chunk = []
            current_section = line.strip()[:50]  # Use first 50 chars as section name
        
        current_chunk.append(line)
        
        # If we reach max_lines, force a split
        if len(current_chunk) >= max_lines:
            chunks.append((current_section or f"part-{len(chunks)+1}", '\n'.join(current_chunk)))
            current_chunk = []
            current_section = ""
    
    # Add remaining content
    if current_chunk:
        chunks.append((current_section or f"part-{len(chunks)+1}", '\n'.join(current_chunk)))
    
    return chunks

def convert_rule_file(input_path: str, output_dir: str, manifest_data: Dict) -> List[str]:
    """Convert a single rule file to proper format."""
    filename = os.path.basename(input_path)
    tech = extract_technology_from_filename(filename)
    
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            content = f.read().strip()
    except Exception as e:
        print(f"Error reading {filename}: {e}")
        return []
    
    if not content:
        print(f"Skipping empty file: {filename}")
        return []
    
    # Extract description hint from first few lines
    first_lines = content.split('\n')[:5]
    description_hint = ' '.join(first_lines).strip()[:200]
    
    # Check if file is too large (rules-popular.txt case)
    lines_count = len(content.split('\n'))
    if lines_count > 1500:  # Large file threshold
        print(f"Splitting large file {filename} ({lines_count} lines)")
        chunks = split_large_file(content, max_lines=800)
        converted_files = []
        
        for i, (section_name, chunk_content) in enumerate(chunks):
            if i == 0:
                # First chunk keeps original name
                output_filename = f"{tech}.mdc"
            else:
                # Additional chunks get numbered names
                safe_section = re.sub(r'[^a-zA-Z0-9_-]', '-', section_name)[:30]
                output_filename = f"{tech}-{safe_section}-{i}.mdc"
            
            frontmatter = generate_yaml_frontmatter(tech, description_hint)
            full_content = frontmatter + chunk_content
            
            output_path = os.path.join(output_dir, output_filename)
            os.makedirs(output_dir, exist_ok=True)
            
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(full_content)
            
            converted_files.append(output_filename)
            print(f"Created: {output_filename}")
        
        return converted_files
    else:
        # Normal file processing
        frontmatter = generate_yaml_frontmatter(tech, description_hint)
        full_content = frontmatter + content
        
        output_filename = f"{tech}.mdc"
        output_path = os.path.join(output_dir, output_filename)
        
        os.makedirs(output_dir, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(full_content)
        
        print(f"Converted: {filename} -> {output_filename}")
        return [output_filename]

def main():
    """Main conversion function."""
    # Paths
    script_dir = Path(__file__).parent
    input_dir = script_dir / "scripts" / "rules" / "text"
    manifest_path = script_dir / "scripts" / "rules" / ".manifest.json"
    output_dir = script_dir / ".cursor" / "rules" / "project-rules"
    
    # Load manifest data
    manifest_data = {}
    if manifest_path.exists():
        try:
            with open(manifest_path, 'r') as f:
                manifest_data = {item['slug']: item for item in json.load(f)}
        except Exception as e:
            print(f"Warning: Could not load manifest: {e}")
    
    if not input_dir.exists():
        print(f"Error: Input directory not found: {input_dir}")
        return
    
    print(f"Converting rules from {input_dir} to {output_dir}")
    print("=" * 60)
    
    # Get all .txt rule files
    txt_files = list(input_dir.glob("rules-*.txt"))
    
    if not txt_files:
        print("No rule files found to convert.")
        return
    
    total_converted = 0
    total_files_created = 0
    
    for txt_file in sorted(txt_files):
        converted_files = convert_rule_file(str(txt_file), str(output_dir), manifest_data)
        if converted_files:
            total_converted += 1
            total_files_created += len(converted_files)
    
    print("=" * 60)
    print(f"Conversion complete!")
    print(f"- Original files processed: {total_converted}")
    print(f"- New .mdc files created: {total_files_created}")
    print(f"- Output directory: {output_dir}")
    print("\nRule files are now properly formatted for the AI Governor Framework routing system.")

if __name__ == "__main__":
    main()
