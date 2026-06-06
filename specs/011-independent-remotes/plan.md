# Implementation Plan: Independent Remotes Architecture

**Branch**: `012-independent-remotes` | **Date**: 2026-06-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/011-independent-remotes/spec.md`

## Summary

Integrate the existing external Angular capabilities `mf1` and `mf2` into `spec-as-source-angular-demo` through a federation manifest and route-level lazy loading so the host can present multiple independently deployed capabilities without sharing source code.

## Technical Context

**Language/Version**: TypeScript 5.9, Angular 21.x  
**Primary Dependencies**: Angular standalone components, Angular Router, Angular Material, RxJS, `@angular-architects/native-federation`, `@softarc/native-federation-runtime`, `es-module-shims`  
**Storage**: N/A; runtime configuration and federation manifest files in `public/`  
**Testing**: Angular unit/component tests, route/integration tests, Playwright e2e  
**Target Platform**: Modern web browsers, responsive web app  
**Project Type**: Angular single-application host consuming external Angular applications  
**Performance Goals**: Route-based remote loading remains responsive, with remote navigation completing in under 3 seconds in a normal local/staging environment  
**Constraints**: Strict typing, accessible navigation, independent repository ownership, preserve existing runtime config and authentication bootstrap order  
**Scale/Scope**: One host application initially consuming two external capabilities (`mf1`, `mf2`), with the manifest designed to support more remotes later

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec First, Always**: The plan maps to FR-001 through FR-008, with P1 focused on host consumption of independent capabilities and P2/P3 covering autonomous evolution and repository isolation.
- **Angular-Idiomatic by Default**: The design uses standalone components, Angular Router lazy loading, application bootstrap composition, and native federation APIs rather than custom federation wrappers.
- **Strong Typing and Contracts**: The implementation depends on typed contracts for the federation manifest, route targets, and each remote's exposed module contract (`./Component`).
- **Test at the Right Level**: Route loading and manifest behavior are best proven with integration tests, with component tests for shell navigation state and Playwright for the end-to-end host-to-remote journey.
- **Architectural Simplicity**: No shared state container is needed; a manifest plus route-level remote loading is the simplest viable architecture for isolated external capabilities.

## Project Structure

### Documentation (this feature)

```text
specs/011-independent-remotes/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── federation-manifest.contract.md
│   └── remote-component.contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── core/
│   ├── features/
│   ├── layout/
│   ├── app.config.ts
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── ...
├── main.ts
└── styles.scss

public/
├── config/
│   └── sidebar-menu.json
└── federation.manifest.json

e2e/
```

**Structure Decision**: Keep the host as a single Angular application in `src/`, add the federation manifest under `public/`, and preserve the existing feature-oriented layout in `src/app/`. The external applications `mf1` and `mf2` remain separate repositories and are consumed only through their published contracts.

## Complexity Tracking

No constitutional violations require justification. The feature intentionally avoids additional shared-state layers, wrapper services, or cross-feature abstractions.

