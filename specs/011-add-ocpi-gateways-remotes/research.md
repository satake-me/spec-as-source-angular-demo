# Research: OCPI and Gateways Remote Microfrontends

**Phase 0 Output** | **Generated**: 2026-06-05

## Context

The feature requires two new Angular microfrontends, each in its own repository, consumed by the existing Angular demo shell menu:
- OCPI remote
- Gateways remote

Both integrations must comply with ADR-002 and use Angular Native Federation / Module Federation style runtime loading.

## Decisions

### R1. Runtime composition approach

- Decision: Use Angular shell-hosted runtime-loaded remotes via Native Federation, with top-level shell routes for `ocpi` and `gateways`.
- Rationale: ADR-002 explicitly selects shell + remote architecture and rejects iframe and monorepo-only alternatives.
- Alternatives considered:
- iframe embedding (rejected: fragmented routing/session/user experience)
- static compile-time linking (rejected: violates independent deployment objective)

### R2. Repository and deployment boundaries

- Decision: Create two separate Angular repositories for remotes:
- `mf-ocpi` for OCPI
- `mf-gateways` for Gateways
- Rationale: Feature request requires separate repositories and ADR-002 mandates independent delivery ownership.
- Alternatives considered:
- single repository with two remotes (rejected: does not satisfy repository isolation requirement)
- implementing remotes inside shell repository (rejected: violates ADR-002 repository split)

### R3. Remote exposure contract

- Decision: Each remote exposes Angular route definitions via federation (`./routes`), with an initial landing page component rendered at the remote root path.
- Rationale: ADR-002 route-driven integration keeps shell routing idiomatic and allows feature expansion without shell code churn.
- Alternatives considered:
- exposing full NgModule only (rejected: less explicit contract surface for standalone-route-first Angular)
- exposing component-only entrypoint (rejected: weak support for remote-internal routing growth)

### R4. Shell remote registry governance

- Decision: Manage remote endpoints in environment-aware runtime config (manifest/registry), not hardcoded in route declarations.
- Rationale: Supports independent deployability and environment portability required by ADR-002.
- Alternatives considered:
- hardcoded remote URLs in source (rejected: forces shell redeploy for endpoint changes)

### R5. Navigation and access behavior

- Decision: OCPI and Gateways remain distinct top-level menu entries, each guarded by existing auth/permission visibility and routable only when authorized.
- Rationale: Preserves existing navigation and access model from shell while meeting FR-001..FR-006.
- Alternatives considered:
- grouping under one parent menu node (rejected: request calls for separate menu destinations)

### R6. Failure and fallback behavior

- Decision: If a remote fails to load (manifest, entry, exposed routes), shell shows standardized unavailable-module state and keeps global navigation active.
- Rationale: Aligns with ADR-002 resilience expectations and FR-007/FR-008.
- Alternatives considered:
- blank content with console-only error (rejected: poor user recovery)
- global app crash/fatal state (rejected: violates shell resiliency)

### R7. Validation strategy

- Decision: Validate at three levels:
- component/integration tests in shell for menu visibility, route registration, and fallback behavior
- remote unit/component tests for initial pages
- shell e2e flow for OCPI and Gateways menu-to-remote navigation
- Rationale: Satisfies Constitution principle IV with lowest-cost proof per behavior layer.
- Alternatives considered:
- e2e-only strategy (rejected: slow and brittle for contract-level regressions)

## Best-practice notes

- Keep shared framework dependencies singleton-aligned across shell/remotes to reduce federation incompatibility.
- Version and document remote contracts explicitly to avoid accidental breaking changes.
- Keep remote initial pages minimal and independently bootable to accelerate CI feedback.
- Treat remote URL and exposed-module contract checks as CI gates.

## Resolved clarifications

- Module Federation technology: Native Federation for Angular shell/remotes.
- Remote ownership boundary: one repository per remote project.
- Shell consumption pattern: runtime manifest/registry + route-based lazy remote loading.
- Initial remote scope: OCPI root page and Gateways root page only.
