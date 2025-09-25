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

#### For .cursorrules Generation:
- **File**: `{target-directory}/.cursorrules`
- **Content**: Comprehensive project-specific rules for any directory
- **Scope**: Can be created for any directory (project root, subdirectories, or new projects)
- **Format**: Plain text markdown format (legacy but still functional)
- **Purpose**: Global project context and coding standards

### 4. **Rule Format Requirements**

#### For .cursor/rules files (.mdc):
Each generated rule must include:

```yaml
---
description: "TAGS: [tag1,tag2] | TRIGGERS: keyword1,keyword2 | SCOPE: scope | DESCRIPTION: One-sentence summary"
alwaysApply: false
---
```

#### For .cursorrules files:
- **Format**: Plain text markdown (no YAML frontmatter)
- **Structure**: Clear sections with headers
- **Content**: Project overview, technology stack, coding standards, best practices
- **Scope**: Global project context and guidelines

### 5. **Content Guidelines**

#### For .cursor/rules files (.mdc):
- **Structure**: Clear sections with headers
- **Examples**: Code examples for common patterns
- **Conventions**: Project-specific coding standards
- **Best Practices**: Framework-specific recommendations
- **Testing**: Testing strategies and patterns
- **Deployment**: Environment and deployment considerations

#### For .cursorrules files:
- **Project Overview**: Brief description of the project
- **Technology Stack**: Main technologies and frameworks
- **General Guidelines**: Core coding principles
- **Frontend Standards**: TypeScript/React specific rules
- **Backend Standards**: Python/FastAPI specific rules
- **Database Standards**: SQLAlchemy and PostgreSQL patterns
- **Security Standards**: Authentication and security practices
- **Testing Standards**: Testing approaches and tools
- **Code Organization**: File structure and naming conventions
- **Documentation Standards**: README and API documentation
- **Performance Standards**: Optimization guidelines
- **Error Handling**: Error management patterns
- **Development Workflow**: Git, Docker, deployment practices
- **Enterprise Features**: Audit logging, compliance, RBAC

### 6. **Quality Checklist**

#### For .cursor/rules files (.mdc):
Before finalizing, ensure each rule:
- [ ] Has proper YAML frontmatter with TAGS, TRIGGERS, SCOPE, DESCRIPTION
- [ ] Includes practical code examples
- [ ] Covers the most common development scenarios
- [ ] Follows the existing rule naming conventions
- [ ] Is placed in the correct directory structure
- [ ] References relevant files using `[filename.ext](mdc:filename.ext)` format

#### For .cursorrules files:
Before finalizing, ensure each rule:
- [ ] Has clear project overview and technology stack
- [ ] Includes comprehensive coding standards
- [ ] Covers frontend, backend, and database patterns
- [ ] Includes security and testing guidelines
- [ ] Has proper file structure expectations
- [ ] Includes enterprise features if applicable
- [ ] Uses consistent formatting and headers
- [ ] Is placed in the correct target directory

### 7. **Output Format**
After generation, provide:
- Summary of rules created
- File locations
- Brief description of what each rule covers
- Instructions for how to use/activate the rules

### 8. **Directory-Specific .cursorrules Generation**
The command can also generate `.cursorrules` files for any directory:

#### **Usage Examples:**
- **Project Root**: `Generate .cursorrules for this project`
- **Subdirectory**: `Generate .cursorrules for frontend/ directory`
- **New Project**: `Generate .cursorrules for new React project`
- **Specific Path**: `Generate .cursorrules for /path/to/directory`

#### **Directory Analysis:**
When generating for a specific directory, the AI should:
- Analyze the directory structure and files
- Identify the technology stack used
- Determine project type (frontend, backend, fullstack, etc.)
- Check for existing configuration files
- Generate appropriate rules based on findings

#### **Flexible Generation:**
- Can generate for any directory path
- Adapts content based on directory contents
- Supports both new and existing projects
- Can create rules for subdirectories or new projects

---

**Usage**: Type `/Generate Cursor Rules` in any `.cursor/commands/` file to trigger this process.

**Triggers**: This command should be triggered by keywords like "generate", "cursor rules", "create rules", "rule generation", "generate .cursorrules", "create .cursorrules for directory"