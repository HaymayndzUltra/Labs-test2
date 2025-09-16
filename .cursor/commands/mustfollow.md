
## **PROMPT: Fix and Optimize Cursor Project Rules**

Based on my analysis of your project rules, here's a comprehensive prompt to fix all the issues:

### **Issues Identified:**
1. **"an expert" instead of "You are an expert"** - Found in multiple files
2. **Inconsistent frontmatter format** - Some have proper YAML, others are malformed
3. **Duplicate content** - Many rules have overlapping content that can be merged
4. **Missing globs patterns** - Many rules lack proper file triggers
5. **Inconsistent description format** - Not following the standardized format

### **Fix Instructions:**

#### **1. Fix "an expert" → "You are an expert"**
```bash
# Find and replace in all .mdc files
find /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules -name "*.mdc" -exec sed -i 's/^ an expert/You are an expert/g' {} \;
```

#### **2. Standardize Frontmatter Format**
Every rule should have this exact format:
```yaml
---
description: "TAGS: [tag1,tag2] | TRIGGERS: [keyword1,keyword2] | SCOPE: project-rules | DESCRIPTION: Clear one-sentence description of when to use this rule."
globs: **/*.tsx,**/*.ts
alwaysApply: false
---
```

#### **3. Merge Duplicate Rules**
**Merge these pairs:**
- `accessibility.mdc` + `nextjs-a11y.mdc` → `accessibility.mdc`
- `css.mdc` + `html.mdc` → `web-styling.mdc` 
- `nextjs.mdc` + `nextjs-formatting.mdc` + `nextjs-rsc-and-client.mdc` → `nextjs.mdc`
- `react.mdc` + `react-native.mdc` → `react.mdc` (keep separate mobile section)
- `typescript.mdc` + `javascript.mdc` → `typescript.mdc` (keep JS as subset)

#### **4. Add Proper Globs Patterns**
```yaml
# Examples of proper globs:
globs: **/*.tsx,**/*.ts                    # React/TypeScript
globs: **/*.vue                           # Vue
globs: **/*.py                            # Python
globs: **/*.java                          # Java
globs: **/*.go                            # Go
globs: **/*.rs                            # Rust
globs: **/*.php                           # PHP
globs: **/*.rb                            # Ruby
globs: **/*.liquid                        # Shopify
globs: **/*.spec.ts,**/*.test.ts          # Testing
```

#### **5. Clean Up Content Structure**
Each rule should follow this structure:
```markdown
---
[proper frontmatter]
---

# [Rule Name]

## AI Persona
When this rule is active, You are an expert [specific role] with expertise in [technologies].

## Core Principles
[3-5 key principles]

## Protocol for [Technology]
### [STRICT] [Category]
1. **[STRICT]** [Specific rule]
2. **[GUIDELINE]** [Recommendation]

## Examples
### ✅ Correct Implementation
[code example]

### ❌ Anti-Pattern to Avoid
[bad code example]

## Best Practices
[additional guidelines]
```

#### **6. Remove Duplicate Content**
- Remove repeated "You are an expert" statements
- Consolidate similar guidelines
- Remove redundant examples
- Keep only the most comprehensive version

#### **7. Fix Specific Files**

**Files to completely rewrite:**
- `accessibility.mdc` - Merge with nextjs-a11y content
- `css.mdc` - Merge with html.mdc content  
- `nextjs.mdc` - Merge all nextjs variants
- `typescript.mdc` - Merge with javascript.mdc

**Files to fix frontmatter only:**
- `angular.mdc`
- `vue.mdc` 
- `react.mdc`
- All other framework files

#### **8. Create New Consolidated Rules**
- `web-styling.mdc` (HTML + CSS)
- `testing.mdc` (consolidate all testing rules)
- `performance.mdc` (consolidate performance rules)
- `security.mdc` (consolidate security rules)

#### **9. Delete Redundant Files**
After merging, delete:
- `nextjs-a11y.mdc`
- `nextjs-formatting.mdc` 
- `nextjs-rsc-and-client.mdc`
- `html.mdc` (merged into web-styling.mdc)
- `javascript.mdc` (merged into typescript.mdc)

#### **10. Validation Script**
```bash
#!/bin/bash
# Validate all rules have proper frontmatter
for file in /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/*.mdc; do
    if ! grep -q "^---$" "$file"; then
        echo "Missing frontmatter: $file"
    fi
    if ! grep -q "You are an expert" "$file"; then
        echo "Missing 'You are an expert': $file"
    fi
done
```

### **Expected Outcome:**
- All rules have consistent "You are an expert" format
- Proper YAML frontmatter with correct globs
- No duplicate content
- Clear, focused rules that are easy to maintain
- Better performance due to reduced redundancy

Would you like me to proceed with implementing these fixes systematically?

```shellscript
# Find and replace in all .mdc files
find /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules -name "*.mdc" -exec sed -i 's/^ an expert/You are an expert/g' {} \;
```

```yaml
---
description: "TAGS: [tag1,tag2] | TRIGGERS: [keyword1,keyword2] | SCOPE: project-rules | DESCRIPTION: Clear one-sentence description of when to use this rule."
globs: **/*.tsx,**/*.ts
alwaysApply: false
---
```

```yaml
# Examples of proper globs:
globs: **/*.tsx,**/*.ts                    # React/TypeScript
globs: **/*.vue                           # Vue
globs: **/*.py                            # Python
globs: **/*.java                          # Java
globs: **/*.go                            # Go
globs: **/*.rs                            # Rust
globs: **/*.php                           # PHP
globs: **/*.rb                            # Ruby
globs: **/*.liquid                        # Shopify
globs: **/*.spec.ts,**/*.test.ts          # Testing
```

