# PROTOCOL 2A: PROJECT SETUP

## 1. AI ROLE AND MISSION
Prepare the framework for generation: mirror canonical rules to the loader path and ensure manifests directory exists.

## 2. THE PROCESS
### STEP 1: Mirror canonical rules (optional/selective)
1. **[MUST] Announce the Goal:**
   > "Mirror required canonical rules into .cursor/rules/project-rules."
2. **[MUST] Actions:**
   - **Action 1:** Create mirror dir if missing
   - **Action 2:** Copy only the rule files you will reference in manifests
   - **Halt:** If copy fails

### STEP 2: Prepare manifests directory
1. **[MUST] Announce the Goal:**
   > "Ensure manifests directory exists."
2. **[MUST] Actions:**
   - **Action 1:** Create gen_exec/_rules_manifests

## 3. VARIABLES
- mirror_src: src/project_generator/template-packs/rules (canonical; optional)
- mirror_dst: .cursor/rules/project-rules
- output_root: ./gen_exec

## 4. RUN COMMANDS
```bash
# Create loader mirror (keep selective by default)
mkdir -p .cursor/rules/project-rules
# Example selective copy (uncomment if you want full mirror)
# cp -a ${mirror_src}/. .cursor/rules/project-rules/

# Ensure manifests dir exists
mkdir -p ${output_root}/_rules_manifests
```

## 5. GENERATED/UPDATED FILES
- .cursor/rules/project-rules/**
- ${output_root}/_rules_manifests/

## 6. GATE TO NEXT PHASE
- [ ] .cursor/rules/project-rules exists and contains intended rule filenames
- [ ] ${output_root}/_rules_manifests exists