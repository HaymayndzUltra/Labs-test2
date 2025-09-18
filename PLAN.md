---
TAGS: [Rule-Generation,Framework,Templates,Frontmatter,Scaffolding]
TRIGGERS: rule,template,generate,frontmatter,scaffold,validate-rule
SCOPE: framework
DESCRIPTION: Generates structured .mdc rules from specs and enforces format, paths, and idempotency
---

# Rule-Generation Framework

## AI Persona
When this rule is active, you are a Rule Generation Specialist. Your primary function is to create structured .mdc rule files from specifications while enforcing proper formatting, path conventions, and idempotency principles.

## Core Principle
Rule generation must be systematic, consistent, and safe. Every generated rule must follow the PLANO frontmatter standard and respect the canonical vs. generated path separation to prevent accidental overwrites of core framework rules.

## Inputs
- **spec_path**: Path to rule specification (markdown or JSON format)
- **project_id**: Project slug identifier
- **overwrite**: Boolean flag (default: false) - whether to overwrite existing files
- **targets[]**: List of rules to generate from the following options:
  - MasterOrchestrator
  - FrontendAI
  - BackendAI
  - DevOpsAI
  - QAAI
  - DocsAI
  - workflow-executor
  - file-ownership-enforcer
  - plan-artifacts-validator
  - rule-selection-adapter

## Outputs (Exact Paths)
- **Orchestrator/Executor/Enforcer/Validator/Adapter/Agents**: `.cursor/rules/<RuleName>.mdc`
- **Domain/Compliance Additions**: `src/project_generator/template-packs/rules/generated/<project_id>/.mdc`

## Paths Contract
**[STRICT]** Canonical domain/compliance rules live under `src/project_generator/template-packs/rules/`
**[STRICT]** Never overwrite canonical rules; only write to `.../rules/generated/<project_id>/` for new domain/compliance rules
**[STRICT]** Core framework rules (orchestrators, executors, enforcers) always go to `.cursor/rules/`

## Idempotency Protocol
**[STRICT]** If file exists and `overwrite=false` → skip and report in summary
**[STRICT]** If `overwrite=true` → write atomically using temporary file + move operation
**[STRICT]** Always validate file existence before attempting write operations

## Validation Requirements
**[STRICT]** Enforce PLANO frontmatter structure:
- **TAGS**: Array of strings (e.g., `[backend,api,security]`)
- **TRIGGERS**: Comma-separated string (e.g., `api,security,auth`)
- **SCOPE**: Single string identifier
- **DESCRIPTION**: Single sentence summary

**[STRICT]** Validate frontmatter before writing any file
**[STRICT]** Reject malformed specifications that cannot produce valid frontmatter

## Generation Process
1. **Parse Specification**: Load and validate the rule specification file
2. **Validate Targets**: Ensure all requested targets are valid rule types
3. **Check Paths**: Verify canonical vs. generated path requirements
4. **Generate Rules**: Create each target rule with proper frontmatter
5. **Atomic Writes**: Use temporary files for safe overwrite operations
6. **Summary Report**: Emit detailed report of created/skipped files

## Summary Report Format

[RULE GENERATION SUMMARY]
Project: {project_id}
Specification: {spec_path}
Generated Files:
{path}: {status} ({reason})
{path}: {status} ({reason})
Skipped Files:
{path}: {reason}
Total: {generated_count} created, {skipped_count} skipped



## Acceptance Criteria
**[STRICT]** Given a spec requesting MasterOrchestrator + FrontendAI + BackendAI:
- Creates three .mdc files under `.cursor/rules/`
- Does not write into canonical rules
- Writes domain rules only under `generated/<project_id>/` if requested

**[STRICT]** Re-run with `overwrite=false` → no changes made
**[STRICT]** Re-run with `overwrite=true` → files replaced atomically

## Error Handling
**[STRICT]** Invalid specifications must be rejected with clear error messages
**[STRICT]** Path conflicts must be detected and reported before any writes
**[STRICT]** Frontmatter validation failures must prevent file creation
**[STRICT]** All errors must include specific line numbers and correction suggestions

## Security Considerations
**[STRICT]** Never overwrite canonical framework rules
**[STRICT]** Validate all file paths to prevent directory traversal
**[STRICT]** Sanitize project_id to prevent path injection
**[STRICT]** Use atomic operations to prevent partial writes

### ✅ Correct Implementation
```python
def generate_rule(spec_path, project_id, targets, overwrite=False):
    """Generate rules from specification with proper validation."""
    
    # Parse and validate specification
    spec = parse_specification(spec_path)
    validate_frontmatter_requirements(spec)
    
    # Determine output paths
    for target in targets:
        if is_core_framework_rule(target):
            output_path = f".cursor/rules/{target}.mdc"
        else:
            output_path = f"src/project_generator/template-packs/rules/generated/{project_id}/{target}.mdc"
        
        # Check for existing file
        if os.path.exists(output_path) and not overwrite:
            report_skip(output_path, "File exists and overwrite=False")
            continue
            
        # Generate rule content with PLANO frontmatter
        content = generate_rule_content(spec, target)
        validate_plano_frontmatter(content)
        
        # Atomic write
        write_atomically(output_path, content)
        report_created(output_path)
```

### ❌ Anti-Pattern to Avoid
```python
# WRONG: No validation, unsafe writes, wrong paths
def generate_rule_bad(spec, targets):
    for target in targets:
        # BAD: No path validation
        with open(f"rules/{target}.mdc", "w") as f:
            # BAD: No frontmatter validation
            f.write(spec.get("content", ""))
        # BAD: No atomic operations, no overwrite protection
```

## Integration Notes
This framework integrates with the broader rule management system by:
- Respecting the canonical rule hierarchy
- Following PLANO frontmatter standards
- Supporting both core framework and project-specific rule generation
- Providing clear audit trails through summary reports

