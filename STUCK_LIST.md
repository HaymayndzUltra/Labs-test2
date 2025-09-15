Blockers:
- Env guard: Docker/Node checks can block full generation without --skip-system-checks (validator).
  Anchors:
   300	        return errors, warnings
   301	    
   302	    def _validate_system_dependencies(self, args) -> tuple[List[str], List[str]]:
   303	        """Validate required system dependencies are available"""
   304	        errors = []
   305	        warnings = []
   306	        
   307	        # Always required (skip hard-block on dry-run)
   308	        dry_run_flag = (getattr(args, 'dry_run', False) is True)
   309	        if which('docker') is None:
   310	            if dry_run_flag:
   311	                warnings.append("Docker not found; proceeding due to --dry-run")
   312	            else:
   313	                errors.append("Docker is required for development environment (install from https://docker.com)")
   314	        
   315	        # Frontend dependencies
   316	        if args.frontend != 'none' or args.backend == 'nestjs':
   317	            if which('node') is None:
   318	                errors.append("Node.js 18+ is required (install from https://nodejs.org)")
   319	            else:
   320	                # Check Node version if possible
   321	                try:
   322	                    result = subprocess.run(['node', '--version'], capture_output=True, text=True, timeout=5)
   323	                    if result.returncode == 0:
   324	                        version = result.stdout.strip().lstrip('v')
   325	                        major_version = int(version.split('.')[0]) if version else 0
   326	                        if major_version < 18:
   327	                            warnings.append(f"Node.js {version} detected; Node.js 18+ recommended")
   328	                except (subprocess.TimeoutExpired, ValueError, FileNotFoundError):
   329	                    pass
   330	            
   331	            if which('npm') is None:
   332	                errors.append("npm is required for Node.js projects (usually bundled with Node.js)")
   333	        
   334	        # Python backends
   335	        if args.backend in ['fastapi', 'django']:
   336	            python_cmd = 'python3' if which('python3') else ('python' if which('python') else None)
   337	            if python_cmd is None:
   338	                errors.append("Python 3.11+ is required for Python backends (install from https://python.org)")
   339	            else:
   340	                # Check Python version if possible
   341	                try:
   342	                    result = subprocess.run([python_cmd, '--version'], capture_output=True, text=True, timeout=5)
   343	                    if result.returncode == 0:
   344	                        version_line = result.stdout.strip()
   345	                        if 'Python' in version_line:
   346	                            version = version_line.split()[1]
   347	                            major, minor = map(int, version.split('.')[:2])
   348	                            if major < 3 or (major == 3 and minor < 11):
   349	                                warnings.append(f"Python {version} detected; Python 3.11+ recommended")
   350	                except (subprocess.TimeoutExpired, ValueError, FileNotFoundError, IndexError):
   351	                    pass
   352	            
   353	            if which('pip') is None and which('pip3') is None:
   354	                warnings.append("pip/pip3 not found; ensure virtualenv can install requirements")
   355	        
   356	        # Go backend
   357	        if args.backend == 'go':
   358	            if which('go') is None:
   359	                errors.append("Go 1.21+ is required for Go backends (install from https://golang.org)")
   360	            else:
   361	                # Check Go version if possible
   362	                try:
   363	                    result = subprocess.run(['go', 'version'], capture_output=True, text=True, timeout=5)
   364	                    if result.returncode == 0:
   365	                        version_line = result.stdout.strip()
   366	                        if 'go' in version_line:
   367	                            version = version_line.split()[2].lstrip('go')
   368	                            major, minor = map(int, version.split('.')[:2])
   369	                            if major < 1 or (major == 1 and minor < 21):
   370	                                warnings.append(f"Go {version} detected; Go 1.21+ recommended")
   371	                except (subprocess.TimeoutExpired, ValueError, FileNotFoundError, IndexError):
   372	                    pass

- CI binding: Numeric thresholds were missing before; now enforced via scripts/enforce_gates.py and ci.yml Gates Enforcer job.
  Anchors:
     1	#!/usr/bin/env python3
     2	"""
     3	Numeric gates enforcer for CI.
     4	
     5	Reads thresholds from either:
     6	- metrics.thresholds (new-style), or
     7	- quality_gates.* (existing generator schema)
     8	
     9	Metrics files expected:
    10	- coverage/coverage-summary.json OR coverage.xml
    11	- metrics/deps.json → {"critical": int, "high": int}
    12	- metrics/perf.json → {"http_p95_ms": float} (optional)
    13	"""
    14	
    15	from __future__ import annotations
    16	
    17	import json
    18	import re
    19	import sys
    20	import xml.etree.ElementTree as ET
    21	from pathlib import Path
    22	
    23	try:
    24	    import yaml  # type: ignore
    25	except Exception:
    26	    print("[GATES] PyYAML not installed. Try: pip install pyyaml", file=sys.stderr)
    27	    sys.exit(2)
    28	
    29	
    30	ROOT = Path(__file__).resolve().parents[1]
    31	GATES = ROOT / "gates_config.yaml"
    32	
    33	
    34	def _read_yaml(p: Path) -> dict:
    35	    try:
    36	        return yaml.safe_load(p.read_text(encoding="utf-8")) or {}
    37	    except Exception as e:
    38	        raise SystemExit(f"[GATES] Failed to parse YAML {p}: {e}")
    39	
    40	
    41	def _read_json(p: Path) -> dict:
    42	    try:
    43	        return json.loads(p.read_text(encoding="utf-8"))
    44	    except Exception as e:
    45	        raise SystemExit(f"[GATES] Failed to parse JSON {p}: {e}")
    46	
    47	
    48	def read_coverage_pct() -> float:
    49	    """Return coverage percent in 0..100, from Node summary or Python coverage.xml."""
    50	    p_sum = ROOT / "coverage" / "coverage-summary.json"
    51	    if p_sum.exists():
    52	        try:
    53	            data = _read_json(p_sum)
    54	            return float(data["total"]["lines"]["pct"])
    55	        except Exception as e:
    56	            print(f"[GATES] Failed reading {p_sum}: {e}", file=sys.stderr)
    57	
    58	    p_xml = ROOT / "coverage.xml"
    59	    if p_xml.exists():
    60	        try:

- Triggers evidence: trigger-commands dir not present (if required).
  Anchors:
01-brief-analysis.tc.mdc
02-technical-planning.tc.mdc
03-project-generation.tc.mdc
04-feature-implementation.tc.mdc
05-testing-qa.tc.mdc
06-deployment.tc.mdc
07-maintenance.tc.mdc
08-security-compliance.tc.mdc
09-documentation.tc.mdc
10-monitoring-observability.tc.mdc