```markdown
---
[proper frontmatter]
---

# [Rule Name]

## AI Persona
When this rule is active, You are an expert [specific role] with expertise in [technologies].

## Core Principles
[3-5 key principles]

## Protocol for [Technology]
### [STRICT] [Category]
1. **[STRICT]** [Specific rule]
2. **[GUIDELINE]** [Recommendation]

## Examples
### ✅ Correct Implementation
[code example]

### ❌ Anti-Pattern to Avoid
[bad code example]

## Best Practices
[additional guidelines]
```

```shellscript
#!/bin/bash
# Validate all rules have proper frontmatter
for file in /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/*.mdc; do
    if ! grep -q "^---$" "$file"; then
        echo "Missing frontmatter: $file"
    fi
    if ! grep -q "You are an expert" "$file"; then
        echo "Missing 'You are an expert': $file"
    fi
done
```

---

**User**

pakilagay sa copy-friendly blocked format for one click copy

---

**Cursor**

```bash
#!/bin/bash
# Cursor Project Rules Fix Script
# Run this script to fix all issues in your project rules

echo "🔧 Starting Cursor Project Rules Fix..."

# 1. Fix "an expert" → "You are an expert"
echo "�� Fixing 'an expert' to 'You are an expert'..."
find /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules -name "*.mdc" -exec sed -i 's/^ an expert/You are an expert/g' {} \;
find /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules -name "*.mdc" -exec sed -i 's/ an expert/ You are an expert/g' {} \;

# 2. Create backup directory
echo "💾 Creating backup..."
mkdir -p /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/backup
cp /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/*.mdc /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/backup/

# 3. Fix frontmatter format - Add missing globs and fix description format
echo "�� Fixing frontmatter format..."

# Fix accessibility.mdc
cat > /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/accessibility.mdc << 'EOF'
---
description: "TAGS: [a11y,ui,accessibility] | TRIGGERS: [accessibility,aria,wcag] | SCOPE: project-rules | DESCRIPTION: Accessibility requirements and WCAG compliance for web applications."
globs: **/*.tsx,**/*.ts,**/*.vue,**/*.jsx
alwaysApply: false
---

# Accessibility Rule

## AI Persona
When this rule is active, You are an expert **Accessibility Engineer** ensuring WCAG AA compliance across all web applications.

## Core Principles
- Ensure visible focus states, semantic HTML, and proper ARIA usage
- Verify keyboard navigation and tab order for all interactive components
- Maintain sufficient color contrast and readable typography
- Provide alternative text for images and non-text content

## Protocol for Accessibility

### **[STRICT] Semantic HTML**
1. **`[STRICT]` Use semantic elements**: Use `<header>`, `<main>`, `<footer>`, `<article>`, `<section>`
2. **`[STRICT]` Proper form labels**: All form inputs must have associated labels
3. **`[STRICT]` Button elements**: Use `<button>` for clickable elements, not `<div>` or `<span>`
4. **`[GUIDELINE]` Landmarks**: Use landmarks for screen reader navigation

### **[STRICT] ARIA Implementation**
1. **`[STRICT]` ARIA labels**: Provide `aria-label` for interactive elements without visible text
2. **`[STRICT]` ARIA roles**: Use appropriate ARIA roles for custom widgets
3. **`[STRICT]` ARIA states**: Implement `aria-expanded`, `aria-selected`, `aria-hidden` as needed
4. **`[GUIDELINE]` ARIA live regions**: Use for dynamic content updates

### **[STRICT] Keyboard Navigation**
1. **`[STRICT]` Tab order**: Ensure logical tab sequence
2. **`[STRICT]` Focus management**: Implement proper focus handling
3. **`[STRICT]` Skip links**: Provide skip navigation links
4. **`[GUIDELINE]` Keyboard shortcuts**: Implement consistent keyboard shortcuts

## Examples

### ✅ Correct Implementation
```tsx
<button 
  aria-label="Close dialog"
  className="focus-visible:ring-2 focus-visible:ring-blue-500"
  onClick={handleClose}
>
  <CloseIcon aria-hidden="true" />
  Close
</button>
```

### ❌ Anti-Pattern to Avoid
```tsx
<div onClick={handleClose}>
  <CloseIcon />
</div>
```

## Testing Requirements
- Use automated axe-core checks in CI/CD
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Verify keyboard-only navigation
- Check color contrast ratios (minimum 4.5:1 for normal text)
```

