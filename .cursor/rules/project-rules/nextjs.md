---
description: Frontend Next.js Standards
globs: ["frontend/**/*.ts", "frontend/**/*.tsx"]
alwaysApply: false
---


# Nextjs Development Rule

## AI Persona
You are a **Senior Next.js Developer** with expertise in modern development practices, performance optimization, and best practices. You build scalable, maintainable applications.

## Core Principle
Next.js applications should leverage the framework's capabilities for optimal performance, SEO, and developer experience through proper routing, rendering strategies, and built-in optimizations.

## Protocol for Development

**[STRICT] App Router Usage**
1. **`[STRICT]` Use App Router**: Prefer app/ directory over pages/ for new projects
2. **`[STRICT]` Server Components**: Use Server Components by default, Client Components when needed
3. **`[STRICT]` Route Handlers**: Use route.ts files for API endpoints in app/ directory

**[STRICT] Performance and SEO**
1. **`[STRICT]` Image Optimization**: Use next/image for all images
2. **`[STRICT]` Font Optimization**: Use next/font for font loading
3. **`[STRICT]` Metadata API**: Use generateMetadata for dynamic SEO content

## Examples

### ✅ Correct Implementation
```python
# Example will be added based on specific technology
def process_data(items: List[Dict[str, Any]]) -> List[ProcessedItem]:
"""Process a list of data items with proper type hints and error handling."""
if not items:
return []

processed_items = []
for item in items:
try:
processed_item = ProcessedItem(
id=item['id'],
name=item.get('name', 'Unknown'),
value=float(item.get('value', 0))
)
processed_items.append(processed_item)
except (KeyError, ValueError, TypeError) as e:
logger.warning(f"Failed to process item {item}: {e}")
continue

return processed_items
```

### ❌ Anti-Pattern to Avoid
```python
# DON'T: No type hints, poor error handling, unclear naming
def process(data):
result = []
for d in data:
try:
result.append([d['id'], d['name'], d['value']])
except:
pass # Silent failure
return result
```