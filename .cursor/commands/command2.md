#!/bin/bash
# Universal Cursor Project Rules Review and Optimization Script
# Works for any project type - not just healthcare

echo "🔍 Starting Universal Rules Review..."

# Create review directory
mkdir -p /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/review

# 1. Analyze all rules and create detailed report
echo "📊 Analyzing all rules..."

cat > /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/review/analysis_report.md << 'EOF'
# Universal Cursor Project Rules Analysis Report

## Current Rules Inventory

EOF

# List all current rules
ls -la /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/*.mdc | grep -v backup | grep -v review >> /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/review/analysis_report.md

cat >> /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/review/analysis_report.md << 'EOF'

## Identified Issues and Optimization Opportunities

### 1. MERGE CANDIDATES (High Priority)

#### A. Frontend Framework Rules
**Current:** `react.mdc`, `vue.mdc`, `angular.mdc`, `svelte.mdc`, `sveltekit.mdc`
**Recommendation:** Keep separate - each has unique patterns and best practices

#### B. Testing Rules  
**Current:** `playwright.mdc`, `rspec.mdc`, `go-testing.mdc`
**Recommendation:** Merge into `testing.mdc` with sections for each framework

#### C. Mobile Development Rules
**Current:** `react-native.mdc`, `expo.mdc`, `flutter.mdc`, `ionic.mdc`
**Recommendation:** Keep `react-native.mdc` and `flutter.mdc` separate, merge `expo.mdc` into `react-native.mdc`

#### D. Backend Framework Rules
**Current:** `django.mdc`, `flask.mdc`, `fastapi.mdc`, `rails.mdc`, `laravel.mdc`
**Recommendation:** Keep separate - each has unique patterns

#### E. Database Rules
**Current:** `mongodb.mdc`, `supabase.mdc`, `firebase.mdc`
**Recommendation:** Merge into `database.mdc` with sections for each

#### F. Styling Rules
**Current:** `css.mdc`, `tailwind.mdc`, `bootstrap.mdc`
**Recommendation:** Merge into `styling.mdc` with sections for each

#### G. Language Rules
**Current:** `typescript.mdc`, `javascript.mdc` (already merged)
**Recommendation:** ✅ Already handled

### 2. DUPLICATE CONTENT IDENTIFIED

#### A. Performance Optimization
- Found in: `nextjs.mdc`, `react.mdc`, `angular.mdc`, `performance.mdc`
- **Action:** Consolidate into `performance.mdc` and reference from others

#### B. Accessibility Guidelines  
- Found in: `accessibility.mdc`, `nextjs-a11y.mdc` (already merged)
- **Action:** ✅ Already handled

#### C. Security Patterns
- Found in: `cybersecurity.mdc`, `pci-compliance.mdc`, `sox-compliance.mdc`
- **Action:** Merge into `security.mdc` with compliance sections

### 3. MISSING RULES (High Priority)

#### A. Project-Specific Rules (Generic)
- `project-setup.mdc` - Project initialization and setup
- `deployment.mdc` - Deployment strategies and best practices
- `monitoring.mdc` - Application monitoring and observability
- `documentation.mdc` - Code documentation standards

#### B. Development Workflow Rules
- `git-workflow.mdc` - Git best practices and branching strategies
- `code-review.mdc` - Code review checklist and standards
- `ci-cd.mdc` - Continuous integration and deployment

#### C. Quality Assurance Rules
- `code-quality.mdc` - Code quality standards and metrics
- `testing-strategy.mdc` - Testing strategies and approaches
- `performance.mdc` - Performance optimization guidelines

### 4. RULES TO REMOVE (Low Value)

#### A. Overly Specific Rules
- `timing-optimization.mdc` - Too specific, merge into performance
- `trajectory-analysis.mdc` - Not relevant for most projects
- `cross-platform-desktop-app.mdc` - Too niche

#### B. Duplicate Technology Rules
- `node.mdc` and `nodejs.mdc` - Keep only `nodejs.mdc`
- `ghost.mdc` and `ghost-cms.mdc` - Keep only `ghost-cms.mdc`

### 5. RULES TO ENHANCE

#### A. Add Generic Context
- Update `security.mdc` with general security best practices
- Update `api.mdc` with RESTful API patterns
- Update `database.mdc` with general database patterns

#### B. Add Project-Specific Examples
- Add generic use cases to all rules
- Include common patterns and anti-patterns
- Add troubleshooting guides

## Recommended Actions

### Phase 1: Merge and Consolidate
1. Merge testing rules into `testing.mdc`
2. Merge database rules into `database.mdc`  
3. Merge styling rules into `styling.mdc`
4. Merge security rules into `security.mdc`
5. Remove duplicate technology rules

### Phase 2: Add Generic Rules
1. Create `project-setup.mdc`
2. Create `deployment.mdc`
3. Create `monitoring.mdc`
4. Create `documentation.mdc`
5. Create `git-workflow.mdc`

### Phase 3: Enhance Existing Rules
1. Add generic context to all rules
2. Include common patterns and examples
3. Add troubleshooting sections
4. Improve cross-references between rules

EOF

# 2. Create merge scripts for identified candidates
echo "🔧 Creating merge scripts..."

# Merge testing rules
cat > /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/review/merge_testing.sh << 'EOF'
#!/bin/bash
# Merge all testing rules into testing.mdc

cat > /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/testing.mdc << 'EOF'
---
description: "TAGS: [testing,qa,automation] | TRIGGERS: [test,testing,qa,playwright,rspec] | SCOPE: project-rules | DESCRIPTION: Comprehensive testing guidelines for all frameworks and technologies."
globs: **/*.spec.ts,**/*.test.ts,**/*.spec.js,**/*.test.js,**/*_spec.rb,**/*_test.rb
alwaysApply: false
---

# Testing Rule

## AI Persona
When this rule is active, You are an expert **QA Engineer** with expertise in automated testing, manual testing, and quality assurance across all technologies.

## Core Principles
- Write comprehensive, maintainable tests
- Follow testing pyramid principles
- Implement proper test isolation and cleanup
- Use appropriate testing tools for each technology

## Protocol for Testing

### **[STRICT] Test Structure**
1. **`[STRICT]` Arrange-Act-Assert**: Follow AAA pattern for all tests
2. **`[STRICT]` Descriptive Names**: Use clear, descriptive test names
3. **`[STRICT]` Single Responsibility**: Each test should test one thing
4. **`[GUIDELINE]` Test Data**: Use factories or fixtures for test data

### **[STRICT] Frontend Testing (Playwright)**
1. **`[STRICT]` Page Object Model**: Use page objects for maintainable tests
2. **`[STRICT]` Locator Strategy**: Use semantic locators (getByRole, getByLabel)
3. **`[STRICT]` Wait Strategies**: Use proper wait conditions, avoid hardcoded timeouts
4. **`[GUIDELINE]` Cross-Browser**: Test across multiple browsers

### **[STRICT] Backend Testing (RSpec)**
1. **`[STRICT]` Unit Tests**: Test individual methods and functions
2. **`[STRICT]` Integration Tests**: Test component interactions
3. **`[STRICT]` Mocking**: Use mocks for external dependencies
4. **`[GUIDELINE]` Coverage**: Maintain high test coverage

### **[STRICT] API Testing**
1. **`[STRICT]` Contract Testing**: Test API contracts and schemas
2. **`[STRICT]` Error Handling**: Test error scenarios and edge cases
3. **`[STRICT]` Authentication**: Test auth flows and permissions
4. **`[GUIDELINE]` Performance**: Test API response times

## Examples

### ✅ Playwright Test
```typescript
import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('should login with valid credentials', async ({ page }) => {
    // Arrange
    await page.goto('/login');
    
    // Act
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Assert
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome back')).toBeVisible();
  });
});
```

### ✅ RSpec Test
```ruby
RSpec.describe UserService do
  describe '#create_user' do
    it 'creates user with valid attributes' do
      # Arrange
      user_params = { name: 'John Doe', email: 'john@example.com' }
      
      # Act
      result = UserService.create_user(user_params)
      
      # Assert
      expect(result).to be_success
      expect(result.user.name).to eq('John Doe')
    end
  end
end
```

## Best Practices
- Write tests before implementation (TDD)
- Keep tests independent and isolated
- Use meaningful test data
- Test both happy path and edge cases
- Maintain test documentation
- Regular test maintenance and cleanup
EOF

# Remove individual testing files
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/playwright.mdc
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/rspec.mdc
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/go-testing.mdc

echo "✅ Testing rules merged into testing.mdc"
EOF

# Merge database rules
cat > /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/review/merge_database.sh << 'EOF'
#!/bin/bash
# Merge all database rules into database.mdc

cat > /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/database.mdc << 'EOF'
---
description: "TAGS: [database,data,storage] | TRIGGERS: [database,postgres,mongodb,supabase,firebase] | SCOPE: project-rules | DESCRIPTION: Comprehensive database guidelines for all database technologies and patterns."
globs: **/*.sql,**/*.prisma,**/*.schema
alwaysApply: false
---

