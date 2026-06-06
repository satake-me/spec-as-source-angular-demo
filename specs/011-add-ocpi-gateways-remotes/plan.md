# Implementation Plan: OCPI and Gateways Remote Microfrontends

**Branch**: `011-add-ocpi-gateways-remotes` | **Date**: 2026-06-05 | **Spec**: [specs/011-add-ocpi-gateways-remotes/spec.md](../spec.md)
**Input**: Feature specification from `/specs/011-add-ocpi-gateways-remotes/spec.md`

## Summary

Create two new Angular remote microfrontends in separate repositories, one for OCPI and one for Gateways, each with an initial landing page exposed through Module Federation-compatible Native Federation route contracts. Integrate both remotes into the existing Angular demo shell as distinct menu destinations and top-level routes with authorization-aware visibility and resilient fallback behavior, fully aligned with ADR-002.

## Technical Context

**Language/Version**: TypeScript 5.x, Angular 21.x  
**Primary Dependencies**: Angular standalone APIs, Angular Router, RxJS, Native Federation/Module Federation integration library, existing shell auth/menu contracts  
**Storage**: N/A (runtime configuration for remote registry/endpoints)  
**Testing**: Angular unit/component/integration tests + Playwright e2e (shell flows) + remote repo unit/component tests  
**Target Platform**: Modern web browsers, responsive web app
**Project Type**: Angular shell application consuming two external Angular remote applications in separate repositories  
**Performance Goals**: Shell route navigation to remote entry under 3 seconds for 95% of attempts in normal conditions; failed loads present fallback UI quickly (<1 second after failure detection)  
**Constraints**: Must comply with ADR-002, strict typing, explicit contracts, permission-aware navigation, no iframe fallback architecture, independent deployability per remote  
**Scale/Scope**: 1 shell integration slice + 2 new remote repositories (`mf-ocpi`, `mf-gateways`) with initial pages and federated route exposure

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **Spec First, Always**
- FR-001/FR-002 map to menu destination creation for OCPI and Gateways.
- FR-003/FR-004 map to federated route consumption and remote rendering.
- FR-006 maps to permission-aware menu and route access behavior.
- FR-007/FR-008 map to shell unavailable-module fallback and continued navigation.

✅ **Angular-Idiomatic by Default**
- Shell integration uses Angular routing and lazy remote route loading.
- Remotes expose Angular route definitions and initial Angular pages.
- No framework mixing and no iframe architecture.

✅ **Strong Typing and Contracts**
- Typed contracts defined for remote registry entries and remote route exposure.
- Typed data model covers remote definition, menu entry, and load state transitions.

✅ **Test at the Right Level**
- Shell component/integration tests for menu visibility, route wiring, and fallback states.
- Remote tests for initial page rendering and root route exposure.
- E2E flows for menu-to-remote navigation and failure recovery.

✅ **Architectural Simplicity**
- Cross-repo split is required by ADR-002 and explicit feature request.
- No extra shared abstraction layer introduced beyond explicit contracts.

## Project Structure

### Documentation (this feature)

```text
specs/011-add-ocpi-gateways-remotes/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── remote-registry.contract.md
│   └── remote-route-exposure.contract.md
└── tasks.md
```

### Source Code (repository landscape)

```text
# Shell repository: spec-as-source-angular-demo
src/
├── app/
│   ├── app.routes.ts
│   ├── layout/
│   │   ├── shell-menu-config.loader.ts
│   │   ├── shell-menu.models.ts
│   │   └── shell-navigation.models.ts
│   └── features/
│       └── ...
public/
└── config/
    └── sidebar-menu.json
e2e/

# New remote repository 1: mf-ocpi
src/
├── app/
│   ├── app.routes.ts
│   └── features/
│       └── ocpi/
│           └── ocpi-home-page.component.ts
└── federation/
    └── exposes.routes.ts

# New remote repository 2: mf-gateways
src/
├── app/
│   ├── app.routes.ts
│   └── features/
│       └── gateways/
│           └── gateways-home-page.component.ts
└── federation/
    └── exposes.routes.ts
```

**Structure Decision**: Keep the current Angular demo repository as shell host and create two new standalone Angular remote repositories (`mf-ocpi` and `mf-gateways`) to satisfy ADR-002 independent ownership and deployment constraints while preserving a unified shell navigation experience.

## Complexity Tracking

No constitution violations requiring exception tracking.

---

## Phase 0: Research Completed

Output file: `specs/011-add-ocpi-gateways-remotes/research.md`

Resolved items:
- ADR-002-compliant architecture selection for shell + runtime remotes.
- Independent repository model for OCPI and Gateways remotes.
- Federation exposure and runtime registry contracts.
- Failure and fallback handling for unavailable remotes.
- Validation strategy across shell and remote test layers.

All technical clarifications are resolved. No remaining `NEEDS CLARIFICATION` markers.

## Phase 1: Design & Contracts Completed

Output files:
- `specs/011-add-ocpi-gateways-remotes/data-model.md`
- `specs/011-add-ocpi-gateways-remotes/contracts/remote-registry.contract.md`
- `specs/011-add-ocpi-gateways-remotes/contracts/remote-route-exposure.contract.md`
- `specs/011-add-ocpi-gateways-remotes/quickstart.md`

Design highlights:
- `RemoteDefinition` models typed runtime registry entries for OCPI and Gateways.
- `RemoteMenuEntry` and `RemoteLoadState` model authorization-aware navigation and resilience.
- Route exposure contract standardizes `./routes` + `remoteRoutes` for both remotes.
- Quickstart defines cross-repository implementation and validation sequence.

### Post-Design Constitution Re-check

✅ Spec traceability preserved for all feature requirements.
✅ Angular-idiomatic shell and remote patterns maintained.
✅ Typed contracts and state models explicitly documented.
✅ Test layering matched to behavioral risk.
✅ No unjustified architectural complexity introduced.

## Next Command

Use `/speckit.tasks` to generate dependency-ordered implementation tasks for shell and remote repositories.
