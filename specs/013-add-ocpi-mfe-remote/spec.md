# Feature Specification: Add OCPI MFE Remote

**Feature Branch**: `013-add-ocpi-mfe-remote`  
**Created**: 2026-06-06  
**Status**: Draft  
**Input**: User description: "Add the microfrontend project ocpi-mfe, using the remote entry http://localhost:4203/remoteEntry.json for development of the OCPI modules"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Access OCPI Modules From Host Navigation (Priority: P1)

As an authenticated user of the host portal, I can open OCPI modules from the existing navigation and see the remote experience rendered in place, so I can use OCPI capabilities without switching systems.

**Why this priority**: This is the primary business outcome of the feature: exposing OCPI capabilities inside the host application.

**Independent Test**: Can be fully tested by selecting the OCPI navigation entry in a development host session and confirming the remote content loads in the main content area.

**Acceptance Scenarios**:

1. **Given** the host application is running and the OCPI remote entry is reachable, **When** a user navigates to the OCPI module route, **Then** the OCPI module renders within the host shell content area.
2. **Given** the user is already in the host shell, **When** they return from an OCPI module route to a local host route, **Then** host navigation and layout continue to work without reload-specific failures.

---

### User Story 2 - Configure Development Remote Endpoint (Priority: P2)

As a developer, I can configure the OCPI remote endpoint using `http://localhost:4203/remoteEntry.json` for development, so I can iterate on OCPI modules independently while testing host integration.

**Why this priority**: Development workflow speed and autonomy depend on predictable local remote resolution.

**Independent Test**: Can be fully tested by starting host and ocpi-mfe locally, then validating that OCPI routes resolve from the configured development remote endpoint.

**Acceptance Scenarios**:

1. **Given** development environment configuration is active, **When** the host resolves the OCPI remote definition, **Then** it uses `http://localhost:4203/remoteEntry.json` as the remote entry source.
2. **Given** the development remote endpoint is unavailable, **When** the user navigates to an OCPI route, **Then** the host shows a recoverable unavailable state instead of crashing the shell.

---

### User Story 3 - Preserve Independent Delivery Boundaries (Priority: P3)

As an engineering team member, I can evolve OCPI modules in `ocpi-mfe` without requiring source coupling in the host repository, so teams can deploy independently and reduce coordination overhead.

**Why this priority**: Independent release and ownership are strategic architecture goals for microfrontend adoption.

**Independent Test**: Can be tested by changing the OCPI remote implementation in its own repository, running against the same remote contract, and confirming host consumption continues without host source changes.

**Acceptance Scenarios**:

1. **Given** OCPI remote modules are built and served from their own repository, **When** the host consumes them through the configured remote contract, **Then** no source import from `ocpi-mfe` exists in the host codebase.

### Edge Cases

- What happens when `http://localhost:4203/remoteEntry.json` returns non-200 responses (404/500) during development?
- How does the host behave when OCPI route metadata exists but the expected exposed remote module is missing or renamed?
- What happens when host loads before the OCPI dev server is started and the user opens an OCPI route later in the same session?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expose OCPI modules through host navigation and routable host paths.
- **FR-002**: System MUST resolve the OCPI development remote entry from `http://localhost:4203/remoteEntry.json` in development context.
- **FR-003**: System MUST load OCPI remote modules lazily at route access time, not during initial host bootstrap.
- **FR-004**: System MUST preserve host shell layout, header, and sidebar behavior while OCPI content is active.
- **FR-005**: System MUST provide a user-visible recoverable fallback state when the OCPI remote cannot be loaded.
- **FR-006**: System MUST keep OCPI integration contract-based, without direct source-code dependency from host repository to `ocpi-mfe` repository.
- **FR-007**: System MUST allow OCPI remote configuration to be changed per environment without changing the routed OCPI user paths.
- **FR-008**: System MUST log or surface integration failure context sufficient for developers to diagnose remote resolution issues in development.

### Implementation Guardrails *(mandatory for Angular-facing features)*

- **IG-001**: Primary Angular surfaces are host route configuration for OCPI paths, remote loading integration points, and shell navigation configuration.
- **IG-002**: Typed contracts required include federation manifest/remote-definition shape, OCPI route metadata, and remote exposed-module identifiers.
- **IG-003**: Validation layers must include unit tests for route/manifest mapping, integration tests for remote route loading behavior, and end-to-end validation for navigation-to-render flow.
- **IG-004**: Shared state abstractions are out of scope; feature-local route and remote-loading integration is sufficient because OCPI modules remain independently owned and loaded via explicit contract.

### Key Entities *(include if feature involves data)*

- **RemoteDefinition**: Runtime description of a remote module source, including remote identifier, entry URL, and exposed module contract.
- **OcpiRouteBinding**: Mapping between host OCPI route paths and the remote module target consumed for rendering.
- **RemoteLoadFailureState**: User-facing and developer-facing failure details for remote resolution errors.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of configured OCPI navigation entries open a rendered OCPI remote module in the host shell when `http://localhost:4203/remoteEntry.json` is reachable.
- **SC-002**: OCPI route activation from user click to first rendered remote view completes within 3 seconds in standard local development conditions.
- **SC-003**: If the OCPI remote entry is unavailable, users see a non-blocking fallback state in under 2 seconds and can still navigate to other host routes.
- **SC-004**: Teams can update OCPI module implementation in `ocpi-mfe` and verify host consumption without requiring host source-code imports from the remote repository.

## Assumptions

- The host already supports remote-federation style route loading and can add another remote definition without architecture migration.
- `ocpi-mfe` serves a development remote entry at `http://localhost:4203/remoteEntry.json` with stable exposed module contracts for OCPI routes.
- Authentication/session behavior is handled by the host shell and does not require this feature to redesign auth flows.
- This feature targets host integration and runtime configuration; OCPI business UI behavior remains owned by `ocpi-mfe`.