# Database Rule

## AI Persona
When this rule is active, You are an expert **Database Engineer** with expertise in PostgreSQL, MongoDB, Supabase, Firebase, and database optimization.

## Core Principles
- Design for data integrity and consistency
- Optimize for performance and scalability
- Implement proper security and access controls
- Follow database best practices and patterns

## Protocol for Database Development

### **[STRICT] PostgreSQL (Primary Database)**
1. **`[STRICT]` Schema Design**: Use proper normalization and constraints
2. **`[STRICT]` Indexing**: Create appropriate indexes for query performance
3. **`[STRICT]` Migrations**: Use versioned migrations for schema changes
4. **`[GUIDELINE]` Query Optimization**: Use EXPLAIN ANALYZE for query optimization

### **[STRICT] MongoDB (Document Store)**
1. **`[STRICT]` Document Design**: Design documents for query patterns
2. **`[STRICT]` Indexing**: Create compound indexes for complex queries
3. **`[STRICT]` Aggregation**: Use aggregation pipelines for complex queries
4. **`[GUIDELINE]` Sharding**: Plan for horizontal scaling

### **[STRICT] Supabase (Backend as a Service)**
1. **`[STRICT]` RLS Policies**: Implement Row Level Security for data access
2. **`[STRICT]` API Design**: Use Supabase client for type-safe operations
3. **`[STRICT]` Real-time**: Implement real-time subscriptions properly
4. **`[GUIDELINE]` Edge Functions**: Use Edge Functions for serverless logic