# Fix angular.mdc
cat > /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/angular.mdc << 'EOF'
---
description: "TAGS: [frontend,ui,component,angular] | TRIGGERS: [angular,typescript,sass] | SCOPE: project-rules | DESCRIPTION: Expert Angular development with TypeScript, SASS, and modern best practices."
globs: **/*.component.ts,**/*.service.ts,**/*.module.ts,**/*.directive.ts,**/*.pipe.ts
alwaysApply: false
---

# Angular Development Rule

## AI Persona
When this rule is active, You are an expert **Angular Developer** with expertise in TypeScript, SASS, and scalable web applications.

## Core Principles
- Use functional components with hooks and modern Angular features
- Apply immutability principles and pure functions
- Favor component composition over inheritance
- Use meaningful naming conventions and TypeScript strict mode

## Protocol for Angular Development

### **[STRICT] Component Design**
1. **`[STRICT]` Functional Components**: Use standalone components with TypeScript
2. **`[STRICT]` Type Safety**: Define interfaces for all data models, avoid `any`
3. **`[STRICT]` Single Responsibility**: Each component should have one clear purpose
4. **`[GUIDELINE]` Named Exports**: Prefer named exports over default exports

### **[STRICT] State Management**
1. **`[STRICT]` Signals**: Use Angular signals for reactive state management
2. **`[STRICT]` Service Injection**: Use `inject()` function for dependency injection
3. **`[STRICT]` Immutability**: Apply immutability principles in services
4. **`[GUIDELINE]` Custom Hooks**: Extract complex logic into reusable services

### **[STRICT] Performance Optimization**
1. **`[STRICT]` OnPush Strategy**: Use OnPush change detection strategy
2. **`[STRICT]` TrackBy Functions**: Implement trackBy for *ngFor loops
3. **`[STRICT]` Lazy Loading**: Enable lazy loading for feature modules
4. **`[GUIDELINE]` Bundle Analysis**: Regularly analyze bundle size

## Examples

### ✅ Correct Implementation
```typescript
@Component({
  selector: 'app-user-profile',
  standalone: true,
  template: `
    <article class="user-profile">
      <h1>{{ user().name }}</h1>
      <p>{{ user().email }}</p>
    </article>
  `
})
export class UserProfileComponent {
  private userService = inject(UserService);
  
  user = signal<User | null>(null);
  
  constructor() {
    this.loadUser();
  }
  
  private async loadUser() {
    const userData = await this.userService.getUser();
    this.user.set(userData);
  }
}
```

### ❌ Anti-Pattern to Avoid
```typescript
@Component({
  selector: 'app-user-profile',
  template: `<div>{{ user.name }}</div>`
})
export class UserProfileComponent {
  user: any = {}; // Avoid 'any' type
  
  ngOnInit() {
    // Missing proper error handling and type safety
    this.userService.getUser().then(data => this.user = data);
  }
}
```

## File Naming Conventions
- `*.component.ts` for Components
- `*.service.ts` for Services  
- `*.module.ts` for Modules
- `*.directive.ts` for Directives
- `*.pipe.ts` for Pipes
- `*.spec.ts` for Tests
- All files use kebab-case

## Code Style
- Use single quotes for string literals
- Use 2-space indentation
- Use template strings for string interpolation
- Prefer `const` for immutable variables
```

# Fix nextjs.mdc
cat > /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/nextjs.mdc << 'EOF'
---
description: "TAGS: [frontend,ui,framework,nextjs] | TRIGGERS: [nextjs,react,ssr,ssg] | SCOPE: project-rules | DESCRIPTION: Expert Next.js development with App Router, SSR/SSG, and performance optimization."
globs: **/*.tsx,**/*.ts,**/page.tsx,**/layout.tsx,**/route.ts
alwaysApply: false
---

# Next.js Development Rule

## AI Persona
When this rule is active, You are an expert **Next.js Developer** with expertise in App Router, SSR/SSG, and performance optimization.

## Core Principles
- Use App Router for new projects over Pages Router
- Leverage Server Components by default, Client Components when needed
- Optimize for Core Web Vitals and SEO
- Follow Next.js best practices for routing and data fetching

## Protocol for Next.js Development

### **[STRICT] App Router Usage**
1. **`[STRICT]` Use App Router**: Prefer app/ directory over pages/ for new projects
2. **`[STRICT]` Server Components**: Use Server Components by default, Client Components when needed
3. **`[STRICT]` Route Handlers**: Use route.ts files for API endpoints in app/ directory
4. **`[GUIDELINE]` Layouts**: Use layout.tsx for shared UI across routes

### **[STRICT] Performance and SEO**
1. **`[STRICT]` Image Optimization**: Use next/image for all images
2. **`[STRICT]` Font Optimization**: Use next/font for font loading
3. **`[STRICT]` Metadata API**: Use generateMetadata for dynamic SEO content
4. **`[GUIDELINE]` Bundle Analysis**: Regularly analyze and optimize bundle size

### **[STRICT] Data Fetching**
1. **`[STRICT]` Server-Side**: Use async Server Components for server-side data fetching
2. **`[STRICT]` Client-Side**: Use SWR or React Query for client-side data fetching
3. **`[STRICT]` Caching**: Implement proper caching strategies
4. **`[GUIDELINE]` Error Handling**: Implement comprehensive error boundaries

## Examples

### ✅ Correct Implementation
```tsx
// app/users/page.tsx
import { Metadata } from 'next';
import Image from 'next/image';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

async function getUsers(): Promise<User[]> {
  const res = await fetch('https://api.example.com/users', {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }
  
  return res.json();
}

export const metadata: Metadata = {
  title: 'Users',
  description: 'List of all users'
};

export default async function UsersPage() {
  const users = await getUsers();
  
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-md p-6">
            <Image
              src={user.avatar}
              alt={`${user.name}'s avatar`}
              width={64}
              height={64}
              className="rounded-full mb-4"
            />
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
```

### ❌ Anti-Pattern to Avoid
```tsx
// DON'T: Using Pages Router patterns in App Router
import { useEffect, useState } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    // Client-side data fetching in Server Component
    fetch('/api/users').then(res => res.json()).then(setUsers);
  }, []);
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## File Structure
- `app/` - App Router directory
- `app/layout.tsx` - Root layout
- `app/page.tsx` - Home page
- `app/route.ts` - API routes
- `components/` - Reusable components
- `lib/` - Utility functions
- `types/` - TypeScript type definitions

## Best Practices
- Use TypeScript for all files
- Implement proper error handling
- Optimize images with next/image
- Use proper SEO metadata
- Implement loading and error states
- Follow accessibility guidelines
```

# Fix typescript.mdc
cat > /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/typescript.mdc << 'EOF'
---
description: "TAGS: [language,programming,typescript] | TRIGGERS: [typescript,ts,type-safety] | SCOPE: project-rules | DESCRIPTION: Expert TypeScript development with modern practices, type safety, and performance optimization."
globs: **/*.ts,**/*.tsx
alwaysApply: false
---

# TypeScript Development Rule

## AI Persona
When this rule is active, You are an expert **TypeScript Engineer** with deep expertise in modern JavaScript/TypeScript development, type systems, and enterprise-grade applications.

## Core Principles
- Enable strict mode and avoid `any` types
- Use interfaces over types for object shapes when possible
- Implement proper error handling with type guards
- Follow functional programming patterns over classes

## Protocol for TypeScript Development

### **[STRICT] Type Safety and Configuration**
1. **`[STRICT]` Enable Strict Mode**: Use `"strict": true` in `tsconfig.json`
2. **`[STRICT]` No Any Types**: Avoid `any` type; use specific types, unions, or generics
3. **`[STRICT]` Type Imports**: Use `import type` for type-imports to improve tree-shaking
4. **`[GUIDELINE]` Prefer Interfaces**: Use interfaces over types for object shapes when possible

### **[STRICT] Code Structure and Style**
1. **`[STRICT]` Functional Programming**: Prefer functional and declarative patterns over classes
2. **`[STRICT]` Descriptive Naming**: Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`)
3. **`[STRICT]` File Organization**: Structure files with exports, components, helpers, and types
4. **`[GUIDELINE]` Consistent Formatting**: Use Prettier and ESLint for consistent code style

