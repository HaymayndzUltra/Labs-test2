# ADR 0002: API Versioning Strategy

## Status
Proposed

## Context
We require stable, versioned API contracts with mocks. Clients may evolve at different paces.

## Decision
- Use URL-based major versioning: `/v1/...`
- Backward-compatible changes allowed within a major version
- Breaking changes require new major and deprecation window
- OpenAPI spec versioned alongside code in `contracts/api/`

## Consequences
- Clear contract expectations for consumers
- Requires release notes and deprecation policy