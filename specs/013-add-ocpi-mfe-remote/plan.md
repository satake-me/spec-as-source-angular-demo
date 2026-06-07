# Implementation Plan: Add OCPI MFE Remote

**Branch**: `013-add-ocpi-mfe-remote` | **Date**: 2026-06-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/013-add-ocpi-mfe-remote/spec.md`

## Summary

Integrate the external `ocpi-mfe` microfrontend into the host using the same route-level native federation pattern already used for `mf1` and `mf2`, add a host menu entry for OCPI access, and register `http://localhost:4203/remoteEntry.json` as the development remote entry.

## Technical Context

**Language/Version**: TypeScript 5.9, Angular 21.x  
**Primary Dependencies**: Angular standalone components, Angular Router, RxJS, `@angular-architects/native-federation`, `@softarc/native-federation-runtime`  
**Storage**: N/A; runtime config and federation manifest under `public/`  
**Testing**: Angular unit/component tests, route integration tests, Playwright end-to-end tests  
**Target Platform**: Modern web browsers, responsive web app
**Project Type**: Angular host application consuming independent remotes  
**Performance Goals**: OCPI route activation renders in under 3s in local dev when remote is up; failure fallback visible in under 2s when remote is down  
**Constraints**: Strict typing, route-level lazy loading only, preserve shell behavior, no source-level dependency on `ocpi-mfe`  
**Scale/Scope**: One new remote (`ocpi-mfe`), one new host route, one new menu entry, one additional manifest registration

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec First, Always**: Planned slices map directly to FR-001..FR-008 with P1 route exposure, P2 dev endpoint registration, and P3 independent ownership.
- **Angular-Idiomatic by Default**: Implementation keeps Angular-native route lazy loading via `loadRemoteModule` and standalone route config.
- **Strong Typing and Contracts**: Contracts include typed manifest shape, remote key, exposed module key `./Component`, and route-to-remote binding.
- **Test at the Right Level**: Unit/component tests cover route and menu wiring; integration tests cover remote loader fallback; e2e covers click-to-render journey.
- **Architectural Simplicity**: Reuses current mf1/mf2 federation pattern without adding new wrappers/services.

## Project Structure

### Documentation (this feature)

```text
specs/013-add-ocpi-mfe-remote/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── federation-manifest.contract.md
│   └── ocpi-remote-component.contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── app.routes.ts
│   ├── layout/
│   └── features/remote-unavailable/
└── ...

public/
├── federation.manifest.json
└── config/sidebar-menu.json

e2e/
```

**Structure Decision**: Keep the current single-app host structure and extend existing integration points (`app.routes.ts`, federation manifest, and sidebar menu config) to add the OCPI remote with no additional abstraction layer.

## Phase 0: Research Findings

- Remote registration follows the existing mf1/mf2 manifest contract to preserve operational consistency.
- Route loading should use `loadRemoteComponent('ocpi-mfe', 'OcpiMfeComponent')` with the same fallback behavior used for other remotes.
- Menu entry should be a direct host route link to OCPI, avoiding placeholder child routes that are not mapped to a remote.

## Post-Design Constitution Check

- **Spec First, Always**: Design artifacts (`research.md`, `data-model.md`, `contracts`, `quickstart.md`) trace to FRs and user stories.
- **Angular-Idiomatic by Default**: No framework mixing or custom loading framework introduced.
- **Strong Typing and Contracts**: Explicit manifest and remote component contracts documented.
- **Test at the Right Level**: Test layers are defined and scoped by behavior criticality.
- **Architectural Simplicity**: No additional complexity introduced; current pattern reused.

## Complexity Tracking

No constitutional violations or complexity exceptions were required.