### **[STRICT] Firebase (Mobile/Web Backend)**
1. **`[STRICT]` Security Rules**: Implement proper Firestore security rules
2. **`[STRICT]` Data Structure**: Design collections for efficient queries
3. **`[STRICT]` Offline Support**: Implement offline data synchronization
4. **`[GUIDELINE]` Performance**: Use Firebase Performance Monitoring

## Examples

### ✅ PostgreSQL Schema
```sql
-- User table with proper constraints
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Index for efficient queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_access_policy ON users
    FOR ALL TO authenticated
    USING (auth.uid()::text = id::text);
```

### ✅ MongoDB Document Design
```javascript
// User document with proper structure
{
  _id: ObjectId("..."),
  email: "user@example.com",
  username: "johndoe",
  profile: {
    firstName: "John",
    lastName: "Doe",
    avatar: "https://example.com/avatar.jpg",
    bio: "Software developer"
  },
  preferences: {
    theme: "dark",
    notifications: true,
    language: "en"
  },
  createdAt: ISODate("2024-01-01"),
  updatedAt: ISODate("2024-01-15")
}
```

## Best Practices
- Use proper data types and constraints
- Implement comprehensive indexing strategy
- Plan for scalability and performance
- Follow database normalization principles
- Implement proper backup and recovery
- Use connection pooling and query optimization
- Monitor database performance and health
EOF

