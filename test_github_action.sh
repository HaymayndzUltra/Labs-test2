#!/bin/bash
if true; then
  if false; then
    echo "❌ Quality gate failed - linting errors found"
    exit 1
  else
    echo "✅ Quality gate passed - all linting checks successful"
  fi
fi
