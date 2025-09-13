#!/usr/bin/env bash
set -euo pipefail

# Repo Capability Audit (filesystem-only; no web). Prints JSON.
root="${1:-.}"

json_bool() { [[ "$1" == "1" ]] && echo true || echo false; }

has() {
  local path="$1"
  if find "$root" -path "$root/$path" -o -path "$root/$path/*" 2>/dev/null | head -n1 | grep -q .; then
    echo 1
  else
    echo 0
  fi
}

# Checks (0/1 flags)
gen_cli=$(has "scripts/generate_client_project.py")
gen_brief=$(has "scripts/generate_from_brief.py")
planner=$(has "scripts/plan_from_brief.py")
core_engine=$(has "project_generator/core/generator.py")
template_registry=$(has "project_generator/templates/registry.py")
template_engine=$(has "project_generator/templates/template_engine.py")
brief_parser=$(has "project_generator/core/brief_parser.py")
validator=$(has "project_generator/core/validator.py")

tpl_backend=$(has "template-packs/backend")
tpl_frontend=$(has "template-packs/frontend")
tpl_database=$(has "template-packs/database")

be_django=$(has "template-packs/backend/django")
be_fastapi=$(has "template-packs/backend/fastapi")
be_go=$(has "template-packs/backend/go")
be_nestjs=$(has "template-packs/backend/nestjs")

fe_next=$(has "template-packs/frontend/nextjs")
fe_nuxt=$(has "template-packs/frontend/nuxt")
fe_angular=$(has "template-packs/frontend/angular")
fe_expo=$(has "template-packs/frontend/expo")

db_postgres=$(has "template-packs/database/postgres")
db_mongo=$(has "template-packs/database/mongodb")
db_firebase=$(has "template-packs/database/firebase")

samples=$(has "_generated/test-projects")
cursor_rules=$(has ".cursor/rules")
ci=$(has ".github/workflows")
compose=$(has "docker-compose.yml")
devcontainer=$(has ".devcontainer")
docs=$(has "docs")

cat <<JSON
{
  "generator": {
    "cli": $(json_bool "$gen_cli"),
    "brief": $(json_bool "$gen_brief"),
    "planner": $(json_bool "$planner"),
    "core_engine": $(json_bool "$core_engine"),
    "template_registry": $(json_bool "$template_registry"),
    "template_engine": $(json_bool "$template_engine"),
    "brief_parser": $(json_bool "$brief_parser"),
    "validator": $(json_bool "$validator")
  },
  "templates": {
    "backend": {
      "exists": $(json_bool "$tpl_backend"),
      "django": $(json_bool "$be_django"),
      "fastapi": $(json_bool "$be_fastapi"),
      "go": $(json_bool "$be_go"),
      "nestjs": $(json_bool "$be_nestjs")
    },
    "frontend": {
      "exists": $(json_bool "$tpl_frontend"),
      "nextjs": $(json_bool "$fe_next"),
      "nuxt": $(json_bool "$fe_nuxt"),
      "angular": $(json_bool "$fe_angular"),
      "expo": $(json_bool "$fe_expo")
    },
    "database": {
      "exists": $(json_bool "$tpl_database"),
      "postgres": $(json_bool "$db_postgres"),
      "mongodb": $(json_bool "$db_mongo"),
      "firebase": $(json_bool "$db_firebase")
    }
  },
  "ops": {
    "samples": $(json_bool "$samples"),
    "cursor_rules": $(json_bool "$cursor_rules"),
    "ci_workflows": $(json_bool "$ci"),
    "docker_compose": $(json_bool "$compose"),
    "devcontainer": $(json_bool "$devcontainer"),
    "docs": $(json_bool "$docs")
  }
}
JSON
