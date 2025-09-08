#!/usr/bin/env python3
"""
Trigger Plan Generator

Given a project selection, print a compact set of chatbox triggers (in order)
combining Cursor rule triggers (Apply instructions from …) and concrete commands.

Usage examples:
  python scripts/trigger_plan.py --name acme-app --industry healthcare \
    --project-type fullstack --frontend nextjs --backend fastapi --database postgres \
    --auth auth0 --deploy aws --compliance hipaa --workers 8

  python scripts/trigger_plan.py --name api-svc --industry saas \
    --project-type api --backend django --database postgres --workers 8

Notes:
  - Output is safe to copy/paste into chat as sequential triggers/commands.
  - Uses manifest/registry-aware generator (no hardcoded paths in commands).
"""

from __future__ import annotations

import argparse
from typing import List


RULE_TRIGGERS = [
    "Apply instructions from .cursor/rules/master-rules/1-master-rule-context-discovery.mdc",
    "Apply instructions from .cursor/rules/master-rules/2-master-rule-ai-collaboration-guidelines.mdc",
    "Apply instructions from .cursor/rules/master-rules/F8-security-and-compliance-overlay.mdc",
]

WORKFLOW_FILES = {
    'bootstrap': ".cursor/dev-workflow/0-bootstrap-your-project.md",
    'prd': ".cursor/dev-workflow/1-create-prd.md",
    'prd_client': ".cursor/dev-workflow/1-create-client-specific-prd.md",
    'plan': ".cursor/dev-workflow/2-generate-tasks.md",
    'execute': ".cursor/dev-workflow/3-process-tasks.md",
    'retro': ".cursor/dev-workflow/4-implementation-retrospective.md",
    'bg': ".cursor/dev-workflow/5-background-agent-coordination.md",
    'portfolio': ".cursor/dev-workflow/6-client-portfolio-manager.md",
    'update_all': ".cursor/dev-workflow/6-update-all.md",
    'pr_desc': ".cursor/dev-workflow/pr-description.md",
    'pr_evidence': ".cursor/dev-workflow/pr-evidence.md",
}


def build_commands(args: argparse.Namespace) -> List[str]:
    cmd = []
    # Phase 1 - Rules init
    for t in RULE_TRIGGERS:
        cmd.append(t)
    cmd += [
        "export ROUTER_CACHE=on",
        "export ROUTER_LRU_SIZE=512",
    ]
    # Phase 2 - Bootstrap
    cmd.append(f"Apply instructions from {WORKFLOW_FILES['bootstrap']}")
    cmd += [
        "python scripts/doctor.py",
        "./scripts/generate_client_project.py --list-templates | cat",
    ]
    # Phase 3 - PRD
    cmd.append(f"Apply instructions from {WORKFLOW_FILES['prd']}")
    # Phase 4 - Planning
    cmd.append(f"Apply instructions from {WORKFLOW_FILES['plan']}")
    cmd.append("nox -s generator")
    # Phase 5 - Execution
    cmd.append(f"Apply instructions from {WORKFLOW_FILES['execute']}")
    cmd.append("./scripts/generate_client_project.py --list-templates | cat")

    # Dry-run first
    base = (
        f"./scripts/generate_client_project.py --name {args.name} --industry {args.industry} "
        f"--project-type {args.project_type} --frontend {args.frontend} --backend {args.backend} "
        f"--database {args.database} --auth {args.auth} --deploy {args.deploy}"
    )
    if args.compliance:
        base += f" --compliance {args.compliance}"
    workers = f" --workers {args.workers}" if args.workers else ""
    cmd.append(base + workers + " --dry-run --yes")
    # Actual generate
    cmd.append(base + workers + " --yes")

    # Template tests (limit to relevant stacks)
    if args.backend == 'fastapi':
        cmd.append("scripts/setup_template_tests.sh fastapi")
    if args.backend == 'django':
        cmd.append("scripts/setup_template_tests.sh django")
    if args.frontend == 'nextjs':
        cmd.append("scripts/setup_template_tests.sh next")
    if args.frontend == 'angular':
        cmd.append("scripts/setup_template_tests.sh angular")

    # Phase 6 - QA/Review/PR
    cmd.append(f"Apply instructions from {WORKFLOW_FILES['retro']}")
    cmd.append(f"Apply instructions from {WORKFLOW_FILES['bg']}")
    cmd.append(f"Apply instructions from {WORKFLOW_FILES['pr_desc']}")
    cmd.append(f"Apply instructions from {WORKFLOW_FILES['pr_evidence']}")
    cmd += ["nox -s generator"]
    # Optional per-language sessions
    if args.backend == 'fastapi':
        cmd.append("nox -s fastapi")
    if args.backend == 'django':
        cmd.append("nox -s django")
    if args.frontend == 'nextjs':
        cmd.append("nox -s next")
    if args.frontend == 'angular':
        cmd.append("nox -s angular")

    # Phase 7 - Portfolio/Scale (optional)
    cmd.append(f"Apply instructions from {WORKFLOW_FILES['portfolio']}")
    cmd.append(f"Apply instructions from {WORKFLOW_FILES['update_all']}")

    return cmd


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Generate chat triggers for a selected project")
    p.add_argument('--name', required=True)
    p.add_argument('--industry', required=True)
    p.add_argument('--project-type', required=True, choices=['web', 'mobile', 'api', 'fullstack', 'microservices'])
    p.add_argument('--frontend', default='none', choices=['nextjs', 'nuxt', 'angular', 'expo', 'none'])
    p.add_argument('--backend', default='none', choices=['fastapi', 'django', 'nestjs', 'go', 'none'])
    p.add_argument('--database', default='none', choices=['postgres', 'mongodb', 'firebase', 'none'])
    p.add_argument('--auth', default='none', choices=['auth0', 'firebase', 'cognito', 'custom', 'none'])
    p.add_argument('--deploy', default='aws', choices=['aws', 'azure', 'gcp', 'vercel', 'self-hosted'])
    p.add_argument('--compliance')
    p.add_argument('--workers', type=int, default=8)
    return p.parse_args()


def main():
    args = parse_args()
    steps = build_commands(args)
    print("\n# CHAT TRIGGERS (copy/paste in order)\n")
    for s in steps:
        print(s)


if __name__ == '__main__':
    main()

