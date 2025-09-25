# Generate Cursor Rules

## Command: /Generate Cursor Rules

This command triggers the creation of comprehensive Cursor rules for the current project. When executed, the AI should:

### 1. **Discovery Phase**
- Scan the `.cursor/rules/` directory structure
- Identify existing master-rules, common-rules, and project-rules
- Analyze the project's technology stack and architecture
- Read key documentation files (README.md, package.json, requirements.txt, etc.)

### 2. **Analysis Phase**
- Determine what type of project this is (frontend, backend, fullstack, etc.)
- Identify the main technologies and frameworks used
- Check for missing project-specific rules
- Understand the existing rule hierarchy and patterns

### 3. **Generation Phase**
Create project-specific rules following this structure:

#### For Frontend Projects:
- **File**: `{project-path}/.cursor/rules/project-rules/{framework}-app-structure.mdc`
- **Content**: Framework-specific patterns, component structure, state management, styling guidelines, testing strategies

#### For Backend Projects:
- **File**: `{project-path}/.cursor/rules/project-rules/{framework}-backend-architecture.mdc`
- **Content**: API patterns, database models, authentication flows, service layer patterns, testing approaches

#### For Fullstack Projects:
- Create separate rules for frontend and backend components
- Include integration patterns and shared conventions

### 4. **Rule Format Requirements**
Each generated rule must include:

```yaml
---
description: "TAGS: [tag1,tag2] | TRIGGERS: keyword1,keyword2 | SCOPE: scope | DESCRIPTION: One-sentence summary"
alwaysApply: false
---
```

### 5. **Content Guidelines**
- **Structure**: Clear sections with headers
- **Examples**: Code examples for common patterns
- **Conventions**: Project-specific coding standards
- **Best Practices**: Framework-specific recommendations
- **Testing**: Testing strategies and patterns
- **Deployment**: Environment and deployment considerations

### 6. **Quality Checklist**
Before finalizing, ensure each rule:
- [ ] Has proper YAML frontmatter with TAGS, TRIGGERS, SCOPE, DESCRIPTION
- [ ] Includes practical code examples
- [ ] Covers the most common development scenarios
- [ ] Follows the existing rule naming conventions
- [ ] Is placed in the correct directory structure
- [ ] References relevant files using `[filename.ext](mdc:filename.ext)` format

### 7. **Output Format**
After generation, provide:
- Summary of rules created
- File locations
- Brief description of what each rule covers
- Instructions for how to use/activate the rules

---

**Usage**: Type `/Generate Cursor Rules` in any `.cursor/commands/` file to trigger this process.

**Triggers**: This command should be triggered by keywords like "generate", "cursor rules", "create rules", "rule generation"