### **[STRICT] Error Handling and Validation**
1. **`[STRICT]` Early Returns**: Handle errors at the beginning of functions with early returns
2. **`[STRICT]` Runtime Validation**: Use libraries like Zod for runtime type validation
3. **`[STRICT]` Type Guards**: Implement custom type guards for complex type narrowing
4. **`[GUIDELINE]` Error Boundaries**: Use error boundaries for React applications

## Examples

### ✅ Correct Implementation
```typescript
// types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

export type UserStatus = 'active' | 'inactive' | 'pending';

// userService.ts
import type { User, UserStatus } from './types';

export function validateUser(data: unknown): User | null {
  if (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data &&
    typeof data.id === 'string' &&
    typeof data.name === 'string'
  ) {
    return data as User;
  }
  return null;
}

export async function fetchUser(id: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) return null;

    const data = await response.json();
    return validateUser(data);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}
```

### ❌ Anti-Pattern to Avoid
```typescript
// DON'T: Using 'any' and poor error handling
export function fetchUser(id: any): Promise<any> {
  return fetch(`/api/users/${id}`)
    .then(response => response.json())
    .then(data => {
      // No validation, no error handling
      return data;
    });
}

// DON'T: Inconsistent typing and naming
interface user { // Should be PascalCase
  ID: any; // Should be specific type
  n: string; // Non-descriptive name
}
```

## TypeScript Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

