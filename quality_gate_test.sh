#!/bin/bash
set -e

echo "🔍 Running quality gate checks..."

# Check if linting command exists and run it
if command -v npm &> /dev/null && [ -f package.json ]; then
  echo "📦 Running npm lint..."
  if npm run lint 2>/dev/null; then
    echo "✅ NPM linting passed"
  else
    echo "❌ NPM linting failed"
    exit 1
  fi
fi

# Check if Python linting is available
if command -v python3 &> /dev/null && [ -f requirements.txt ]; then
  echo "🐍 Running Python linting..."
  if python3 -c "import flake8" 2>/dev/null; then
    if python3 -m flake8 . 2>/dev/null; then
      echo "✅ Python linting passed"
    else
      echo "❌ Python linting failed"
      exit 1
    fi
  else
    echo "⚠️  Python linting skipped (flake8 not installed)"
  fi
fi

# Check if Go linting is available
if command -v go &> /dev/null && [ -f go.mod ]; then
  echo "🔧 Running Go linting..."
  if go vet ./... 2>/dev/null; then
    echo "✅ Go linting passed"
  else
    echo "❌ Go linting failed"
    exit 1
  fi
fi

echo "✅ Quality gate passed - all linting checks successful"
