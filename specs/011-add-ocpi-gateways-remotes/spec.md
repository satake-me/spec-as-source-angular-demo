# Feature Specification: Add OCPI and Gateways Remotes

**Feature Branch**: `011-add-ocpi-gateways-remotes`  
**Created**: 2026-06-05  
**Status**: Draft  
**Input**: User description: "Include in the Angular menu project two remote frontends: one for OCPI and another for Gateways"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Open OCPI from the menu (Priority: P1)

An authenticated user can see an OCPI entry in the application menu and open the OCPI remote frontend from that entry.

**Why this priority**: OCPI is part of the requested scope and must be reachable through primary navigation to deliver value.

**Independent Test**: Can be fully tested by logging in, locating OCPI in the menu, selecting it, and confirming the OCPI experience loads.

**Acceptance Scenarios**:

1. **Given** the user is authenticated and has access to OCPI, **When** they open the menu, **Then** they see an OCPI menu entry.
2. **Given** the user can see the OCPI menu entry, **When** they select it, **Then** the OCPI remote frontend opens in the main content area.
3. **Given** the OCPI remote frontend cannot be loaded, **When** the user selects OCPI, **Then** they receive a clear error state and can continue using the rest of the application.

---

### User Story 2 - Open Gateways from the menu (Priority: P1)

An authenticated user can see a Gateways entry in the application menu and open the Gateways remote frontend from that entry.

**Why this priority**: Gateways is explicitly requested and must be navigable alongside OCPI.

**Independent Test**: Can be fully tested by logging in, locating Gateways in the menu, selecting it, and confirming the Gateways experience loads.

**Acceptance Scenarios**:

1. **Given** the user is authenticated and has access to Gateways, **When** they open the menu, **Then** they see a Gateways menu entry.
2. **Given** the user can see the Gateways menu entry, **When** they select it, **Then** the Gateways remote frontend opens in the main content area.
3. **Given** the Gateways remote frontend cannot be loaded, **When** the user selects Gateways, **Then** they receive a clear error state and can continue using the rest of the application.

---

### User Story 3 - Navigate without confusion (Priority: P2)

A user can distinguish OCPI and Gateways as separate menu destinations and return to other areas without losing navigation context.

**Why this priority**: Distinct discoverability reduces navigation errors and support friction when introducing multiple remotes.

**Independent Test**: Can be tested by navigating between OCPI, Gateways, and existing menu destinations and verifying labels and active-state behavior remain clear.

**Acceptance Scenarios**:

1. **Given** both remotes are available, **When** the user views the menu, **Then** OCPI and Gateways appear as distinct entries with clear labels.
2. **Given** the user navigates from one remote to another menu item, **When** navigation completes, **Then** the menu reflects the current destination correctly.

---

### Edge Cases

- What happens when OCPI is available but Gateways is temporarily unavailable at startup?
- How does the system handle a user who does not have permission to one remote but does have permission to the other?
- What happens when a user deep-links to an OCPI or Gateways destination after session timeout?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a menu destination for the OCPI remote frontend.
- **FR-002**: System MUST provide a menu destination for the Gateways remote frontend.
- **FR-003**: Users MUST be able to open the OCPI remote frontend by selecting its menu destination.
- **FR-004**: Users MUST be able to open the Gateways remote frontend by selecting its menu destination.
- **FR-005**: System MUST keep OCPI and Gateways as separate, clearly labeled destinations in navigation.
- **FR-006**: System MUST enforce existing access-control rules so users only see and open remotes they are authorized to access.
- **FR-007**: System MUST present a user-facing error state when a selected remote cannot be loaded, without breaking overall shell navigation.
- **FR-008**: System MUST allow users to continue navigating to other menu destinations after a remote load failure.

### Implementation Guardrails *(mandatory for Angular-facing features)*

- **IG-001**: The primary Angular surface is the shell navigation flow, including menu entries and route-level destinations for OCPI and Gateways.
- **IG-002**: The implementation depends on typed contracts for menu item metadata, access visibility, and remote destination identifiers.
- **IG-003**: Critical behavior must be validated at route/integration and end-to-end levels, with targeted component validation for menu rendering and state transitions.
- **IG-004**: If shared cross-feature wrappers are introduced for remote handling, the design must justify why feature-local route handling is insufficient.

### Key Entities *(include if feature involves data)*

- **Remote Menu Entry**: A navigable menu item representing one remote frontend destination, including label, visibility, and destination mapping.
- **Remote Destination**: A target user destination for a remote frontend (OCPI or Gateways) with access eligibility and load status.
- **Navigation Access Context**: User-specific authorization context that determines which remote menu entries are visible and accessible.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In acceptance testing, 100% of authorized users can open OCPI from the menu on first attempt.
- **SC-002**: In acceptance testing, 100% of authorized users can open Gateways from the menu on first attempt.
- **SC-003**: At least 95% of navigation attempts to OCPI and Gateways complete successfully within 3 seconds under normal operating conditions.
- **SC-004**: When a remote fails to load, 100% of affected attempts display a clear recovery path that lets users navigate to another destination within 10 seconds.

## Assumptions

- The existing shell menu model and authorization model remain the source of truth for visibility and access.
- OCPI and Gateways are both intended as top-level user-facing destinations in the current release scope.
- Existing session and authentication behavior applies consistently to both new remote destinations.
- Existing non-remote menu behavior remains unchanged unless required for consistent navigation state.
