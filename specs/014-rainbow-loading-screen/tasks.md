# Tasks: Rainbow Loading Overlay

**Input**: Design documents from /specs/014-rainbow-loading-screen/
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are included because the feature changes startup behavior, visual hierarchy, and accessibility-sensitive motion.

**Organization**: Tasks are grouped by user story so each story remains independently implementable and testable.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare feature scaffolding and baseline loading contracts.

- [ ] T001 Create loading feature folder and placeholder barrel in src/app/core/loading/index.ts
- [ ] T002 Create loading overlay component files in src/app/layout/loading-overlay.component.ts
- [ ] T003 [P] Add feature test target placeholder for loading journey in e2e/loading-overlay.spec.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared loading state infrastructure required by all stories.

**CRITICAL**: No user story implementation starts before this phase is complete.

- [ ] T004 Define typed loading state contracts in src/app/core/loading/app-loading.models.ts
- [ ] T005 Implement signal-based loading service lifecycle in src/app/core/loading/app-loading.service.ts
- [ ] T006 [P] Add service regression tests for show/complete/hideNow transitions in src/app/core/loading/app-loading.service.spec.ts
- [ ] T007 Register loading service provider in src/app/app.config.ts
- [ ] T008 Wire startup completion handoff from bootstrap to loading lifecycle in src/main.ts
- [ ] T009 Add startup overlay root hooks for class-based exit states in src/index.html

**Checkpoint**: Foundation complete. User story work can proceed.

---

## Phase 3: User Story 1 - See Engaging Loading Feedback (Priority: P1) 🎯 MVP

**Goal**: Deliver centered rainbow animated loader with clear loading feedback and controlled fade-out.

**Independent Test**: Trigger loading state and confirm centered rainbow loader appears above content, animates smoothly, and fades out on completion.

### Tests for User Story 1

- [ ] T010 [P] [US1] Add component test coverage for loader visibility and phase classes in src/app/layout/loading-overlay.component.spec.ts
- [ ] T011 [P] [US1] Add startup handoff behavior assertions in src/app/app.component.spec.ts
- [ ] T012 [P] [US1] Add e2e verification for overlay visibility and fade-out timing in e2e/loading-overlay.spec.ts

### Implementation for User Story 1

- [ ] T013 [P] [US1] Implement overlay component state bindings and accessibility attributes in src/app/layout/loading-overlay.component.ts
- [ ] T014 [P] [US1] Implement centered rainbow loader markup in src/app/layout/loading-overlay.component.html
- [ ] T015 [US1] Implement rainbow animation, center alignment, and fade-out transitions in src/app/layout/loading-overlay.component.scss
- [ ] T016 [US1] Mount loading overlay component in shell layout in src/app/layout/app-shell.component.html
- [ ] T017 [US1] Connect shell overlay visibility to loading service signals in src/app/layout/app-shell.component.ts

**Checkpoint**: User Story 1 is fully functional and testable as MVP.

---

## Phase 4: User Story 2 - Understand App Structure While Waiting (Priority: P2)

**Goal**: Add blurred neutral skeleton layout behind loader representing sidebar, top bar, and content placeholders.

**Independent Test**: Activate loading state and confirm skeleton regions are recognizable but visually subordinate to the loader.

### Tests for User Story 2

- [ ] T018 [P] [US2] Add component assertions for skeleton region rendering in src/app/layout/loading-overlay.component.spec.ts
- [ ] T019 [P] [US2] Add viewport-focused e2e checks for sidebar/topbar/content skeleton regions in e2e/loading-overlay.spec.ts

### Implementation for User Story 2

- [ ] T020 [P] [US2] Add typed skeleton layout region model in src/app/core/loading/app-loading.models.ts
- [ ] T021 [US2] Implement skeleton region template structure in src/app/layout/loading-overlay.component.html
- [ ] T022 [US2] Implement blur, transparency, and neutral skeleton palette styling in src/app/layout/loading-overlay.component.scss
- [ ] T023 [US2] Tune overlay layer ordering and pointer blocking in src/app/layout/loading-overlay.component.scss
- [ ] T024 [US2] Verify shell content remains unchanged beneath overlay integration in src/app/layout/app-shell.component.html

**Checkpoint**: User Stories 1 and 2 both work independently and together.

---

## Phase 5: User Story 3 - Experience a Polished Visual Transition (Priority: P3)

**Goal**: Add subtle depth/lighting polish and reduced-motion behavior without sacrificing clarity.

