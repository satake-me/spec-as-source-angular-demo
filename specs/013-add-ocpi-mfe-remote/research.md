# Research: OCPI MFE Remote Integration

## Decision 1: Reuse the existing Native Federation manifest pattern

- **Decision**: Register `ocpi-mfe` in `public/federation.manifest.json` with `http://localhost:4203/remoteEntry.json` for development.
- **Rationale**: Host already resolves remotes through the manifest; extending this pattern is the lowest-risk and most consistent path.
- **Alternatives considered**: Hardcoding URL in route definition or embedding per-environment URLs directly in TS files. These increase coupling and make environment overrides harder.

## Decision 2: Keep route-level lazy loading with existing fallback strategy

- **Decision**: Add an OCPI route in `app.routes.ts` using `loadRemoteModule(remoteName, './Routes')` and fallback to `RemoteUnavailablePageComponent` on failure.
- **Rationale**: This matches proven behavior in host routes and meets FR-005 recoverability requirements.
- **Alternatives considered**: Eager loading at bootstrap, custom remote prefetch service, or route guard-only checks. These add complexity without improving user value for this feature.

## Decision 3: Add a direct menu entry for OCPI module access

- **Decision**: Add one top-level sidebar menu entry pointing to the OCPI host route.
- **Rationale**: Requirement asks for OCPI menu entry and remote linkage; direct route entry is clear and independently testable.
- **Alternatives considered**: Nested placeholder menu group with child entries mapped to non-existent local paths. This introduces dead links and violates route clarity.

## Decision 4: Preserve independent repository boundary

- **Decision**: Host depends only on remote manifest key (`ocpi-mfe`) and exposed module contract, with no source imports from `ocpi-mfe` repository.
- **Rationale**: Preserves independent delivery and ownership per FR-006.
- **Alternatives considered**: Shared source library or direct Git submodule imports. Both break microfrontend autonomy and increase release coupling.

## Decision 5: Validate with layered tests aligned to impact

- **Decision**: Cover with unit/component tests for route/menu wiring, integration behavior for remote load fallback, and e2e path for navigation-to-render.
- **Rationale**: Ensures fast feedback and behavior confidence at lowest practical cost.
- **Alternatives considered**: E2E-only validation. This would be slower and less precise for diagnosing regressions.