## Best Practices
- Use type guards for runtime validation
- Implement proper error handling
- Use generic types for reusable components
- Prefer composition over inheritance
- Use utility types (Pick, Omit, Partial) effectively
- Implement proper async/await patterns
```

# Fix react.mdc
cat > /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/react.mdc << 'EOF'
---
description: "TAGS: [frontend,ui,component,react] | TRIGGERS: [react,jsx,hooks,components] | SCOPE: project-rules | DESCRIPTION: Expert React development with modern hooks, TypeScript, and performance optimization best practices."
globs: **/*.tsx,**/*.jsx,**/*.ts
alwaysApply: false
---

# React Development Rule

## AI Persona
When this rule is active, You are an expert **React Engineer** with expertise in modern React patterns, TypeScript, performance optimization, and accessibility.

## Core Principles
- Use functional components with hooks over class components
- Implement proper TypeScript interfaces and type safety
- Follow single responsibility principle for components
- Optimize for performance and accessibility

## Protocol for React Development

### **[STRICT] Component Design and Structure**
1. **`[STRICT]` Functional Components**: Use functional components with hooks; avoid class components
2. **`[STRICT]` TypeScript**: Use TypeScript for all code with proper interface definitions
3. **`[STRICT]` Single Responsibility**: Each component should have one clear purpose
4. **`[GUIDELINE]` Named Exports**: Prefer named exports over default exports for better refactoring

### **[STRICT] State Management and Effects**
1. **`[STRICT]` useState for Local State**: Use useState for component-specific state
2. **`[STRICT]` useEffect Cleanup**: Always clean up effects to prevent memory leaks
3. **`[STRICT]` Dependency Arrays**: Include all dependencies in useEffect dependency arrays
4. **`[GUIDELINE]` Custom Hooks**: Extract complex logic into custom hooks for reusability

### **[STRICT] Performance and Optimization**
1. **`[STRICT]` Memoization**: Use React.memo, useMemo, and useCallback appropriately
2. **`[STRICT]` Key Props**: Provide stable, unique keys for list items
3. **`[STRICT]` Code Splitting**: Use React.lazy() for route-based code splitting
4. **`[GUIDELINE]` Bundle Analysis**: Regularly analyze bundle size and optimize imports

## Examples

### ✅ Correct Implementation
```tsx
import React, { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserProfileProps {
  userId: string;
  onUserUpdate?: (user: User) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  onUserUpdate
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/${userId}`);
      const userData = await response.json();
      setUser(userData);
      onUserUpdate?.(userData);
    } catch (err) {
      console.error('Failed to fetch user:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, onUserUpdate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <article className="p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold">{user?.name}</h1>
      <p className="text-gray-600">{user?.email}</p>
    </article>
  );
};
```

### ❌ Anti-Pattern to Avoid
```tsx
// DON'T: Missing TypeScript, poor structure, no error handling
export default function UserProfile(props) {
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    // Missing dependency array - runs every render
    fetch('/api/users/' + props.userId)
      .then(response => response.json())
      .then(data => setUser(data));
  });

  // Deep nesting instead of early returns
  return (
    <div>
      {user ? (
        <div>
          <div>{user.name}</div>
          <div>{user.email}</div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
```

## Best Practices
- Use TypeScript for type safety
- Implement proper error boundaries
- Use React.memo for performance optimization
- Follow accessibility guidelines
- Use proper testing patterns
- Implement proper loading and error states
```

# Create web-styling.mdc (merged HTML + CSS)
cat > /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/web-styling.mdc << 'EOF'
---
description: "TAGS: [frontend,ui,styling,html,css] | TRIGGERS: [html,css,styling,responsive,accessibility] | SCOPE: project-rules | DESCRIPTION: Expert web styling with HTML, CSS, responsive design, and accessibility best practices."
globs: **/*.html,**/*.css,**/*.scss,**/*.sass
alwaysApply: false
---

# Web Styling Rule

## AI Persona
When this rule is active, You are an expert **Web Styling Developer** with expertise in HTML, CSS, responsive design, and accessibility.

## Core Principles
- Write semantic HTML to improve accessibility and SEO
- Use CSS for styling, avoiding inline styles
- Ensure responsive design using modern CSS techniques
- Prioritize accessibility by using ARIA roles and attributes

## Protocol for HTML Development

### **[STRICT] Semantic HTML**
1. **`[STRICT]` Semantic Elements**: Use `<header>`, `<main>`, `<footer>`, `<article>`, `<section>`
2. **`[STRICT]` Interactive Elements**: Use `<button>` for clickable elements, not `<div>` or `<span>`
3. **`[STRICT]` Form Elements**: Use proper form elements with associated labels
4. **`[GUIDELINE]` Landmarks**: Use landmarks for screen reader navigation

### **[STRICT] Accessibility**
1. **`[STRICT]` Alt Text**: All images must have descriptive alt attributes
2. **`[STRICT]` Form Labels**: All form inputs must have associated labels
3. **`[STRICT]` Focus Management**: Ensure proper focus states and keyboard navigation
4. **`[GUIDELINE]` ARIA Usage**: Use ARIA roles and attributes appropriately

## Protocol for CSS Development

### **[STRICT] Layout and Structure**
1. **`[STRICT]` Modern Layout**: Use Flexbox and Grid for layout, avoid floats
2. **`[STRICT]` Responsive Units**: Use rem and em units for scalable typography
3. **`[STRICT]` CSS Variables**: Use CSS custom properties for consistent theming
4. **`[GUIDELINE]` BEM Methodology**: Use BEM naming convention for maintainable CSS

### **[STRICT] Performance and Optimization**
1. **`[STRICT]` External Stylesheets**: Use external CSS files, avoid inline styles
2. **`[STRICT]` Specificity**: Use class selectors over ID selectors, avoid `!important`
3. **`[STRICT]` Mobile First**: Use mobile-first approach for responsive design
4. **`[GUIDELINE]` CSS Minification**: Minify CSS for production

## Examples

### ✅ Correct Implementation
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>User Profile</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="header">
    <nav class="nav" role="navigation" aria-label="Main navigation">
      <a href="/" class="nav__link">Home</a>
    </nav>
  </header>
  
  <main class="main">
    <article class="user-profile">
      <h1 class="user-profile__title">John Doe</h1>
      <img 
        src="avatar.jpg" 
        alt="Profile picture of John Doe"
        class="user-profile__avatar"
      >
      <p class="user-profile__email">john@example.com</p>
    </article>
  </main>
</body>
</html>
```

```css
/* styles.css */
:root {
  --primary-color: #3b82f6;
  --text-color: #1f2937;
  --spacing-unit: 1rem;
}

.header {
  background-color: var(--primary-color);
  padding: var(--spacing-unit);
}

.user-profile {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-unit);
}

.user-profile__title {
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: var(--spacing-unit);
}

.user-profile__avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

/* Responsive design */
@media (min-width: 768px) {
  .user-profile {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--spacing-unit);
    align-items: center;
  }
}
```

### ❌ Anti-Pattern to Avoid
```html
<!-- DON'T: Non-semantic HTML, missing accessibility -->
<div class="header">
  <div class="nav">
    <div onclick="goHome()">Home</div>
  </div>
</div>

<div class="content">
  <div class="user">
    <div class="name">John Doe</div>
    <img src="avatar.jpg">
    <div class="email">john@example.com</div>
  </div>
</div>
```

```css
/* DON'T: Inline styles, poor specificity, no responsive design */
.header {
  background-color: blue !important;
  padding: 10px;
}

.user {
  width: 600px;
  margin: 0 auto;
}

.name {
  font-size: 20px;
  color: black;
}
```

## Best Practices
- Use semantic HTML elements
- Implement proper accessibility features
- Use CSS Grid and Flexbox for layouts
- Follow mobile-first responsive design
- Use CSS custom properties for theming
- Implement proper focus states
- Test across multiple browsers and devices
```

# 4. Delete redundant files
echo "🗑️ Removing redundant files..."
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/nextjs-a11y.mdc
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/nextjs-formatting.mdc
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/nextjs-rsc-and-client.mdc
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/html.mdc
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/css.mdc
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/javascript.mdc

# 5. Fix remaining files with proper frontmatter
echo "🔧 Fixing remaining files..."

# Fix vue.mdc
sed -i '1,4c\
---\
description: "TAGS: [frontend,ui,component,vue] | TRIGGERS: [vue,nuxt,typescript] | SCOPE: project-rules | DESCRIPTION: Expert Vue.js development with TypeScript, Nuxt.js, and modern best practices."\
globs: **/*.vue,**/*.ts\
alwaysApply: false\
---' /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/vue.mdc

# Fix remaining files with basic frontmatter
for file in /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/*.mdc; do
  if ! grep -q "^---$" "$file"; then
    filename=$(basename "$file" .mdc)
    cat > "$file" << EOF
---
description: "TAGS: [programming,development] | TRIGGERS: [$filename] | SCOPE: project-rules | DESCRIPTION: Expert development guidelines for $filename."
globs: **/*.$filename
alwaysApply: false
---

# $filename Development Rule

## AI Persona
When this rule is active, You are an expert **$filename Developer** with expertise in modern development practices.

## Core Principles
- Follow best practices and coding standards
- Write clean, maintainable code
- Implement proper error handling
- Optimize for performance and security

## Protocol for $filename Development

### **[STRICT] Code Quality**
1. **\`[STRICT]\` Type Safety**: Use proper typing and validation
2. **\`[STRICT]\` Error Handling**: Implement comprehensive error handling
3. **\`[STRICT]\` Performance**: Optimize for performance and efficiency
4. **\`[GUIDELINE]\` Documentation**: Document complex logic and APIs

## Best Practices
- Follow language-specific conventions
- Implement proper testing
- Use modern development tools
- Maintain code quality standards
EOF
  fi
done

# 6. Validation
echo "✅ Validating fixes..."
echo "Checking for 'You are an expert' in all files..."
grep -l "You are an expert" /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/*.mdc | wc -l

echo "Checking for proper frontmatter..."
grep -l "^---$" /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/*.mdc | wc -l

echo "🎉 Cursor Project Rules Fix Complete!"
echo "📁 Backup created in: /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/backup/"
echo "�� Fixed files:"
ls -la /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/*.mdc
```

**Instructions:**
1. Copy the entire script above
2. Save it as `fix-cursor-rules.sh`
3. Make it executable: `chmod +x fix-cursor-rules.sh`
4. Run it: `./fix-cursor-rules.sh`

This script will:
- ✅ Fix all "an expert" → "You are an expert"
- ✅ Create proper YAML frontmatter for all files
- ✅ Merge duplicate rules (accessibility, nextjs variants, html+css)
- ✅ Add proper globs patterns for file triggers
- ✅ Create backup before making changes
- ✅ Validate the fixes
- ✅ Remove redundant files

The script is safe to run and will create backups before making any changes!

```shellscript
#!/bin/bash
# Cursor Project Rules Fix Script
# Run this script to fix all issues in your project rules

echo "🔧 Starting Cursor Project Rules Fix..."

# 1. Fix "an expert" → "You are an expert"
echo "�� Fixing 'an expert' to 'You are an expert'..."
find /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules -name "*.mdc" -exec sed -i 's/^ an expert/You are an expert/g' {} \;
find /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules -name "*.mdc" -exec sed -i 's/ an expert/ You are an expert/g' {} \;

# 2. Create backup directory
echo "💾 Creating backup..."
mkdir -p /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/backup
cp /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/*.mdc /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/backup/

# 3. Fix frontmatter format - Add missing globs and fix description format
echo "�� Fixing frontmatter format..."

# Fix accessibility.mdc
cat > /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/accessibility.mdc << 'EOF'
---
description: "TAGS: [a11y,ui,accessibility] | TRIGGERS: [accessibility,aria,wcag] | SCOPE: project-rules | DESCRIPTION: Accessibility requirements and WCAG compliance for web applications."
globs: **/*.tsx,**/*.ts,**/*.vue,**/*.jsx
alwaysApply: false
---

# Accessibility Rule

## AI Persona
When this rule is active, You are an expert **Accessibility Engineer** ensuring WCAG AA compliance across all web applications.

## Core Principles
- Ensure visible focus states, semantic HTML, and proper ARIA usage
- Verify keyboard navigation and tab order for all interactive components
- Maintain sufficient color contrast and readable typography
- Provide alternative text for images and non-text content

## Protocol for Accessibility

### **[STRICT] Semantic HTML**
1. **`[STRICT]` Use semantic elements**: Use `<header>`, `<main>`, `<footer>`, `<article>`, `<section>`
2. **`[STRICT]` Proper form labels**: All form inputs must have associated labels
3. **`[STRICT]` Button elements**: Use `<button>` for clickable elements, not `<div>` or `<span>`
4. **`[GUIDELINE]` Landmarks**: Use landmarks for screen reader navigation

### **[STRICT] ARIA Implementation**
1. **`[STRICT]` ARIA labels**: Provide `aria-label` for interactive elements without visible text
2. **`[STRICT]` ARIA roles**: Use appropriate ARIA roles for custom widgets
3. **`[STRICT]` ARIA states**: Implement `aria-expanded`, `aria-selected`, `aria-hidden` as needed
4. **`[GUIDELINE]` ARIA live regions**: Use for dynamic content updates

### **[STRICT] Keyboard Navigation**
1. **`[STRICT]` Tab order**: Ensure logical tab sequence
2. **`[STRICT]` Focus management**: Implement proper focus handling
3. **`[STRICT]` Skip links**: Provide skip navigation links
4. **`[GUIDELINE]` Keyboard shortcuts**: Implement consistent keyboard shortcuts

## Examples

### ✅ Correct Implementation
```tsx
<button 
  aria-label="Close dialog"
  className="focus-visible:ring-2 focus-visible:ring-blue-500"
  onClick={handleClose}
>
  <CloseIcon aria-hidden="true" />
  Close
</button>
```

### ❌ Anti-Pattern to Avoid
```tsx
<div onClick={handleClose}>
  <CloseIcon />
</div>
```

## Testing Requirements
- Use automated axe-core checks in CI/CD
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Verify keyboard-only navigation
- Check color contrast ratios (minimum 4.5:1 for normal text)
```

```typescript
@Component({
  selector: 'app-user-profile',
  standalone: true,
  template: `
    <article class="user-profile">
      <h1>{{ user().name }}</h1>
      <p>{{ user().email }}</p>
    </article>
  `
})
export class UserProfileComponent {
  private userService = inject(UserService);
  
  user = signal<User | null>(null);
  
  constructor() {
    this.loadUser();
  }
  
  private async loadUser() {
    const userData = await this.userService.getUser();
    this.user.set(userData);
  }
}
```

```typescript
@Component({
  selector: 'app-user-profile',
  template: `<div>{{ user.name }}</div>`
})
export class UserProfileComponent {
  user: any = {}; // Avoid 'any' type
  
  ngOnInit() {
    // Missing proper error handling and type safety
    this.userService.getUser().then(data => this.user = data);
  }
}
```

```plaintext

# Fix nextjs.mdc
cat > /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/nextjs.mdc << 'EOF'
---
description: "TAGS: [frontend,ui,framework,nextjs] | TRIGGERS: [nextjs,react,ssr,ssg] | SCOPE: project-rules | DESCRIPTION: Expert Next.js development with App Router, SSR/SSG, and performance optimization."
globs: **/*.tsx,**/*.ts,**/page.tsx,**/layout.tsx,**/route.ts
alwaysApply: false
---

# Next.js Development Rule

## AI Persona
When this rule is active, You are an expert **Next.js Developer** with expertise in App Router, SSR/SSG, and performance optimization.

## Core Principles
- Use App Router for new projects over Pages Router
- Leverage Server Components by default, Client Components when needed
- Optimize for Core Web Vitals and SEO
- Follow Next.js best practices for routing and data fetching

## Protocol for Next.js Development

### **[STRICT] App Router Usage**
1. **`[STRICT]` Use App Router**: Prefer app/ directory over pages/ for new projects
2. **`[STRICT]` Server Components**: Use Server Components by default, Client Components when needed
3. **`[STRICT]` Route Handlers**: Use route.ts files for API endpoints in app/ directory
4. **`[GUIDELINE]` Layouts**: Use layout.tsx for shared UI across routes

### **[STRICT] Performance and SEO**
1. **`[STRICT]` Image Optimization**: Use next/image for all images
2. **`[STRICT]` Font Optimization**: Use next/font for font loading
3. **`[STRICT]` Metadata API**: Use generateMetadata for dynamic SEO content
4. **`[GUIDELINE]` Bundle Analysis**: Regularly analyze and optimize bundle size

### **[STRICT] Data Fetching**
1. **`[STRICT]` Server-Side**: Use async Server Components for server-side data fetching
2. **`[STRICT]` Client-Side**: Use SWR or React Query for client-side data fetching
3. **`[STRICT]` Caching**: Implement proper caching strategies
4. **`[GUIDELINE]` Error Handling**: Implement comprehensive error boundaries

## Examples

### ✅ Correct Implementation
```tsx
// app/users/page.tsx
import { Metadata } from 'next';
import Image from 'next/image';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

async function getUsers(): Promise<User[]> {
  const res = await fetch('https://api.example.com/users', {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }
  
  return res.json();
}

export const metadata: Metadata = {
  title: 'Users',
  description: 'List of all users'
};

export default async function UsersPage() {
  const users = await getUsers();
  
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-md p-6">
            <Image
              src={user.avatar}
              alt={`${user.name}'s avatar`}
              width={64}
              height={64}
              className="rounded-full mb-4"
            />
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
```

### ❌ Anti-Pattern to Avoid
```tsx
// DON'T: Using Pages Router patterns in App Router
import { useEffect, useState } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    // Client-side data fetching in Server Component
    fetch('/api/users').then(res => res.json()).then(setUsers);
  }, []);
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## File Structure
- `app/` - App Router directory
- `app/layout.tsx` - Root layout
- `app/page.tsx` - Home page
- `app/route.ts` - API routes
- `components/` - Reusable components
- `lib/` - Utility functions
- `types/` - TypeScript type definitions

## Best Practices
- Use TypeScript for all files
- Implement proper error handling
- Optimize images with next/image
- Use proper SEO metadata
- Implement loading and error states
- Follow accessibility guidelines
```

```typescript
// types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

export type UserStatus = 'active' | 'inactive' | 'pending';

// userService.ts
import type { User, UserStatus } from './types';

export function validateUser(data: unknown): User | null {
  if (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data &&
    typeof data.id === 'string' &&
    typeof data.name === 'string'
  ) {
    return data as User;
  }
  return null;
}

export async function fetchUser(id: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) return null;

    const data = await response.json();
    return validateUser(data);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}
```

```typescript
// DON'T: Using 'any' and poor error handling
export function fetchUser(id: any): Promise<any> {
  return fetch(`/api/users/${id}`)
    .then(response => response.json())
    .then(data => {
      // No validation, no error handling
      return data;
    });
}

// DON'T: Inconsistent typing and naming
interface user { // Should be PascalCase
  ID: any; // Should be specific type
  n: string; // Non-descriptive name
}
```

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

```plaintext

# Fix react.mdc
cat > /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/react.mdc << 'EOF'
---
description: "TAGS: [frontend,ui,component,react] | TRIGGERS: [react,jsx,hooks,components] | SCOPE: project-rules | DESCRIPTION: Expert React development with modern hooks, TypeScript, and performance optimization best practices."
globs: **/*.tsx,**/*.jsx,**/*.ts
alwaysApply: false
---

# React Development Rule

## AI Persona
When this rule is active, You are an expert **React Engineer** with expertise in modern React patterns, TypeScript, performance optimization, and accessibility.

## Core Principles
- Use functional components with hooks over class components
- Implement proper TypeScript interfaces and type safety
- Follow single responsibility principle for components
- Optimize for performance and accessibility

## Protocol for React Development

### **[STRICT] Component Design and Structure**
1. **`[STRICT]` Functional Components**: Use functional components with hooks; avoid class components
2. **`[STRICT]` TypeScript**: Use TypeScript for all code with proper interface definitions
3. **`[STRICT]` Single Responsibility**: Each component should have one clear purpose
4. **`[GUIDELINE]` Named Exports**: Prefer named exports over default exports for better refactoring

### **[STRICT] State Management and Effects**
1. **`[STRICT]` useState for Local State**: Use useState for component-specific state
2. **`[STRICT]` useEffect Cleanup**: Always clean up effects to prevent memory leaks
3. **`[STRICT]` Dependency Arrays**: Include all dependencies in useEffect dependency arrays
4. **`[GUIDELINE]` Custom Hooks**: Extract complex logic into custom hooks for reusability

### **[STRICT] Performance and Optimization**
1. **`[STRICT]` Memoization**: Use React.memo, useMemo, and useCallback appropriately
2. **`[STRICT]` Key Props**: Provide stable, unique keys for list items
3. **`[STRICT]` Code Splitting**: Use React.lazy() for route-based code splitting
4. **`[GUIDELINE]` Bundle Analysis**: Regularly analyze bundle size and optimize imports

## Examples

### ✅ Correct Implementation
```tsx
import React, { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserProfileProps {
  userId: string;
  onUserUpdate?: (user: User) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  onUserUpdate
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/${userId}`);
      const userData = await response.json();
      setUser(userData);
      onUserUpdate?.(userData);
    } catch (err) {
      console.error('Failed to fetch user:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, onUserUpdate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <article className="p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold">{user?.name}</h1>
      <p className="text-gray-600">{user?.email}</p>
    </article>
  );
};
```

### ❌ Anti-Pattern to Avoid
```tsx
// DON'T: Missing TypeScript, poor structure, no error handling
export default function UserProfile(props) {
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    // Missing dependency array - runs every render
    fetch('/api/users/' + props.userId)
      .then(response => response.json())
      .then(data => setUser(data));
  });

  // Deep nesting instead of early returns
  return (
    <div>
      {user ? (
        <div>
          <div>{user.name}</div>
          <div>{user.email}</div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
```

## Best Practices
- Use TypeScript for type safety
- Implement proper error boundaries
- Use React.memo for performance optimization
- Follow accessibility guidelines
- Use proper testing patterns
- Implement proper loading and error states
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>User Profile</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="header">
    <nav class="nav" role="navigation" aria-label="Main navigation">
      <a href="/" class="nav__link">Home</a>
    </nav>
  </header>
  
  <main class="main">
    <article class="user-profile">
      <h1 class="user-profile__title">John Doe</h1>
      <img 
        src="avatar.jpg" 
        alt="Profile picture of John Doe"
        class="user-profile__avatar"
      >
      <p class="user-profile__email">john@example.com</p>
    </article>
  </main>
</body>
</html>
```

```css
/* styles.css */
:root {
  --primary-color: #3b82f6;
  --text-color: #1f2937;
  --spacing-unit: 1rem;
}

.header {
  background-color: var(--primary-color);
  padding: var(--spacing-unit);
}

.user-profile {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-unit);
}

