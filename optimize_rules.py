#!/usr/bin/env python3
"""
Comprehensive Rule Optimization Script for AI Governor Framework
Optimizes rules for better performance, clarity, and maintainability.
"""

import os
import re
import glob
import json
import hashlib
import yaml
from pathlib import Path
from collections import defaultdict, Counter
from typing import Dict, List, Tuple, Set, Optional
from dataclasses import dataclass

@dataclass
class RuleMetadata:
    """Structured representation of rule metadata"""
    file_path: str
    tags: List[str]
    triggers: List[str]
    scope: str
    description: str
    always_apply: bool
    content: str
    content_hash: str

class RuleOptimizer:
    """Main rule optimization class"""
    
    def __init__(self, rules_dir: str = ".cursor/rules"):
        self.rules_dir = Path(rules_dir)
        self.rules: List[RuleMetadata] = []
        self.duplicates: Dict[str, List[str]] = {}
        self.optimization_report = {
            'files_processed': 0,
            'duplicates_found': 0,
            'metadata_optimized': 0,
            'content_optimized': 0,
            'files_removed': 0,
            'errors': []
        }
    
    def load_rules(self) -> None:
        """Load all rules from the rules directory"""
        print("Loading rules...")
        
        for mdc_file in self.rules_dir.rglob("*.mdc"):
            try:
                metadata = self._parse_rule_file(mdc_file)
                if metadata:
                    self.rules.append(metadata)
            except Exception as e:
                self.optimization_report['errors'].append(f"Error loading {mdc_file}: {e}")
        
        print(f"Loaded {len(self.rules)} rules")
    
    def _parse_rule_file(self, file_path: Path) -> Optional[RuleMetadata]:
        """Parse a single rule file and extract metadata"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract YAML frontmatter
            if not content.startswith('---\n'):
                return None
            
            lines = content.split('\n')
            yaml_end = -1
            for i, line in enumerate(lines[1:], 1):
                if line.strip() == '---':
                    yaml_end = i
                    break
            
            if yaml_end == -1:
                return None
            
            # Parse YAML
            yaml_content = '\n'.join(lines[1:yaml_end])
            yaml_data = yaml.safe_load(yaml_content)
            
            if not yaml_data or 'description' not in yaml_data:
                return None
            
            # Parse description components
            description = yaml_data['description']
            parts = [p.strip() for p in description.split('|')]
            
            tags = []
            triggers = []
            scope = 'project-rules'
            desc_text = ''
            
            for part in parts:
                if part.upper().startswith('TAGS:'):
                    tags_text = part.split(':', 1)[1].strip()
                    tags = [t.strip().lower() for t in tags_text.split(',') if t.strip()]
                elif part.upper().startswith('TRIGGERS:'):
                    triggers_text = part.split(':', 1)[1].strip()
                    triggers = [t.strip().lower() for t in triggers_text.split(',') if t.strip()]
                elif part.upper().startswith('SCOPE:'):
                    scope = part.split(':', 1)[1].strip()
                elif part.upper().startswith('DESCRIPTION:'):
                    desc_text = part.split(':', 1)[1].strip()
            
            # Determine scope from file path
            if 'master-rules' in str(file_path):
                scope = 'global'
            elif 'common-rules' in str(file_path):
                scope = 'common-rules'
            
            # Extract main content
            main_content = '\n'.join(lines[yaml_end + 1:]).strip()
            content_hash = hashlib.md5(main_content.encode()).hexdigest()
            
            return RuleMetadata(
                file_path=str(file_path),
                tags=tags,
                triggers=triggers,
                scope=scope,
                description=desc_text,
                always_apply=yaml_data.get('alwaysApply', False),
                content=main_content,
                content_hash=content_hash
            )
            
        except Exception as e:
            self.optimization_report['errors'].append(f"Error parsing {file_path}: {e}")
            return None
    
    def find_duplicates(self) -> None:
        """Find duplicate rules based on content similarity"""
        print("Finding duplicates...")
        
        content_groups = defaultdict(list)
        for rule in self.rules:
            content_groups[rule.content_hash].append(rule.file_path)
        
        self.duplicates = {hash_val: files for hash_val, files in content_groups.items() if len(files) > 1}
        self.optimization_report['duplicates_found'] = len(self.duplicates)
        
        if self.duplicates:
            print(f"Found {len(self.duplicates)} groups of duplicate rules:")
            for i, (hash_val, files) in enumerate(self.duplicates.items(), 1):
                print(f"  Group {i}: {len(files)} files")
                for file_path in files:
                    print(f"    - {file_path}")
    
    def optimize_metadata(self) -> None:
        """Optimize YAML frontmatter for consistency and efficiency"""
        print("Optimizing metadata...")
        
        # Define standard tag categories
        standard_tags = {
            'global': ['global', 'collaboration', 'quality', 'documentation', 'workflow'],
            'frontend': ['frontend', 'ui', 'component', 'form', 'styling', 'api-calls'],
            'backend': ['backend', 'api', 'database', 'auth', 'deployment', 'testing'],
            'mobile': ['mobile', 'app', 'ios', 'android'],
            'language': ['language', 'programming', 'syntax'],
            'infrastructure': ['storage', 'cache', 'cdn', 'monitoring', 'devops'],
            'testing': ['testing', 'qa', 'quality']
        }
        
        # Collect all tags and triggers for analysis
        all_tags = Counter()
        all_triggers = Counter()
        
        for rule in self.rules:
            for tag in rule.tags:
                all_tags[tag] += 1
            for trigger in rule.triggers:
                all_triggers[trigger] += 1
        
        # Find unused or redundant tags/triggers
        unused_tags = [tag for tag, count in all_tags.items() if count < 2]
        unused_triggers = [trigger for trigger, count in all_triggers.items() if count < 2]
        
        print(f"Found {len(unused_tags)} unused tags and {len(unused_triggers)} unused triggers")
        
        # Optimize each rule's metadata
        for rule in self.rules:
            optimized = False
            
            # Remove unused tags and triggers
            original_tags = rule.tags.copy()
            original_triggers = rule.triggers.copy()
            
            rule.tags = [tag for tag in rule.tags if tag not in unused_tags]
            rule.triggers = [trigger for trigger in rule.triggers if trigger not in unused_triggers]
            
            # Ensure we have at least one tag and trigger
            if not rule.tags:
                rule.tags = ['general']
            if not rule.triggers:
                rule.triggers = [rule.scope]
            
            # Remove duplicates while preserving order
            seen_tags = set()
            rule.tags = [tag for tag in rule.tags if not (tag in seen_tags or seen_tags.add(tag))]
            
            seen_triggers = set()
            rule.triggers = [trigger for trigger in rule.triggers if not (trigger in seen_triggers or seen_triggers.add(trigger))]
            
            if rule.tags != original_tags or rule.triggers != original_triggers:
                optimized = True
            
            if optimized:
                self._write_optimized_rule(rule)
                self.optimization_report['metadata_optimized'] += 1
    
    def optimize_content(self) -> None:
        """Optimize rule content for clarity and conciseness"""
        print("Optimizing content...")
        
        for rule in self.rules:
            original_content = rule.content
            optimized_content = self._optimize_rule_content(original_content)
            
            if optimized_content != original_content:
                rule.content = optimized_content
                self._write_optimized_rule(rule)
                self.optimization_report['content_optimized'] += 1
    
    def _optimize_rule_content(self, content: str) -> str:
        """Optimize individual rule content"""
        lines = content.split('\n')
        optimized_lines = []
        
        for line in lines:
            # Remove excessive whitespace
            line = re.sub(r'\s+', ' ', line.strip())
            
            # Remove redundant phrases
            line = re.sub(r'\b(you are|you should|you must|you can)\b', '', line, flags=re.IGNORECASE)
            line = re.sub(r'\b(always|never|only|just)\s+', '', line, flags=re.IGNORECASE)
            
            # Simplify common patterns
            line = re.sub(r'\buse\s+the\s+', 'use ', line, flags=re.IGNORECASE)
            line = re.sub(r'\bmake\s+sure\s+to\s+', 'ensure ', line, flags=re.IGNORECASE)
            line = re.sub(r'\bit\s+is\s+important\s+to\s+', 'ensure ', line, flags=re.IGNORECASE)
            
            # Remove empty lines at the beginning and end
            if line or (optimized_lines and optimized_lines[-1]):
                optimized_lines.append(line)
        
        # Remove trailing empty lines
        while optimized_lines and not optimized_lines[-1]:
            optimized_lines.pop()
        
        return '\n'.join(optimized_lines)
    
    def remove_duplicates(self, keep_strategy: str = "most_comprehensive") -> None:
        """Remove duplicate rules based on strategy"""
        print(f"Removing duplicates using '{keep_strategy}' strategy...")
        
        for hash_val, files in self.duplicates.items():
            if len(files) <= 1:
                continue
            
            # Choose which file to keep
            if keep_strategy == "most_comprehensive":
                # Keep the file with the most comprehensive content
                keep_file = max(files, key=lambda f: len(Path(f).read_text()))
            elif keep_strategy == "first":
                # Keep the first file alphabetically
                keep_file = min(files)
            elif keep_strategy == "master_rules_first":
                # Prefer master-rules, then common-rules, then project-rules
                priority_order = ['master-rules', 'common-rules', 'project-rules']
                keep_file = min(files, key=lambda f: next(
                    (i for i, scope in enumerate(priority_order) if scope in f), len(priority_order)
                ))
            else:
                keep_file = files[0]
            
            # Remove duplicate files
            files_to_remove = [f for f in files if f != keep_file]
            for file_path in files_to_remove:
                try:
                    os.remove(file_path)
                    print(f"Removed duplicate: {file_path}")
                    self.optimization_report['files_removed'] += 1
                except Exception as e:
                    self.optimization_report['errors'].append(f"Error removing {file_path}: {e}")
    
    def _write_optimized_rule(self, rule: RuleMetadata) -> None:
        """Write optimized rule back to file"""
        try:
            # Build optimized description
            optimized_desc = f"TAGS: [{','.join(rule.tags)}] | TRIGGERS: {','.join(rule.triggers)} | SCOPE: {rule.scope} | DESCRIPTION: {rule.description}"
            
            # Build YAML frontmatter
            yaml_content = f"---\ndescription: \"{optimized_desc}\"\nalwaysApply: {str(rule.always_apply).lower()}\n---\n\n"
            
            # Write file
            with open(rule.file_path, 'w', encoding='utf-8') as f:
                f.write(yaml_content + rule.content)
                
        except Exception as e:
            self.optimization_report['errors'].append(f"Error writing {rule.file_path}: {e}")
    
    def generate_report(self) -> None:
        """Generate optimization report"""
        print("\n" + "="*60)
        print("RULE OPTIMIZATION REPORT")
        print("="*60)
        print(f"Files processed: {self.optimization_report['files_processed']}")
        print(f"Duplicates found: {self.optimization_report['duplicates_found']}")
        print(f"Metadata optimized: {self.optimization_report['metadata_optimized']}")
        print(f"Content optimized: {self.optimization_report['content_optimized']}")
        print(f"Files removed: {self.optimization_report['files_removed']}")
        
        if self.optimization_report['errors']:
            print(f"\nErrors encountered: {len(self.optimization_report['errors'])}")
            for error in self.optimization_report['errors']:
                print(f"  - {error}")
        
        # Save detailed report
        report_path = "rule_optimization_report.json"
        with open(report_path, 'w') as f:
            json.dump(self.optimization_report, f, indent=2)
        print(f"\nDetailed report saved to: {report_path}")
    
    def run_optimization(self, remove_duplicates: bool = True, keep_strategy: str = "most_comprehensive") -> None:
        """Run complete optimization process"""
        print("Starting rule optimization...")
        print("="*60)
        
        self.load_rules()
        self.optimization_report['files_processed'] = len(self.rules)
        
        self.find_duplicates()
        self.optimize_metadata()
        self.optimize_content()
        
        if remove_duplicates and self.duplicates:
            self.remove_duplicates(keep_strategy)
        
        self.generate_report()
        print("\nRule optimization complete!")

def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Optimize AI Governor Framework rules")
    parser.add_argument("--rules-dir", default=".cursor/rules", help="Rules directory path")
    parser.add_argument("--no-remove-duplicates", action="store_true", help="Don't remove duplicate files")
    parser.add_argument("--keep-strategy", choices=["most_comprehensive", "first", "master_rules_first"], 
                       default="most_comprehensive", help="Strategy for choosing which duplicate to keep")
    
    args = parser.parse_args()
    
    optimizer = RuleOptimizer(args.rules_dir)
    optimizer.run_optimization(
        remove_duplicates=not args.no_remove_duplicates,
        keep_strategy=args.keep_strategy
    )

if __name__ == "__main__":
    main()
