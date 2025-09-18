# PROTOCOL 4: PROJECT BOOTSTRAPPER

## 1. AI ROLE AND MISSION
Bootstrap a new client repo from a brief using rule manifests (minimal-cursor). Trigger-only, non-interactive.

## 2. THE PROCESS
### STEP 1: Create FE/BE manifests
1. **[MUST] Announce the Goal:**
   > "Generate rule manifests for FE/BE."
2. **[MUST] Actions:**
   - **Action 1:** Ensure `${output_root}/_rules_manifests` exists
   - **Action 2:** Write valid JSON arrays of rule filenames
   - **Halt:** If manifests invalid or empty

### STEP 2: Scaffold FE/BE
1. **[MUST] Announce the Goal:**
   > "Scaffold from manifests with skip-system-checks."
2. **[MUST] Actions:**
   - **Action 1:** Run generator with `--minimal-cursor --rules-manifest`
   - **Halt:** If scaffold fails or outputs missing

## 3. VARIABLES
- project_id: <slug> (e.g., acme-telehealth)
- brief_path: docs/briefs/<slug>/brief.md
- output_root: ./gen_exec

## 4. RUN COMMANDS
```bash
# Ensure manifests dir
mkdir -p ${output_root}/_rules_manifests

# Example manifests (edit rule lists as needed)
python3 - << 'PY'
import json, pathlib, os
pid = os.environ.get('project_id','acme-telehealth')
root = os.environ.get('output_root','./gen_exec')
fe = ["nextjs.mdc","nextjs-formatting.mdc","nextjs-rsc-and-client.mdc","typescript.mdc","accessibility.mdc","nextjs-a11y.mdc"]
be = ["fastapi.mdc","python.mdc","rest-api.mdc","open-api.mdc","performance.mdc","observability.mdc"]
pathlib.Path(f"{root}/_rules_manifests/{pid}-frontend.json").write_text(json.dumps(fe, indent=2))
pathlib.Path(f"{root}/_rules_manifests/{pid}-backend.json").write_text(json.dumps(be, indent=2))
print("[OK] manifests written")
PY

# Scaffold FE
PYTHONPATH=. python3 scripts/generate_client_project.py \
  --name ${project_id}-frontend --industry healthcare --project-type web \
  --frontend nextjs --backend none --database none --auth auth0 --deploy aws \
  --output-dir ${output_root} --include-cursor-assets --minimal-cursor \
  --rules-manifest ${output_root}/_rules_manifests/${project_id}-frontend.json \
  --skip-system-checks --no-git --no-install --yes --force

# Scaffold BE
PYTHONPATH=. python3 scripts/generate_client_project.py \
  --name ${project_id}-backend --industry healthcare --project-type api \
  --frontend none --backend fastapi --database postgres --auth auth0 --deploy aws \
  --output-dir ${output_root} --include-cursor-assets --minimal-cursor \
  --rules-manifest ${output_root}/_rules_manifests/${project_id}-backend.json \
  --compliance hipaa \
  --skip-system-checks --no-git --no-install --yes --force
```

## 5. GENERATED/UPDATED FILES
- ${output_root}/${project_id}-frontend/**
- ${output_root}/${project_id}-backend/**
- ${output_root}/_rules_manifests/${project_id}-frontend.json
- ${output_root}/_rules_manifests/${project_id}-backend.json

## 6. GATE TO NEXT PHASE
- [ ] FE & BE repos exist
- [ ] Manifests valid JSON and non-empty
- [ ] FE/BE `.cursor/rules` exist (at least `project-workflow.mdc`)