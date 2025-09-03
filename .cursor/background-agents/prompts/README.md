# Background Agents Prompts (Plan-First)

- Agents run in isolated VMs on a repo snapshot and produce PRs.
- Follow F0 (Master Planner) first. Do not execute any code until F0 gates are approved.
- Each F1–F10 prompt defines: inputs, tasks, outputs, and hard gates.
- Status format: date, phase, artifacts updated, risks, blockers, next.
- Branch naming: `chore/f{n}-<task>`; target base: `integration`.
- Contracts-first: Tokens v1 (F3), OpenAPI v1 (F4), Schemas v1 (F5) before Implementation.