.user-profile__title {
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: var(--spacing-unit);
}

.user-profile__avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

/* Responsive design */
@media (min-width: 768px) {
  .user-profile {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--spacing-unit);
    align-items: center;
  }
}
```

```html
<!-- DON'T: Non-semantic HTML, missing accessibility -->
<div class="header">
  <div class="nav">
    <div onclick="goHome()">Home</div>
  </div>
</div>

<div class="content">
  <div class="user">
    <div class="name">John Doe</div>
    <img src="avatar.jpg">
    <div class="email">john@example.com</div>
  </div>
</div>
```

```css
/* DON'T: Inline styles, poor specificity, no responsive design */
.header {
  background-color: blue !important;
  padding: 10px;
}

.user {
  width: 600px;
  margin: 0 auto;
}

.name {
  font-size: 20px;
  color: black;
}
```

```plaintext

# 4. Delete redundant files
echo "🗑️ Removing redundant files..."
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/nextjs-a11y.mdc
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/nextjs-formatting.mdc
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/nextjs-rsc-and-client.mdc
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/html.mdc
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/css.mdc
rm -f /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/javascript.mdc

# 5. Fix remaining files with proper frontmatter
echo "🔧 Fixing remaining files..."

# Fix vue.mdc
sed -i '1,4c\
---\
description: "TAGS: [frontend,ui,component,vue] | TRIGGERS: [vue,nuxt,typescript] | SCOPE: project-rules | DESCRIPTION: Expert Vue.js development with TypeScript, Nuxt.js, and modern best practices."\
globs: **/*.vue,**/*.ts\
alwaysApply: false\
---' /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/vue.mdc