**Independent Test**: Observe loading sequence for at least 10 seconds and confirm smooth motion, subtle depth cues, and reduced-motion fallback behavior.

### Tests for User Story 3

- [ ] T025 [P] [US3] Add reduced-motion behavior tests for service timing rules in src/app/core/loading/app-loading.service.spec.ts
- [ ] T026 [P] [US3] Add component tests for reduced-motion classes and polish states in src/app/layout/loading-overlay.component.spec.ts
- [ ] T027 [P] [US3] Add e2e scenario for reduced-motion preference rendering in e2e/loading-overlay.spec.ts

### Implementation for User Story 3

- [ ] T028 [P] [US3] Add reduced-motion detection and state mapping in src/app/core/loading/app-loading.service.ts
- [ ] T029 [US3] Add subtle depth-of-field and gentle lighting layer styles in src/app/layout/loading-overlay.component.scss
- [ ] T030 [US3] Add reduced-motion CSS fallback rules in src/app/layout/loading-overlay.component.scss
- [ ] T031 [US3] Update startup inline fallback styles for consistency with reduced-motion defaults in src/index.html

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening, consistency checks, and documentation updates.

- [ ] T032 [P] Align loading constants and exported type names for clarity in src/app/core/loading/app-loading.models.ts
- [ ] T033 [P] Remove obsolete startup spinner-only styles in src/index.html
- [ ] T034 Run feature-focused Angular tests and capture notes in specs/014-rainbow-loading-screen/quickstart.md
- [ ] T035 [P] Run e2e loading overlay validation and document expected evidence in specs/014-rainbow-loading-screen/quickstart.md
- [ ] T036 Update implementation notes and completion checklist in specs/014-rainbow-loading-screen/plan.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1: No dependencies.
- Phase 2: Depends on Phase 1 and blocks all user stories.
- Phase 3 (US1): Depends on Phase 2.
- Phase 4 (US2): Depends on Phase 2 and integrates with overlay surface from US1.
- Phase 5 (US3): Depends on Phase 2 and builds polish/accessibility on top of US1/US2 visuals.
- Phase 6: Depends on completion of desired user stories.

### User Story Dependencies

- US1 (P1): No dependency on other user stories once foundation is ready.
- US2 (P2): Independent in intent, implemented on shared overlay surface introduced in US1.
- US3 (P3): Independent in intent, but practically layered on established loader and skeleton composition.

### Within Each User Story

- Tests first for behavior regression coverage.
- Typed contracts before consumers.
- Template and styling before shell integration verification.
- Story checkpoint validation before advancing priority.

### Parallel Opportunities

- Setup tasks T002 and T003 can run in parallel after T001.
- Foundational tasks T006 can run in parallel after T004 and T005 begin.
- In US1, T010, T011, and T012 can run in parallel.
- In US2, T018 and T019 can run in parallel.
- In US3, T025, T026, and T027 can run in parallel.
- Polish tasks T032, T033, and T035 can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task T010: Add loader visibility/phase component tests in src/app/layout/loading-overlay.component.spec.ts
Task T011: Add startup handoff tests in src/app/app.component.spec.ts
Task T012: Add overlay fade-out e2e checks in e2e/loading-overlay.spec.ts
```

---

## Parallel Example: User Story 2

```bash
Task T018: Add skeleton region component tests in src/app/layout/loading-overlay.component.spec.ts
Task T019: Add viewport skeleton e2e checks in e2e/loading-overlay.spec.ts
Task T020: Add typed skeleton region model in src/app/core/loading/app-loading.models.ts
```

---

## Parallel Example: User Story 3

```bash
Task T025: Add reduced-motion service tests in src/app/core/loading/app-loading.service.spec.ts
Task T026: Add reduced-motion component tests in src/app/layout/loading-overlay.component.spec.ts
Task T027: Add reduced-motion e2e checks in e2e/loading-overlay.spec.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1.
2. Complete Phase 2.
3. Complete Phase 3 (US1).
4. Validate US1 independently via targeted tests.
5. Demo/deploy MVP with clear loading feedback.

### Incremental Delivery

1. Finish Setup + Foundational.
2. Deliver US1 and validate.
3. Deliver US2 and validate.
4. Deliver US3 and validate.
5. Finish polish and documentation.

### Parallel Team Strategy

1. Team aligns on Phase 1 and Phase 2.
2. Then split by story focus:
   - Developer A: US1 foreground loader behavior.
   - Developer B: US2 skeleton background behavior.
   - Developer C: US3 polish and accessibility behavior.
3. Rejoin for Phase 6 hardening and final regression.
