# Bootstrap Process Documentation

## Overview

This document details the complete bootstrap process for the Client Project Generator, including the AI Governor Framework configuration and context engineering protocols.

## 🎯 Bootstrap Protocol 0: Project Bootstrap & Context Engineering

### Phase 1: Tooling Configuration & Rule Activation

#### Step 1.1: Detect Tooling & Configure Rules

**Objective**: Set up the AI Governor Framework for optimal AI collaboration.

**Prerequisites**:
- Cursor editor installed and configured
- Git repository initialized
- Python 3.8+ installed

**Process**:

1. **Detect Tooling**:
   ```bash
   # Ask user: "Are you using Cursor as your editor? This is important for activating the rules correctly."
   ```

2. **Locate Rules Directories**:
   ```bash
   find . -name "master-rules" -type d
   find . -name "common-rules" -type d
   ```

3. **Create Cursor Structure** (if needed):
   ```bash
   mkdir -p .cursor/rules
   # Move found rule directories to .cursor/rules/
   ```

4. **Rename Files to .mdc**:
   ```bash
   # Rename all .md files to .mdc in master-rules and common-rules
   find .cursor/rules/master-rules -name "*.md" -exec mv {} {}.mdc \;
   find .cursor/rules/common-rules -name "*.md" -exec mv {} {}.mdc \;
   ```

5. **Verify/Add Metadata**:
   - Check each `.mdc` file for YAML frontmatter
   - Add `alwaysApply` property if missing
   - Ensure proper metadata format

**Expected Output**:
```
.cursor/rules/
├── master-rules/
│   ├── 0-master-rule-context-discovery.mdc
│   ├── 1-master-rule-ai-collaboration-guidelines.mdc
│   ├── 2-master-rule-code-quality-checklist.mdc
│   ├── 3-master-rule-code-modification-safety-protocol.mdc
│   └── 4-master-rule-documentation-and-context-guidelines.mdc
└── common-rules/
    ├── common-rule-ui-foundation-design-system.mdc
    ├── common-rule-ui-interaction-a11y-perf.mdc
    └── common-rule-ui-premium-brand-dataviz-enterprise-gated.mdc
```

#### Step 1.2: Announce Configuration

**Process**:
- Confirm that the configuration is complete
- Announce which files were modified
- Verify that all rules are properly configured

### Phase 2: Initial Codebase Mapping

#### Step 2.1: Announce the Goal

**Communication**:
> "Now that the framework is configured, I will perform an initial analysis of your codebase to build a map of its structure and identify the key technologies."

#### Step 2.2: Map the Codebase Structure

**Process**:

1. **Perform Recursive File Listing**:
   ```bash
   find . -type f -name "*.json" -o -name "*.js" -o -name "*.ts" -o -name "*.tsx" -o -name "*.py" -o -name "*.go" -o -name "*.java" -o -name "*.md" -o -name "*.yml" -o -name "*.yaml" -o -name "*.toml" -o -name "*.cfg" -o -name "*.conf" | grep -v node_modules | grep -v .git | grep -v snapshots | head -50
   ```

2. **List Directory Contents**:
   ```bash
   ls -la
   ```

3. **Examine Key Directories**:
   - `src/` - Source code
   - `project_generator/` - Core generation logic
   - `scripts/` - CLI and utility scripts
   - `docs/` - Documentation

#### Step 2.3: Propose Analysis Plan

**Key Files to Analyze**:
- `README.md` - Main project documentation
- `package.json` - Node.js dependencies and scripts
- `requirements.txt` - Python dependencies
- `Makefile` - Build and development commands
- `scripts/generate_client_project.py` - Main CLI entry point
- `project_generator/core/generator.py` - Core generation logic
- `project_generator/core/industry_config.py` - Industry-specific configurations

**Communication**:
> "I have mapped your repository. To build an accurate understanding, I propose analyzing these key files: `package.json`, `src/main.tsx`, `vite.config.ts`, `README.md`. Does this list cover the main pillars of your project?"

#### Step 2.4: Analyze Key Files and Confirm Stack

**Process**:
1. Read and analyze the content of each key file
2. Identify the technology stack
3. Understand the project structure
4. Confirm understanding with user

**Technology Stack Analysis**:
- **Language**: Python 3.8+
- **Frontend**: Next.js, Nuxt, Angular, Expo support
- **Backend**: FastAPI, Django, NestJS, Go support
- **Database**: PostgreSQL, MongoDB, Firebase support
- **Authentication**: Auth0, Firebase, Cognito support
- **Deployment**: AWS, Azure, GCP, Vercel support
- **Compliance**: HIPAA, GDPR, SOX, PCI support

## 🔧 AI Governor Framework Configuration

### Rule Loading Process

#### Context Discovery Protocol

**Objective**: Load all relevant rules based on the current task and context.

**Process**:

1. **Execute Discovery Protocol**:
   - Follow the Context Discovery Rule
   - Search for relevant rules based on triggers and scope
   - Load rules that match the current context

2. **Announce Loaded Rules**:
   - Present loaded rules to user
   - Group rules by domain when there are many
   - Keep announcement concise and useful

