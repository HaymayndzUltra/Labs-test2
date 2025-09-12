#!/usr/bin/env python3
"""
Intelligent Rule Precedence Resolution System
Enhanced conflict resolution with industry-aware precedence and intelligent merging
"""

import os
import json
import yaml
import re
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass
from enum import Enum
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RuleType(Enum):
    SECURITY = "security"
    COMPLIANCE = "compliance"
    INDUSTRY = "industry"
    QUALITY = "quality"
    WORKFLOW = "workflow"
    PROJECT = "project"

class ConflictType(Enum):
    MUTUALLY_EXCLUSIVE = "mutually_exclusive"
    MERGEABLE = "mergeable"
    COMPOSABLE = "composable"
    REQUIRES_CLARIFICATION = "requires_clarification"

@dataclass
class RuleAction:
    """Represents an action defined by a rule"""
    rule_name: str
    action_type: str
    parameters: Dict[str, Any]
    priority: int
    rule_type: RuleType
    industry_context: Optional[str] = None
    compliance_requirements: List[str] = None
    mergeable: bool = True

@dataclass
class ConflictResolution:
    """Represents the resolution of a rule conflict"""
    conflict_type: ConflictType
    resolution: str
    winning_rule: str
    merged_actions: List[RuleAction]
    requires_human_input: bool
    reasoning: str

