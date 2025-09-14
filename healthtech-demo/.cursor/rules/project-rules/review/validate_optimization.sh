#!/bin/bash
# Validate the optimized rules

echo "🔍 Validating optimized rules..."

# Check for proper frontmatter
echo "📋 Checking frontmatter format..."
for file in /workspace/healthtech-demo/.cursor/rules/project-rules/*.mdc; do
  if ! grep -q "^---$" "$file"; then
    echo "❌ Missing frontmatter: $file"
  fi
  if ! grep -q "You are an expert" "$file"; then
    echo "❌ Missing 'You are an expert': $file"
  fi
done

# Count rules by category
echo "📊 Rules by category:"
echo "Frontend: $(ls /workspace/healthtech-demo/.cursor/rules/project-rules/*.mdc | grep -E '(react|vue|angular|svelte|nextjs)' | wc -l)"
echo "Backend: $(ls /workspace/healthtech-demo/.cursor/rules/project-rules/*.mdc | grep -E '(django|flask|fastapi|rails|laravel|nodejs)' | wc -l)"
echo "Database: $(ls /workspace/healthtech-demo/.cursor/rules/project-rules/*.mdc | grep -E '(database|postgres|mongodb)' | wc -l)"
echo "Testing: $(ls /workspace/healthtech-demo/.cursor/rules/project-rules/*.mdc | grep -E '(testing|playwright|rspec)' | wc -l)"
echo "Project: $(ls /workspace/healthtech-demo/.cursor/rules/project-rules/*.mdc | grep -E '(project|deployment|setup)' | wc -l)"

echo "✅ Validation complete!"
