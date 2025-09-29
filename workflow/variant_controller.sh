#!/usr/bin/env bash
set -euo pipefail
mkdir -p build_logs evidence metrics dist .variants

N="${VARIANT_N:-3}"

# Ensure brief exists if missing
python3 workflow/scaffold_briefs.py --if-missing

# Generate N variants end-to-end
for i in $(seq 1 $N); do
  V=".variants/proj_${i}"
  rm -rf "$V"; mkdir -p "$V"
  rsync -a --exclude ".git" ./ "$V/repo/"
  (
    cd "$V/repo"
    python3 workflow/plan_from_brief.py --brief "${BRIEF_PATH}" --out "PLAN_${i}.md"
    python3 workflow/validate_tasks.py --plan "PLAN_${i}.md"
    python3 workflow/select_stacks.py --yes --evidence "evidence/stack_${i}.json"
    python3 workflow/generate_client_project.py --yes --name "${PROJECT_NAME}_${i}"
    bash workflow/install_and_test.sh
    python3 workflow/collect_coverage.py
    python3 workflow/scan_deps.py
    bash workflow/perf_smoke.sh
    python3 workflow/collect_perf.py --input "${PERF_OUTPUT}"
    python3 workflow/enforce_gates.py --config workflow/gates_config.yaml
    python3 workflow/generate_prd_assets.py --yes
    python3 workflow/validate_prd_gate.py --yes
    python3 workflow/validate_compliance_assets.py --yes
    python3 workflow/check_compliance_docs.py
    bash workflow/build_submission_pack.sh "${PROJECT_NAME}_${i}"
  ) > "build_logs/e2e_${i}.log" 2>&1 || true
done

# Pick first successful variant (has dist/)
WIN=0
for i in $(seq 1 $N); do
  if [ -d ".variants/proj_${i}/repo/dist" ]; then WIN="$i"; break; fi
done
[ "$WIN" -eq 0 ] && { echo "No successful variant."; exit 1; }

# Promote winner artifacts to root
rsync -a ".variants/proj_${WIN}/repo/dist/" "dist/" || true
rsync -a ".variants/proj_${WIN}/repo/metrics/" "metrics/" || true
rsync -a ".variants/proj_${WIN}/repo/evidence/" "evidence/" || true

echo "Winner: variant v${WIN}. Artifacts promoted."
