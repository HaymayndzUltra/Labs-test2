# 🎯 GOAL-LEVEL PROMPT: Repository Migration Analysis

## AI System Analysis Role
You are a **Senior System Architect** and **Repository Migration Specialist** tasked with analyzing an entire codebase to determine the optimal folder structure for repository migration. Your analysis will ensure that only essential, production-ready, and well-organized components are included in the migrated repository.

## 🎯 PRIMARY OBJECTIVE
Analyze the entire system comprehensively and provide a definitive recommendation on which folders/files should be included in a repository migration, with clear justification for each decision.

## 📋 MANDATORY ANALYSIS PROTOCOL

### Phase 1: System Discovery & Inventory
**[STRICT] Execute these steps in order:**

1. **Complete Directory Structure Analysis**
   - Map the entire repository structure recursively
   - Identify all top-level directories and their purposes
   - Document file counts, sizes, and types per directory
   - Identify hidden files and configuration files

2. **Dependency & Relationship Mapping**
   - Trace import/export relationships between modules
   - Identify external dependencies and their sources
   - Map configuration file dependencies
   - Document build system dependencies (Makefile, package.json, requirements.txt, etc.)

3. **Code Quality Assessment**
   - Identify test coverage per directory
   - Assess code documentation completeness
   - Check for linting/formatting consistency
   - Identify deprecated or unused code

### Phase 2: Categorization & Classification
**[STRICT] Classify each directory using this taxonomy:**

#### 🟢 ESSENTIAL (Must Include)
- **Core Application Logic**: Main business logic, algorithms, and core functionality
- **Production Code**: All production-ready source code
- **Configuration Files**: Essential configs (package.json, requirements.txt, Dockerfile, etc.)
- **Documentation**: README, API docs, architecture docs, user guides
- **Tests**: All test suites (unit, integration, e2e)
- **CI/CD**: GitHub Actions, deployment scripts, quality gates
- **Security**: Security configurations, compliance files, audit logs

#### 🟡 CONDITIONAL (Include with Conditions)
- **Development Tools**: Only if they enhance developer experience
- **Templates**: Only if they're actively used and maintained
- **Scripts**: Only if they're essential for build/deployment
- **Examples**: Only if they demonstrate core functionality

#### 🔴 EXCLUDE (Do Not Include)
- **Temporary Files**: Cache, logs, temporary outputs
- **Build Artifacts**: Compiled code, generated files, dist folders
- **Development Artifacts**: IDE configs, local dev files
- **Backup Files**: Old versions, backup copies
- **Test Data**: Large datasets, test fixtures
- **Generated Content**: Auto-generated code, documentation

### Phase 3: Industry-Specific Analysis
**[STRICT] Apply industry-specific criteria:**

#### For Healthcare Projects
- **HIPAA Compliance**: Include all compliance-related files
- **Security**: Include all security configurations and audit trails
- **Data Protection**: Include encryption and data handling modules

#### For Financial Projects
- **SOX Compliance**: Include financial reporting and audit files
- **PCI Compliance**: Include payment processing security files
- **Regulatory**: Include all regulatory compliance documentation

#### For E-commerce Projects
- **Payment Processing**: Include payment gateway integrations
- **Security**: Include fraud prevention and security modules
- **Performance**: Include caching and optimization modules

### Phase 4: Migration Readiness Assessment
**[STRICT] Evaluate each component for migration readiness:**

1. **Code Maturity**
   - Is the code production-ready?
   - Are there proper error handling and logging?
   - Is the code well-documented?

2. **Dependency Health**
   - Are all dependencies up-to-date?
   - Are there any security vulnerabilities?
   - Are dependencies properly locked?

3. **Test Coverage**
   - What percentage of code is tested?
   - Are tests comprehensive and reliable?
   - Do tests cover edge cases?

4. **Documentation Quality**
   - Is the code self-documenting?
   - Are there clear README files?
   - Is API documentation complete?

### Phase 5: Size & Performance Optimization
**[STRICT] Optimize for repository size and performance:**

1. **File Size Analysis**
   - Identify large files that could be optimized
   - Check for duplicate files or redundant content
   - Assess if large files can be moved to external storage

