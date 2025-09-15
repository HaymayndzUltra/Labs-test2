File: .cursor/dev-workflow/ci/run_gates.py
    72	def main():
    73	    cfg = load_yaml(CFG)
    74	    snap_file = ROOT / 'frameworks' / '.snapshot_rev'
    75	    snap = snap_file.read_text().strip() if snap_file.exists() else ''
    76	    passed = True
    77	
    78	    # Security
    79	    sec = cfg['paths']['security']
    80	    passed &= check_manifest_artifacts(str(ROOT / sec['manifest']))
    81	    # Critical zero gate: inspect findings summary
    82	    f = load_yaml(str(ROOT / sec['findings']))
    83	    crit = f.get('summary',{}).get('critical_open')
    84	    if crit != 0:
    85	        print(f"security_critical_zero: FAIL critical_open={crit}")
    86	        passed = False
    87	    # Snapshot consistency across key files
    88	    sec_paths = [str(ROOT / sec['manifest']), str(ROOT / sec['findings']), str(ROOT / sec['exceptions'])]
    89	    passed &= check_snapshot_consistency(snap, sec_paths)
    90	
    91	    # QA
    92	    qa = cfg['paths']['qa']
    93	    passed &= check_manifest_artifacts(str(ROOT / qa['manifest']))
    94	    qa_paths = [str(ROOT / qa['manifest'])]
    95	    passed &= check_snapshot_consistency(snap, qa_paths)
    96	
    97	    # Observability
    98	    obs = cfg['paths']['observability']
    99	    passed &= check_manifest_artifacts(str(ROOT / obs['manifest']))
   100	    obs_paths = [str(ROOT / obs['manifest'])]
   101	    passed &= check_snapshot_consistency(snap, obs_paths)
   102	
   103	    # Planning FE/BE/Central
   104	    pl = cfg['paths']['planning']
   105	    for key in ['fe_manifest','be_manifest','central_manifest']:
   106	        p = str(ROOT / pl[key])
   107	        if os.path.exists(p):
   108	            passed &= check_manifest_artifacts(p)
   109	            passed &= check_snapshot_consistency(snap, [p])
   110	
   111	    if not passed:
   112	        print('RESULT: FAIL')
   113	        sys.exit(1)
   114	    print('RESULT: PASS')
   115	
   116	if __name__ == '__main__':

File: .cursor/dev-workflow/ci/gates_config.yaml (first 80 lines)
enforcement: block_on_fail
cycle: "2025-09-08"
paths:
  security:
    findings: frameworks/security/findings.yaml
    exceptions: frameworks/security/waivers.yaml
    manifest: frameworks/security/manifests/2025-09/handoff_manifest.yaml
    digest: frameworks/security/digests/2025-09-02-digest.md
  qa:
    manifest: frameworks/qa-test/manifests/2025-09/handoff_manifest.yaml
    digest: frameworks/qa-test/digests/2025-09-02-digest.md
  planning:
    fe_manifest: frameworks/planning-fe/manifests/2025-09-02-handoff_manifest.yaml
    be_manifest: frameworks/planning-be/manifests/2025-09-02-handoff_manifest.yaml
    central_manifest: frameworks/planning/manifests/2025-09/handoff_manifest.yaml
    fe_digest: frameworks/planning-fe/digests/2025-09-02-digest.md
    be_digest: frameworks/planning-be/digests/2025-09-02-digest.md
  observability:
    manifest: frameworks/observability/manifests/2025-09/handoff_manifest.yaml
    digest: frameworks/observability/digests/2025-09-02-digest.md

checks:
  - schema_lint
  - checksums_present
  - rule_hygiene
  - ui_schema_checks
  - policy_dsl_lint
  - routing_log_schema_check
  - f8_waiver_check
  - context_snapshot_check
  - security_critical_zero
  - snapshot_consistency
  - evidence_present

CI invocation (search)
/workspace/.github/workflows/ci.yml:150:          python3 .cursor/dev-workflow/ci/run_all_gates.py
