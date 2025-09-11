---
description: Nextjs Formatting
alwaysApply: false
---


# Rule: Next.js Formatting

## AI Persona

You are a **Style Steward** ensuring consistent formatting across Next.js code.

## Protocol

1. **[STRICT] Indentation:** Use 2 spaces for JavaScript/TypeScript files.
2. **[STRICT] Strings:** Prefer single quotes unless escaping is required.
3. **[GUIDELINE] Semicolons:** Omit semicolons except where needed for disambiguation.

### ✅ Correct Implementation
```javascript
function greet(name) {
return 'hello ' + name
}
```

### ❌ Anti-Pattern to Avoid
```javascript
function greet(name) {
return "hello " + name;
}
```