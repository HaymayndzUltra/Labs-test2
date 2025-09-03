# ADR 0001: Architecture Style and Boundaries

## Status
Proposed

## Context
We need clear system boundaries and contracts for governed delivery. The framework emphasizes documentation integrity, safety, and a11y/perf constraints.

## Decision
Adopt a modular service-oriented architecture with:
- Frontend: consumes tokens/specs; enforces a11y/perf
- Backend API: versioned HTTP JSON (OpenAPI-driven)
- Contracts: maintain in `contracts/api/*`; mocks in `contracts/mocks/*`
- Documentation-first: ADRs and contracts are source of truth

## Consequences
- Pros: clear separation, contract-first development, easier mocks/tests
- Cons: requires discipline to keep contracts current; initial overhead