class IntelligentRulePrecedenceResolver:
    """Enhanced rule precedence resolver with intelligent conflict resolution"""
    
    def __init__(self, rules_dir: str, config_dir: str):
        self.rules_dir = Path(rules_dir)
        self.config_dir = Path(config_dir)
        self.precedence_config = self._load_precedence_config()
        self.industry_patterns = self._load_industry_patterns()
        self.conflict_resolution_rules = self._load_conflict_resolution_rules()
        
    def _load_precedence_config(self) -> Dict:
        """Load the precedence configuration"""
        config_file = self.config_dir / "industry-rule-activation.yaml"
        if config_file.exists():
            with open(config_file, 'r') as f:
                return yaml.safe_load(f)
        return {}
    
    def _load_industry_patterns(self) -> Dict:
        """Load industry-specific patterns for precedence adjustment"""
        patterns_file = self.config_dir / "industry-patterns.json"
        if patterns_file.exists():
            with open(patterns_file, 'r') as f:
                return json.load(f)
        return {}
    
    def _load_conflict_resolution_rules(self) -> Dict:
        """Load conflict resolution rules"""
        return {
            "security_overrides_all": True,
            "compliance_overrides_quality": True,
            "industry_context_priority": True,
            "merge_actions_when_possible": True,
            "escalate_complex_conflicts": True
        }
    
    def resolve_rule_conflicts(self, active_rules: List[RuleAction], 
                             context: Dict[str, Any]) -> ConflictResolution:
        """Resolve conflicts between active rules using intelligent precedence"""
        
        # Step 1: Categorize rules by type and priority
        categorized_rules = self._categorize_rules(active_rules, context)
        
        # Step 2: Identify conflicts
        conflicts = self._identify_conflicts(categorized_rules)
        
        # Step 3: Apply intelligent resolution
        resolution = self._apply_intelligent_resolution(conflicts, context)
        
        # Step 4: Generate audit trail
        self._generate_audit_trail(resolution, context)
        
        return resolution
    
    def _categorize_rules(self, rules: List[RuleAction], context: Dict[str, Any]) -> Dict[RuleType, List[RuleAction]]:
        """Categorize rules by type and apply industry-specific adjustments"""
        categorized = {rule_type: [] for rule_type in RuleType}
        
        for rule in rules:
            # Determine rule type
            rule_type = self._determine_rule_type(rule, context)
            rule.rule_type = rule_type
            
            # Apply industry-specific priority adjustments
            adjusted_priority = self._adjust_priority_for_industry(rule, context)
            rule.priority = adjusted_priority
            
            categorized[rule_type].append(rule)
        
        # Sort each category by priority
        for rule_type in categorized:
            categorized[rule_type].sort(key=lambda x: x.priority, reverse=True)
        
        return categorized
    
    def _determine_rule_type(self, rule: RuleAction, context: Dict[str, Any]) -> RuleType:
        """Determine the type of rule based on its characteristics"""
        rule_name = rule.rule_name.lower()
        
        # Security rules
        if any(keyword in rule_name for keyword in ['security', 'hipaa', 'pci', 'sox', 'compliance']):
            return RuleType.SECURITY
        
        # Industry-specific rules
        if any(keyword in rule_name for keyword in ['healthcare', 'finance', 'ecommerce', 'enterprise']):
            return RuleType.INDUSTRY
        
        # Compliance rules
        if any(keyword in rule_name for keyword in ['compliance', 'audit', 'validation']):
            return RuleType.COMPLIANCE
        
        # Quality rules
        if any(keyword in rule_name for keyword in ['quality', 'testing', 'code-quality']):
            return RuleType.QUALITY
        
        # Workflow rules
        if any(keyword in rule_name for keyword in ['workflow', 'process', 'collaboration']):
            return RuleType.WORKFLOW
        
        # Default to project rules
        return RuleType.PROJECT
    
    def _adjust_priority_for_industry(self, rule: RuleAction, context: Dict[str, Any]) -> int:
        """Adjust rule priority based on industry context"""
        base_priority = rule.priority
        industry = context.get('industry', 'unknown')
        
        # Load industry-specific adjustments
        industry_adjustments = self.precedence_config.get('industry_patterns', {}).get(industry, {})
        priority_adjustments = industry_adjustments.get('priority_adjustments', {})
        
        # Apply adjustments based on rule type
        rule_type = rule.rule_type.value
        if rule_type in priority_adjustments:
            adjustment = priority_adjustments[rule_type]
            return base_priority + adjustment
        
        return base_priority
    
    def _identify_conflicts(self, categorized_rules: Dict[RuleType, List[RuleAction]]) -> List[Tuple[RuleAction, RuleAction, ConflictType]]:
        """Identify conflicts between rules"""
        conflicts = []
        
        # Check for conflicts within each category
        for rule_type, rules in categorized_rules.items():
            for i, rule1 in enumerate(rules):
                for rule2 in rules[i+1:]:
                    conflict_type = self._analyze_conflict(rule1, rule2)
                    if conflict_type != ConflictType.MERGEABLE:
                        conflicts.append((rule1, rule2, conflict_type))
        
        # Check for cross-category conflicts
        rule_types = list(categorized_rules.keys())
        for i, type1 in enumerate(rule_types):
            for type2 in rule_types[i+1:]:
                for rule1 in categorized_rules[type1]:
                    for rule2 in categorized_rules[type2]:
                        conflict_type = self._analyze_conflict(rule1, rule2)
                        if conflict_type != ConflictType.MERGEABLE:
                            conflicts.append((rule1, rule2, conflict_type))
        
        return conflicts
    
    def _analyze_conflict(self, rule1: RuleAction, rule2: RuleAction) -> ConflictType:
        """Analyze the type of conflict between two rules"""
        # Check if actions are mutually exclusive
        if self._are_mutually_exclusive(rule1, rule2):
            return ConflictType.MUTUALLY_EXCLUSIVE
        
        # Check if actions can be merged
        if self._can_merge_actions(rule1, rule2):
            return ConflictType.MERGEABLE
        
        # Check if actions can be composed
        if self._can_compose_actions(rule1, rule2):
            return ConflictType.COMPOSABLE
        
        # Default to requiring clarification
        return ConflictType.REQUIRES_CLARIFICATION
    
    def _are_mutually_exclusive(self, rule1: RuleAction, rule2: RuleAction) -> bool:
        """Check if two rule actions are mutually exclusive"""
        # Define mutually exclusive action patterns
        exclusive_patterns = [
            (['enable', 'disable'], ['disable', 'enable']),
            (['allow', 'deny'], ['deny', 'allow']),
            (['require', 'optional'], ['optional', 'require']),
            (['strict', 'lenient'], ['lenient', 'strict'])
        ]
        
        action1_words = rule1.action_type.lower().split()
        action2_words = rule2.action_type.lower().split()
        
        for pattern1, pattern2 in exclusive_patterns:
            if (any(word in action1_words for word in pattern1) and 
                any(word in action2_words for word in pattern2)):
                return True
        
        return False
    
    def _can_merge_actions(self, rule1: RuleAction, rule2: RuleAction) -> bool:
        """Check if two rule actions can be merged"""
        # Actions can be merged if they have the same type and are mergeable
        return (rule1.action_type == rule2.action_type and 
                rule1.mergeable and rule2.mergeable)
    
    def _can_compose_actions(self, rule1: RuleAction, rule2: RuleAction) -> bool:
        """Check if two rule actions can be composed (executed in sequence)"""
        # Actions can be composed if they don't conflict and can be executed together
        return not self._are_mutually_exclusive(rule1, rule2)
    
    def _apply_intelligent_resolution(self, conflicts: List[Tuple[RuleAction, RuleAction, ConflictType]], 
                                    context: Dict[str, Any]) -> ConflictResolution:
        """Apply intelligent resolution to conflicts"""
        if not conflicts:
            return ConflictResolution(
                conflict_type=ConflictType.MERGEABLE,
                resolution="no_conflicts",
                winning_rule="none",
                merged_actions=[],
                requires_human_input=False,
                reasoning="No conflicts detected"
            )
        
        # Group conflicts by type
        mutually_exclusive = [c for c in conflicts if c[2] == ConflictType.MUTUALLY_EXCLUSIVE]
        mergeable = [c for c in conflicts if c[2] == ConflictType.MERGEABLE]
        composable = [c for c in conflicts if c[2] == ConflictType.COMPOSABLE]
        requires_clarification = [c for c in conflicts if c[2] == ConflictType.REQUIRES_CLARIFICATION]
        
        # Resolve mutually exclusive conflicts using precedence
        resolved_actions = []
        winning_rules = []
        
        for rule1, rule2, _ in mutually_exclusive:
            winner = self._resolve_by_precedence(rule1, rule2, context)
            resolved_actions.append(winner)
            winning_rules.append(winner.rule_name)
        
        # Merge mergeable actions
        merged_actions = self._merge_actions(mergeable)
        resolved_actions.extend(merged_actions)
        
        # Compose composable actions
        composed_actions = self._compose_actions(composable)
        resolved_actions.extend(composed_actions)
        
        # Determine if human input is required
        requires_human = len(requires_clarification) > 0
        
        # Generate reasoning
        reasoning = self._generate_reasoning(conflicts, resolved_actions, context)
        
        return ConflictResolution(
            conflict_type=ConflictType.REQUIRES_CLARIFICATION if requires_human else ConflictType.MERGEABLE,
            resolution="intelligent_resolution",
            winning_rule=winning_rules[0] if winning_rules else "none",
            merged_actions=resolved_actions,
            requires_human_input=requires_human,
            reasoning=reasoning
        )
    
    def _resolve_by_precedence(self, rule1: RuleAction, rule2: RuleAction, context: Dict[str, Any]) -> RuleAction:
        """Resolve conflict by precedence rules"""
        # Get precedence order
        precedence_order = self.precedence_config.get('rule_precedence', [])
        
        # Check if rules are in precedence order
        rule1_index = self._get_precedence_index(rule1.rule_name, precedence_order)
        rule2_index = self._get_precedence_index(rule2.rule_name, precedence_order)
        
        # Higher priority (lower index) wins
        if rule1_index < rule2_index:
            return rule1
        elif rule2_index < rule1_index:
            return rule2
        
        # If same precedence, use priority
        if rule1.priority > rule2.priority:
            return rule1
        elif rule2.priority > rule1.priority:
            return rule2
        
        # If same priority, use rule type precedence
        type_precedence = {
            RuleType.SECURITY: 1,
            RuleType.COMPLIANCE: 2,
            RuleType.INDUSTRY: 3,
            RuleType.QUALITY: 4,
            RuleType.WORKFLOW: 5,
            RuleType.PROJECT: 6
        }
        
        if type_precedence[rule1.rule_type] < type_precedence[rule2.rule_type]:
            return rule1
        else:
            return rule2
    
    def _get_precedence_index(self, rule_name: str, precedence_order: List[str]) -> int:
        """Get the precedence index of a rule"""
        for i, precedence_rule in enumerate(precedence_order):
            if rule_name in precedence_rule or precedence_rule in rule_name:
                return i
        return len(precedence_order)  # Lowest priority if not found
    
    def _merge_actions(self, mergeable_conflicts: List[Tuple[RuleAction, RuleAction, ConflictType]]) -> List[RuleAction]:
        """Merge mergeable actions"""
        merged = []
        for rule1, rule2, _ in mergeable_conflicts:
            # Create merged action
            merged_action = RuleAction(
                rule_name=f"{rule1.rule_name}+{rule2.rule_name}",
                action_type=rule1.action_type,
                parameters=self._merge_parameters(rule1.parameters, rule2.parameters),
                priority=max(rule1.priority, rule2.priority),
                rule_type=rule1.rule_type,
                industry_context=rule1.industry_context or rule2.industry_context,
                compliance_requirements=list(set(
                    (rule1.compliance_requirements or []) + 
                    (rule2.compliance_requirements or [])
                )),
                mergeable=True
            )
            merged.append(merged_action)
        return merged
    
    def _merge_parameters(self, params1: Dict[str, Any], params2: Dict[str, Any]) -> Dict[str, Any]:
        """Merge parameters from two actions"""
        merged = params1.copy()
        for key, value in params2.items():
            if key in merged:
                # If both have the same key, merge the values
                if isinstance(merged[key], list) and isinstance(value, list):
                    merged[key] = list(set(merged[key] + value))
                elif isinstance(merged[key], dict) and isinstance(value, dict):
                    merged[key] = {**merged[key], **value}
                else:
                    # Use the higher priority value (assuming higher priority is better)
                    merged[key] = value
            else:
                merged[key] = value
        return merged
    
    def _compose_actions(self, composable_conflicts: List[Tuple[RuleAction, RuleAction, ConflictType]]) -> List[RuleAction]:
        """Compose composable actions (execute in sequence)"""
        composed = []
        for rule1, rule2, _ in composable_conflicts:
            # Create composed action
            composed_action = RuleAction(
                rule_name=f"{rule1.rule_name}->{rule2.rule_name}",
                action_type="composed",
                parameters={
                    "sequence": [rule1.parameters, rule2.parameters],
                    "original_actions": [rule1.rule_name, rule2.rule_name]
                },
                priority=max(rule1.priority, rule2.priority),
                rule_type=rule1.rule_type,
                industry_context=rule1.industry_context or rule2.industry_context,
                compliance_requirements=list(set(
                    (rule1.compliance_requirements or []) + 
                    (rule2.compliance_requirements or [])
                )),
                mergeable=False
            )
            composed.append(composed_action)
        return composed
    
    def _generate_reasoning(self, conflicts: List[Tuple[RuleAction, RuleAction, ConflictType]], 
                          resolved_actions: List[RuleAction], context: Dict[str, Any]) -> str:
        """Generate human-readable reasoning for the resolution"""
        reasoning_parts = []
        
        if not conflicts:
            reasoning_parts.append("No conflicts detected between active rules.")
        else:
            reasoning_parts.append(f"Resolved {len(conflicts)} conflicts using intelligent precedence resolution.")
            
            # Add specific reasoning for each conflict type
            conflict_types = set(c[2] for c in conflicts)
            for conflict_type in conflict_types:
                count = sum(1 for c in conflicts if c[2] == conflict_type)
                reasoning_parts.append(f"- {count} {conflict_type.value} conflicts resolved")
        
        # Add industry context if available
        industry = context.get('industry')
        if industry:
            reasoning_parts.append(f"Industry context ({industry}) applied to precedence adjustments.")
        
        return " ".join(reasoning_parts)
    
    def _generate_audit_trail(self, resolution: ConflictResolution, context: Dict[str, Any]):
        """Generate audit trail for the resolution"""
        audit_entry = {
            "timestamp": str(Path().cwd()),
            "context": context,
            "resolution": {
                "conflict_type": resolution.conflict_type.value,
                "winning_rule": resolution.winning_rule,
                "merged_actions_count": len(resolution.merged_actions),
                "requires_human_input": resolution.requires_human_input,
                "reasoning": resolution.reasoning
            }
        }
        
        # Save audit trail
        audit_dir = self.rules_dir.parent / "dev-workflow" / "audit_logs"
        audit_dir.mkdir(parents=True, exist_ok=True)
        
        audit_file = audit_dir / f"rule_precedence_{context.get('session_id', 'unknown')}.json"
        with open(audit_file, 'w') as f:
            json.dump(audit_entry, f, indent=2)