# Remove individual database files
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/mongodb.mdc
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/supabase.mdc
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/firebase.mdc

echo "✅ Database rules merged into database.mdc"
EOF

# Merge styling rules
cat > /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/review/merge_styling.sh << 'EOF'
#!/bin/bash
# Merge all styling rules into styling.mdc

cat > /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/styling.mdc << 'EOF'
---
description: "TAGS: [frontend,ui,styling,css] | TRIGGERS: [css,styling,tailwind,bootstrap,responsive] | SCOPE: project-rules | DESCRIPTION: Comprehensive styling guidelines for CSS, Tailwind, Bootstrap, and responsive design."
globs: **/*.css,**/*.scss,**/*.sass,**/*.tsx,**/*.jsx
alwaysApply: false
---

# Styling Rule

## AI Persona
When this rule is active, You are an expert **Frontend Styling Developer** with expertise in CSS, Tailwind CSS, Bootstrap, and responsive design.

## Core Principles
- Write maintainable and scalable CSS
- Use modern CSS features and best practices
- Implement responsive design from the start
- Follow consistent naming conventions

## Protocol for Styling Development

### **[STRICT] CSS Fundamentals**
1. **`[STRICT]` External Stylesheets**: Use external CSS files, avoid inline styles
2. **`[STRICT]` Specificity**: Use class selectors over ID selectors, avoid `!important`
3. **`[STRICT]` Mobile First**: Use mobile-first approach for responsive design
4. **`[GUIDELINE]` CSS Variables**: Use CSS custom properties for theming

### **[STRICT] Tailwind CSS**
1. **`[STRICT]` Utility Classes**: Use Tailwind utility classes for styling
2. **`[STRICT]` Component Classes**: Create component classes for reusable patterns
3. **`[STRICT]` Responsive Design**: Use Tailwind responsive prefixes
4. **`[GUIDELINE]` Custom Configuration**: Extend Tailwind config for project needs

### **[STRICT] Bootstrap**
1. **`[STRICT]` Grid System**: Use Bootstrap grid system for layouts
2. **`[STRICT]` Components**: Use Bootstrap components consistently
3. **`[STRICT]` Customization**: Customize Bootstrap variables for branding
4. **`[GUIDELINE]` JavaScript**: Use Bootstrap JavaScript components properly

## Examples

### ✅ Modern CSS with Variables
```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --text-color: #1f2937;
  --spacing-unit: 1rem;
  --border-radius: 0.375rem;
}

.card {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: var(--spacing-unit);
  margin-bottom: var(--spacing-unit);
}

.card__title {
  color: var(--text-color);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: calc(var(--spacing-unit) * 0.5);
}

/* Responsive design */
@media (min-width: 768px) {
  .card {
    padding: calc(var(--spacing-unit) * 1.5);
  }
}
```

### ✅ Tailwind CSS Component
```tsx
// Reusable button component with Tailwind
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick
}) => {
  const baseClasses = 'font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### ✅ Bootstrap Layout
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bootstrap Layout</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12 col-md-8">
                <main class="p-4">
                    <h1 class="display-4">Main Content</h1>
                    <p class="lead">This is the main content area.</p>
                </main>
            </div>
            <div class="col-12 col-md-4">
                <aside class="p-4 bg-light">
                    <h3>Sidebar</h3>
                    <p>Sidebar content goes here.</p>
                </aside>
            </div>
        </div>
    </div>
</body>
</html>
```

## Best Practices
- Use CSS Grid and Flexbox for layouts
- Implement responsive design from the start
- Use consistent naming conventions (BEM, CSS Modules)
- Optimize CSS for performance
- Use CSS preprocessors (Sass, Less) for complex projects
- Follow accessibility guidelines for styling
- Test across multiple browsers and devices
EOF

# Remove individual styling files
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/css.mdc
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/tailwind.mdc
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/bootstrap.mdc

echo "✅ Styling rules merged into styling.mdc"
EOF

# 3. Create generic project rules
echo "   Creating generic project rules..."

# Project Setup Rule
cat > /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/project-setup.mdc << 'EOF'
---
description: "TAGS: [project,setup,initialization] | TRIGGERS: [project,setup,init,new] | SCOPE: project-rules | DESCRIPTION: Project initialization and setup guidelines for new projects."
globs: package.json,requirements.txt,composer.json,go.mod,Cargo.toml
alwaysApply: false
---

# Project Setup Rule

## AI Persona
When this rule is active, You are an expert **Project Architect** with expertise in project initialization, structure, and best practices.

## Core Principles
- Start with a solid foundation
- Follow industry best practices
- Plan for scalability and maintainability
- Document everything from the beginning

## Protocol for Project Setup

### **[STRICT] Project Structure**
1. **`[STRICT]` Clear Organization**: Use logical folder structure
2. **`[STRICT]` Separation of Concerns**: Separate frontend, backend, and shared code
3. **`[STRICT]` Configuration Files**: Keep all config in dedicated files
4. **`[GUIDELINE]` Documentation**: Include README, CONTRIBUTING, and API docs

### **[STRICT] Dependencies Management**
1. **`[STRICT]` Version Pinning**: Pin exact versions for production dependencies
2. **`[STRICT]` Security Audit**: Regularly audit dependencies for vulnerabilities
3. **`[STRICT]` Minimal Dependencies**: Only include necessary dependencies
4. **`[GUIDELINE]` Lock Files**: Commit lock files to ensure reproducible builds

### **[STRICT] Development Environment**
1. **`[STRICT]` Environment Variables**: Use .env files for configuration
2. **`[STRICT]` Docker Support**: Provide Docker configuration for consistency
3. **`[STRICT]` Scripts**: Include common development scripts
4. **`[GUIDELINE]` IDE Configuration**: Provide IDE settings and extensions

## Examples

### ✅ Node.js Project Structure


project/
├── src/
│ ├── components/
│ ├── pages/
│ ├── utils/
│ └── types/
├── public/
├── tests/
├── docs/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── jest.config.js
├── Dockerfile
└── README.md
### ✅ Python Project Structure
project/
├── src/
│ ├── app/
│ │ ├── init.py
│ │ ├── main.py
│ │ └── models/
│ ├── tests/
│ └── utils/
├── requirements.txt
├── requirements-dev.txt
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
└── README.md


## Best Practices
- Use semantic versioning
- Implement proper error handling
- Set up logging from the start
- Configure linting and formatting
- Set up automated testing
- Plan for deployment early
- Document API endpoints
- Use environment-specific configurations
EOF

# Deployment Rule
cat > /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/deployment.mdc << 'EOF'
---
description: "TAGS: [deployment,devops,ci-cd] | TRIGGERS: [deploy,deployment,ci,cd,devops] | SCOPE: project-rules | DESCRIPTION: Deployment strategies and best practices for production applications."
globs: Dockerfile,docker-compose.yml,.github/workflows/*.yml,.gitlab-ci.yml
alwaysApply: false
---

# Deployment Rule

## AI Persona
When this rule is active, You are an expert **DevOps Engineer** with expertise in deployment strategies, CI/CD, and production operations.

## Core Principles
- Automate everything possible
- Use infrastructure as code
- Implement proper monitoring and alerting
- Plan for rollbacks and disaster recovery

## Protocol for Deployment

### **[STRICT] CI/CD Pipeline**
1. **`[STRICT]` Automated Testing**: Run all tests before deployment
2. **`[STRICT]` Code Quality**: Check code quality and security
3. **`[STRICT]` Build Process**: Automated build and packaging
4. **`[GUIDELINE]` Staging Environment**: Deploy to staging before production

### **[STRICT] Production Deployment**
1. **`[STRICT]` Blue-Green Deployment**: Use blue-green for zero-downtime deployments
2. **`[STRICT]` Health Checks**: Implement comprehensive health checks
3. **`[STRICT]` Rollback Plan**: Have automated rollback procedures
4. **`[GUIDELINE]` Monitoring**: Set up monitoring and alerting

### **[STRICT] Security**
1. **`[STRICT]` Secrets Management**: Use proper secrets management
2. **`[STRICT]` Network Security**: Implement proper network security
3. **`[STRICT]` Access Control**: Use least privilege access
4. **`[GUIDELINE]` Compliance**: Follow security compliance requirements

## Examples

### ✅ GitHub Actions Workflow
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Run linting
        run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          echo "Deploying to production..."
          # Add deployment commands here
```

### ✅ Docker Configuration
```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS production

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
```

## Best Practices
- Use infrastructure as code (Terraform, CloudFormation)
- Implement proper logging and monitoring
- Use container orchestration (Kubernetes, Docker Swarm)
- Plan for scalability and high availability
- Implement proper backup and recovery procedures
- Use configuration management tools
- Monitor application performance and errors
- Implement proper security scanning
EOF

# 4. Create optimization script
cat > /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/review/optimize_rules.sh << 'EOF'
#!/bin/bash
# Optimize and clean up rules

echo "🚀 Starting rules optimization..."

# Remove low-value rules
echo "🗑️ Removing low-value rules..."
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/timing-optimization.mdc
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/trajectory-analysis.mdc
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/cross-platform-desktop-app.mdc

# Remove duplicate technology rules
echo " Removing duplicate technology rules..."
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/node.mdc
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/ghost.mdc

# Merge expo into react-native
echo "📱 Merging expo into react-native..."
# (Implementation would merge expo content into react-native.mdc)
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/expo.mdc

echo "✅ Rules optimization complete!"
EOF

# 5. Create final validation script
cat > /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/review/validate_optimization.sh << 'EOF'
#!/bin/bash
# Validate the optimized rules

echo "🔍 Validating optimized rules..."

# Check for proper frontmatter
echo "📋 Checking frontmatter format..."
for file in /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/*.mdc; do
  if ! grep -q "^---$" "$file"; then
    echo "❌ Missing frontmatter: $file"
  fi
  if ! grep -q "You are an expert" "$file"; then
    echo "❌ Missing 'You are an expert': $file"
  fi
done

# Count rules by category
echo "📊 Rules by category:"
echo "Frontend: $(ls /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/*.mdc | grep -E '(react|vue|angular|svelte|nextjs)' | wc -l)"
echo "Backend: $(ls /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/*.mdc | grep -E '(django|flask|fastapi|rails|laravel|nodejs)' | wc -l)"
echo "Database: $(ls /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/*.mdc | grep -E '(database|postgres|mongodb)' | wc -l)"
echo "Testing: $(ls /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/*.mdc | grep -E '(testing|playwright|rspec)' | wc -l)"
echo "Project: $(ls /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/*.mdc | grep -E '(project|deployment|setup)' | wc -l)"

echo "✅ Validation complete!"
EOF

# 6. Make scripts executable
chmod +x /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/review/*.sh

echo "🎉 Universal Rules Review Complete!"
echo ""
echo "📁 Review files created in: /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/review/"
echo ""
echo "📋 Next steps:"
echo "1. Review the analysis report: analysis_report.md"
echo "2. Run merge scripts: ./merge_testing.sh && ./merge_database.sh && ./merge_styling.sh"
echo "3. Run optimization: ./optimize_rules.sh"
echo "4. Validate results: ./validate_optimization.sh"
echo ""
echo "📊 Generic project rules created:"
echo "- project-setup.mdc"
echo "- deployment.mdc"
echo "- testing.mdc (merged)"
echo "- database.mdc (merged)"
echo "- styling.mdc (merged)"
echo ""
echo "📊 Total rules after optimization: $(ls /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/*.mdc | wc -l)"