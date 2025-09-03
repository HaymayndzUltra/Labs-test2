# ADR 0003: Data Model and Migration Plan

## Status
Proposed

## Context
We need a documented data model with migration strategy to support evolving contracts.

## Decision
- Use normalized relational schema for core entities
- Maintain migrations in repo; forward-only, idempotent where possible
- Data contracts reflected in OpenAPI schemas

## Consequences
- Predictable migrations and traceability
- Requires discipline for migration reviews