def main():
    """Main function for command-line usage"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Intelligent Rule Precedence Resolution")
    parser.add_argument("--rules-dir", default=".cursor/rules", help="Rules directory")
    parser.add_argument("--config-dir", default=".cursor/dev-workflow/config", help="Config directory")
    parser.add_argument("--context", help="Context JSON file")
    parser.add_argument("--output", help="Output file for resolution")
    
    args = parser.parse_args()
    
    # Initialize resolver
    resolver = IntelligentRulePrecedenceResolver(args.rules_dir, args.config_dir)
    
    # Load context
    if args.context:
        with open(args.context, 'r') as f:
            context = json.load(f)
    else:
        context = {"session_id": "test", "industry": "unknown"}
    
    # Example active rules (would normally come from rule discovery)
    active_rules = [
        RuleAction("security-compliance-overlay", "enforce_security", {}, 100, RuleType.SECURITY),
        RuleAction("healthcare-compliance", "enforce_hipaa", {}, 80, RuleType.INDUSTRY, "healthcare"),
        RuleAction("code-quality-checklist", "enforce_quality", {}, 60, RuleType.QUALITY)
    ]
    
    # Resolve conflicts
    resolution = resolver.resolve_rule_conflicts(active_rules, context)
    
    # Output results
    if args.output:
        with open(args.output, 'w') as f:
            json.dump({
                "conflict_type": resolution.conflict_type.value,
                "winning_rule": resolution.winning_rule,
                "merged_actions": [{"rule_name": a.rule_name, "action_type": a.action_type} for a in resolution.merged_actions],
                "requires_human_input": resolution.requires_human_input,
                "reasoning": resolution.reasoning
            }, f, indent=2)
        print(f"Resolution saved to {args.output}")
    else:
        print(json.dumps({
            "conflict_type": resolution.conflict_type.value,
            "winning_rule": resolution.winning_rule,
            "merged_actions_count": len(resolution.merged_actions),
            "requires_human_input": resolution.requires_human_input,
            "reasoning": resolution.reasoning
        }, indent=2))

if __name__ == "__main__":
    main()
