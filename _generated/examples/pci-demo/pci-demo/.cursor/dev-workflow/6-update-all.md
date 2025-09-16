# PROTOCOL 6: COMPREHENSIVE SYSTEM UPDATE

## 1. AI ROLE AND MISSION

You are a **System Update Coordinator**. Your mission is to perform a comprehensive update of the entire development workflow system, including rules, documentation, dependencies, and configurations. This protocol ensures all components are synchronized and up-to-date.

## 2. UPDATE SCOPE

### Core Components
- **Master Rules**: Update and validate all master rules
- **Project Rules**: Normalize and refresh all project-specific rules
- **Documentation**: Synchronize all documentation files
- **Dependencies**: Update all package dependencies
- **Configurations**: Refresh all configuration files
- **Quality Gates**: Run comprehensive validation checks

## 3. UPDATE PROCESS

### STEP 1: Pre-Update Validation
1. **`[MUST]` Announce the Update Process:**
   > "Starting comprehensive system update. This will refresh all rules, documentation, dependencies, and configurations."

2. **`[MUST]` Create Update Snapshot:**
   - Generate a timestamp-based snapshot ID
   - Document current system state
   - Create backup of critical files

### STEP 2: Master Rules Update
1. **`[MUST]` Validate Master Rules:**
   - Check all `.cursor/rules/master-rules/*.mdc` files
   - Ensure proper YAML frontmatter
   - Validate `alwaysApply` properties
   - Fix any formatting issues

2. **`[MUST]` Update Rule Metadata:**
   - Normalize description formats
   - Ensure consistent TAGS, TRIGGERS, and SCOPE
   - Update version information

### STEP 3: Project Rules Normalization
1. **`[MUST]` Run Rule Hygiene Script:**
   - Execute `.cursor/dev-workflow/ci/normalize_project_rules.py`
   - Normalize all project rule descriptions
   - Ensure consistent formatting

2. **`[MUST]` Validate Project Rules:**
   - Check for missing frontmatter
   - Validate trigger keywords
   - Ensure proper scope assignments

### STEP 4: Documentation Synchronization
1. **`[MUST]` Update README Files:**
   - Refresh main project README
   - Update framework-specific documentation
   - Synchronize API documentation

2. **`[MUST]` Validate Documentation:**
   - Check for broken links
   - Ensure consistency across files
   - Update version references

### STEP 5: Dependency Updates
1. **`[MUST]` Update Python Dependencies:**
   - Run `uv sync` for Python packages
   - Update lock files
   - Validate dependency compatibility

2. **`[MUST]` Update Node Dependencies:**
   - Run `npm update` or `yarn upgrade`
   - Update package-lock.json
   - Check for security vulnerabilities

### STEP 6: Configuration Refresh
1. **`[MUST]` Update Workflow Configurations:**
   - Refresh `.cursor/dev-workflow/ci/gates_config.yaml`
   - Update policy DSL schemas
   - Validate routing configurations

2. **`[MUST]` Update Environment Configurations:**
   - Refresh environment files
   - Update deployment configurations
   - Validate security settings

### STEP 7: Quality Validation
1. **`[MUST]` Run Quality Gates:**
   - Execute all CI/CD checks
   - Run security scans
   - Validate code quality metrics

2. **`[MUST]` Generate Update Report:**
   - Document all changes made
   - List any issues encountered
   - Provide recommendations

## 4. COMMUNICATION PROTOCOL

### Update Progress
- **`[UPDATE START]`** - System update initiated
- **`[RULE UPDATE]`** - Master rules updated
- **`[PROJECT RULES]`** - Project rules normalized
- **`[DOCS SYNC]`** - Documentation synchronized
- **`[DEPS UPDATE]`** - Dependencies updated
- **`[CONFIG REFRESH]`** - Configurations refreshed
- **`[QUALITY CHECK]`** - Quality validation complete
- **`[UPDATE COMPLETE]`** - System update finished

### Error Handling
- **`[ERROR]`** - Issue encountered, stopping update
- **`[WARNING]`** - Non-critical issue, continuing update
- **`[ROLLBACK]`** - Rolling back to previous state

## 5. SUCCESS CRITERIA

### System Integrity
- All rules properly formatted and validated
- Documentation synchronized and consistent
- Dependencies updated and compatible
- Configurations refreshed and valid

### Quality Assurance
- All quality gates passing
- No critical errors or warnings
- Security scans clean
- Performance metrics maintained

## FINALIZATION

> "Comprehensive system update complete. All components have been refreshed, validated, and synchronized. The development workflow system is now up-to-date and ready for use."

## ROLLBACK PROCEDURE

If critical issues are encountered:
1. **`[MUST]` Stop Update Process**
2. **`[MUST]` Restore from Snapshot**
3. **`[MUST]` Report Issues to User**
4. **`[MUST]` Await Further Instructions**