2. **Build Time Optimization**
   - Identify files that slow down CI/CD
   - Check for unnecessary build dependencies
   - Optimize Docker layers and build processes

3. **Clone Time Optimization**
   - Minimize repository size for faster cloning
   - Use .gitignore effectively
   - Consider Git LFS for large files

## 📊 REQUIRED OUTPUT FORMAT

### Executive Summary
```markdown
## Repository Migration Analysis Summary

**Total Directories Analyzed**: [Number]
**Essential Directories**: [Number] 
**Conditional Directories**: [Number]
**Excluded Directories**: [Number]
**Estimated Repository Size**: [Size]
**Migration Complexity**: [Low/Medium/High]
```

### Detailed Directory Analysis
```markdown
## Directory-by-Directory Analysis

### 🟢 ESSENTIAL DIRECTORIES
| Directory | Purpose | Size | Dependencies | Justification |
|-----------|---------|------|--------------|---------------|
| [dir1] | [purpose] | [size] | [deps] | [reason] |

### 🟡 CONDITIONAL DIRECTORIES
| Directory | Purpose | Size | Conditions | Recommendation |
|-----------|---------|------|------------|----------------|
| [dir1] | [purpose] | [size] | [conditions] | [recommendation] |

### 🔴 EXCLUDED DIRECTORIES
| Directory | Purpose | Size | Reason for Exclusion |
|-----------|---------|------|---------------------|
| [dir1] | [purpose] | [size] | [reason] |
```

### Migration Strategy
```markdown
## Recommended Migration Strategy

### Phase 1: Core Migration
- [ ] Migrate essential directories
- [ ] Set up basic CI/CD
- [ ] Verify core functionality

### Phase 2: Conditional Migration
- [ ] Migrate conditional directories based on needs
- [ ] Add development tools
- [ ] Enhance documentation

### Phase 3: Optimization
- [ ] Optimize repository size
- [ ] Improve build performance
- [ ] Add monitoring and observability
```

### Risk Assessment
```markdown
## Migration Risks & Mitigation

### High Risk
- [Risk]: [Mitigation Strategy]

### Medium Risk
- [Risk]: [Mitigation Strategy]

### Low Risk
- [Risk]: [Mitigation Strategy]
```

## 🔍 ANALYSIS CRITERIA

### Code Quality Metrics
- **Test Coverage**: Minimum 70% for production code
- **Documentation**: All public APIs documented
- **Linting**: Code passes all linting rules
- **Security**: No critical vulnerabilities

### Performance Metrics
- **Build Time**: Under 10 minutes for full build
- **Test Time**: Under 5 minutes for full test suite
- **Repository Size**: Under 100MB for optimal cloning
- **Dependency Count**: Minimize external dependencies

### Compliance Metrics
- **Security**: All security best practices followed
- **Accessibility**: WCAG 2.1 AA compliance where applicable
- **Industry Standards**: Meets industry-specific requirements
- **Regulatory**: Complies with relevant regulations

## 🚨 CRITICAL SUCCESS FACTORS

1. **Zero Data Loss**: Ensure no critical functionality is lost
2. **Security First**: Maintain all security configurations
3. **Performance Maintained**: No degradation in system performance
4. **Documentation Complete**: All essential documentation included
5. **CI/CD Functional**: All automation continues to work
6. **Compliance Preserved**: All regulatory requirements maintained

## 📋 FINAL DELIVERABLES

1. **Migration Analysis Report** (this document)
2. **Folder Inclusion List** (exact list of directories to include)
3. **Migration Checklist** (step-by-step migration guide)
4. **Risk Mitigation Plan** (addressing identified risks)
5. **Post-Migration Validation** (testing and verification procedures)

## 🎯 SUCCESS METRICS

- **Migration Success Rate**: 100% of essential functionality preserved
- **Build Success Rate**: 100% of builds pass after migration
- **Test Success Rate**: 100% of tests pass after migration
- **Performance Impact**: <5% performance degradation
- **Security Score**: No security regressions
- **Documentation Coverage**: 100% of public APIs documented

---

**Note**: This analysis must be thorough, evidence-based, and provide clear, actionable recommendations. Every decision must be justified with specific evidence from the codebase analysis.