3. **Apply Collaboration Protocol**:
   - Check for unstructured requests
   - Create TodoWrite for multi-step tasks
   - Ensure proper task structuring

#### Rule Categories

**Master Rules** (Always Applied):
- `0-master-rule-context-discovery` - Foundational context discovery
- `1-master-rule-ai-collaboration-guidelines` - AI-user collaboration
- `2-master-rule-code-quality-checklist` - Code quality standards
- `3-master-rule-code-modification-safety-protocol` - Code modification safety
- `4-master-rule-documentation-and-context-guidelines` - Documentation integrity

**Common Rules** (Context-Dependent):
- `common-rule-ui-foundation-design-system` - UI foundations
- `common-rule-ui-interaction-a11y-perf` - UI interactions and accessibility
- `common-rule-ui-premium-brand-dataviz-enterprise-gated` - Premium UI features

### TodoWrite Management

#### Task Structure

**Objective**: Structure and track complex tasks using the TodoWrite system.

**Process**:

1. **Create Todo List**:
   - Break down complex tasks into manageable items
   - Assign unique IDs to each task
   - Set appropriate status (pending, in_progress, completed, cancelled)

2. **Track Progress**:
   - Update task status as work progresses
   - Mark tasks as completed when finished
   - Add new tasks as needed

3. **Merge Updates**:
   - Add new tasks to existing list
   - Update existing tasks with new information
   - Maintain task history

**Example Todo Structure**:
```json
[
  {
    "id": "analyze-workflow",
    "content": "Analyze the current workflow from conversation history",
    "status": "completed"
  },
  {
    "id": "create-workflow-docs",
    "content": "Create comprehensive workflow documentation",
    "status": "in_progress"
  },
  {
    "id": "document-bootstrap-process",
    "content": "Document the project bootstrap and context engineering process",
    "status": "pending"
  }
]
```

## 🚀 Bootstrap Commands

### Quick Bootstrap

```bash
# Apply bootstrap instructions
/apply-instructions-from-0-bootstrap-your-projectmd
```

### Manual Bootstrap

```bash
# Find rules directories
find . -name "master-rules" -type d
find . -name "common-rules" -type d

# Create Cursor structure
mkdir -p .cursor/rules

# Move rules (if needed)
mv master-rules .cursor/rules/
mv common-rules .cursor/rules/

# Rename files to .mdc
find .cursor/rules -name "*.md" -exec mv {} {}.mdc \;
```

### Verification

```bash
# Verify structure
ls -la .cursor/rules/
ls -la .cursor/rules/master-rules/
ls -la .cursor/rules/common-rules/

# Check metadata
head -10 .cursor/rules/master-rules/*.mdc
```

## 📊 Bootstrap Checklist

### Pre-Bootstrap
- [ ] Cursor editor installed
- [ ] Git repository initialized
- [ ] Python 3.8+ installed
- [ ] Project structure created

### Phase 1: Tooling Configuration
- [ ] Rules directories located
- [ ] Cursor structure created
- [ ] Files renamed to .mdc
- [ ] Metadata verified/added
- [ ] Configuration announced

### Phase 2: Codebase Mapping
- [ ] File structure mapped
- [ ] Key files identified
- [ ] Analysis plan proposed
- [ ] User confirmation received
- [ ] Technology stack confirmed

### Post-Bootstrap
- [ ] Rules loaded and active
- [ ] Context discovery working
- [ ] TodoWrite system ready
- [ ] Documentation updated
- [ ] Workflow validated

## 🔍 Troubleshooting

### Common Issues

1. **Rules Not Found**:
   - Check if rules directories exist
   - Verify search paths
   - Ensure proper directory structure

2. **Metadata Missing**:
   - Check YAML frontmatter format
   - Add required properties
   - Verify file encoding

3. **Cursor Integration Issues**:
   - Verify .cursor/rules/ structure
   - Check file extensions (.mdc)
   - Ensure proper permissions

4. **Context Discovery Failures**:
   - Verify rule loading
   - Check trigger keywords
   - Ensure proper scope matching

### Debug Commands

```bash
# Check rules structure
find . -name "*.mdc" -type f

# Verify metadata
grep -l "alwaysApply" .cursor/rules/master-rules/*.mdc

# Check file permissions
ls -la .cursor/rules/

# Test rule loading
python3 -c "import yaml; print('YAML OK')"
```

## 📝 Success Criteria

### Bootstrap Complete When:
- [ ] All rules are properly loaded and active
- [ ] Context discovery protocol is working
- [ ] TodoWrite system is functional
- [ ] Codebase mapping is complete
- [ ] Technology stack is confirmed
- [ ] Documentation is updated
- [ ] Workflow is validated

### Ready for Development When:
- [ ] AI Governor Framework is configured
- [ ] Rules are active and enforced
- [ ] Context is properly maintained
- [ ] Task management is working
- [ ] Documentation integrity is maintained

---

*This document is part of the Client Project Generator bootstrap process and should be updated as the process evolves.*