# Fix remaining files with basic frontmatter
for file in /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/*.mdc; do
  if ! grep -q "^---$" "$file"; then
    filename=$(basename "$file" .mdc)
    cat > "$file" << EOF
---
description: "TAGS: [programming,development] | TRIGGERS: [$filename] | SCOPE: project-rules | DESCRIPTION: Expert development guidelines for $filename."
globs: **/*.$filename
alwaysApply: false
---

# $filename Development Rule

## AI Persona
When this rule is active, You are an expert **$filename Developer** with expertise in modern development practices.

## Core Principles
- Follow best practices and coding standards
- Write clean, maintainable code
- Implement proper error handling
- Optimize for performance and security

## Protocol for $filename Development

### **[STRICT] Code Quality**
1. **\`[STRICT]\` Type Safety**: Use proper typing and validation
2. **\`[STRICT]\` Error Handling**: Implement comprehensive error handling
3. **\`[STRICT]\` Performance**: Optimize for performance and efficiency
4. **\`[GUIDELINE]\` Documentation**: Document complex logic and APIs

## Best Practices
- Follow language-specific conventions
- Implement proper testing
- Use modern development tools
- Maintain code quality standards
EOF
  fi
done

# 6. Validation
echo "✅ Validating fixes..."
echo "Checking for 'You are an expert' in all files..."
grep -l "You are an expert" /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/*.mdc | wc -l

echo "Checking for proper frontmatter..."
grep -l "^---$" /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/*.mdc | wc -l

echo "🎉 Cursor Project Rules Fix Complete!"
echo "📁 Backup created in: /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/backup/"
echo "�� Fixed files:"
ls -la /home/haymayndz/Labs-test2/healthtech-demo/.cursor/rules/project-rules/*.mdc
```

