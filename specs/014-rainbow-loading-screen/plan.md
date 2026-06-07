# Implementation Plan: Rainbow Loading Overlay

**Branch**: `014-add-new-spec` | **Date**: 2026-06-07 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/014-rainbow-loading-screen/spec.md`

## Summary

Add a global loading overlay extension to the existing Angular host startup flow using a centered animated rainbow loader, a blurred neutral skeleton background (sidebar/topbar/content), and a typed loading service plus overlay component for in-app control. The overlay remains above all content and fades out once loading completes.

## Technical Context

**Language/Version**: TypeScript 5.9, Angular 21.x  
**Primary Dependencies**: Angular standalone components, Angular signals, Angular Router, Angular CDK/Material shell, RxJS 7.8  
**Storage**: N/A  
**Testing**: Angular unit/component tests (`ng test`), route/shell integration specs, Playwright e2e (`npm run test:e2e`)  
**Target Platform**: Modern web browsers, responsive web application
**Project Type**: Angular single application (host shell with native federation remotes)  
**Performance Goals**: First meaningful loading feedback within initial HTML paint; fade-out transition <= 300ms; avoid startup flicker by enforcing minimal visible overlay interval  
**Constraints**: Strict typing, accessibility including reduced-motion handling, preserve current app structure, keep native federation bootstrap sequence intact  
**Scale/Scope**: One global loading overlay flow, one loading service, one overlay component, startup handoff plus optional in-app reuse

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec First, Always**: Plan maps directly to FR-001..FR-009 with P1 centered rainbow loader behavior, P2 skeleton context, and P3 polish/accessibility transitions.
- **Angular-Idiomatic by Default**: Design uses Angular standalone component + signal-driven service for runtime control, while preserving existing static startup HTML handoff path.
- **Strong Typing and Contracts**: Typed contracts documented for loading state model, service command surface, and UI composition hierarchy.
- **Test at the Right Level**: Service/state transitions validated in Angular tests; shell/overlay rendering validated in component tests; startup/handoff behavior validated in e2e.
- **Architectural Simplicity**: Adds only one feature-local service and one overlay component; no new global abstraction layer beyond required loading control.

## Project Structure

### Documentation (this feature)

```text
specs/014-rainbow-loading-screen/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── loading-overlay-service.contract.md
│   └── loading-overlay-ui.contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── index.html
├── main.ts
└── app/
    ├── app.component.ts
    ├── app.component.html
    ├── core/
    │   └── loading/
    │       ├── app-loading.service.ts
    │       ├── app-loading.models.ts
    │       └── app-loading.service.spec.ts
    └── layout/
        ├── loading-overlay.component.ts
        ├── loading-overlay.component.scss
        └── app-shell.component.ts

e2e/
├── independent-remotes.spec.ts
└── (new) loading-overlay.spec.ts
```

**Structure Decision**: Keep the existing Angular host structure and extend only startup/loading surfaces. Startup markup remains in `src/index.html` and `src/main.ts`, while ongoing control is introduced through a feature-local loading service and a dedicated overlay component rendered from the existing app shell.

## Phase 0: Research Findings

- Extend existing startup loading surface instead of replacing it, to preserve first-paint behavior and bootstrap reliability.
- Use fixed full-viewport overlay layering with explicit z-index and pointer blocking to guarantee foreground priority.
- Model loading lifecycle with typed `hidden/active/exiting` states and minimum-visible plus fade timing to avoid flicker.
- Implement rainbow animation with CSS transform/gradient motion and reduced-motion alternatives.
- Validate critical behavior at service/component level plus e2e startup journey coverage.

## Post-Design Constitution Check

- **Spec First, Always**: Design artifacts (`research.md`, `data-model.md`, `contracts/`, `quickstart.md`) fully trace to FR-001..FR-009.
- **Angular-Idiomatic by Default**: No framework mixing or custom runtime engine introduced; Angular service/component patterns retained.
- **Strong Typing and Contracts**: Service contract and UI contract explicitly define state and behavior boundaries.
- **Test at the Right Level**: Planned tests are layered and scoped to behavior criticality with regression intent.
- **Architectural Simplicity**: No unjustified abstraction added; feature remains localized to startup/loading concerns.

## Complexity Tracking

No constitution violations detected. No complexity exceptions required.

## Implementation Status

- Completed: loading state models/service, startup rainbow overlay in `src/index.html`, startup fade-out handoff in `src/main.ts`, Angular overlay component integration in shell, and targeted unit/component tests.
- Validation: `ng test` targeted run passed for loading and shell specs.
- Environment blocker: Playwright e2e launch failed due missing system library `libnspr4.so` in runtime environment.
