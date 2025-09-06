#!/usr/bin/env bash
set -euo pipefail

rules=( $(find .cursor/rules -type f -maxdepth 3 -name "*.mdc" -print 2>/dev/null | sed 's|.*/||' | sort) )
if [[ ${#rules[@]} -eq 0 ]]; then
  echo "I have loaded no rules.";
  exit 0
fi

if [[ ${#rules[@]} -gt 1 ]]; then
  printf "I have loaded the %s and %s rules, which cover governance for this request. I am ready to begin.\n" "${rules[0]}" "${rules[1]}"
else
  printf "I have loaded the %s rule, which covers governance for this request. I am ready to begin.\n" "${rules[0]}"
fi

