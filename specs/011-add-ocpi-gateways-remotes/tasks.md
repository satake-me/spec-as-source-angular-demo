# Tasks: OCPI and Gateways Remote Microfrontends

**Input**: Design documents from `/specs/011-add-ocpi-gateways-remotes/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are required for this feature by spec guardrail IG-003 and plan testing strategy.

**Organization**: Tasks are grouped by user story to enable independent implementation and validation.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shell and remote repository scaffolding for federated development.

- [x] T001 Create remote repository bootstrap guide for `mf-ocpi` and `mf-gateways` in specs/011-add-ocpi-gateways-remotes/quickstart.md
- [x] T002 Configure shell dependency and build scripts for federation runtime in package.json
- [x] T003 [P] Add shell environment placeholders for OCPI and Gateways remote endpoints in public/config/
- [x] T004 [P] Create shell e2e spec scaffold for remote navigation flows in e2e/remotes-navigation.spec.ts
- [x] T005 [P] Create OCPI remote project scaffold with Native Federation baseline in ../mf-ocpi/
- [x] T006 [P] Create Gateways remote project scaffold with Native Federation baseline in ../mf-gateways/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish contracts and runtime wiring that all user stories depend on.

**⚠️ CRITICAL**: No user story implementation starts before this phase is complete.

- [x] T007 Define `RemoteDefinition`, `RemoteRegistry`, and load-state contracts in src/app/layout/shell-remote.models.ts
- [x] T008 Implement runtime remote registry loader and validation rules in src/app/layout/shell-remote-registry.loader.ts
- [x] T009 [P] Add unit tests for registry parsing, uniqueness, and malformed entry handling in src/app/layout/shell-remote-registry.loader.spec.ts
- [x] T010 Add shell federation route helper for loading remote `./routes` contracts in src/app/layout/shell-remote-loader.ts
- [x] T011 [P] Add shell fallback component for unavailable remotes in src/app/layout/remote-unavailable.component.ts
- [x] T012 [P] Add shell fallback component template and styles in src/app/layout/remote-unavailable.component.html
- [x] T013 [P] Add shell fallback component styles for standardized error and recovery states in src/app/layout/remote-unavailable.component.scss
- [x] T014 Wire fallback behavior for remote load failures in src/app/app.routes.ts
- [x] T015 Add integration tests for remote loader success and failure transitions in src/app/app.routes.spec.ts

**Checkpoint**: Federation foundation complete; user stories can now be implemented independently.

---

## Phase 3: User Story 1 - Open OCPI from the menu (Priority: P1) 🎯 MVP

**Goal**: Allow authorized users to discover and open the OCPI remote from shell menu navigation.

**Independent Test**: Authenticate as OCPI-authorized user, confirm OCPI menu entry is visible, navigate to `/ocpi`, and verify OCPI initial page renders or fallback appears when OCPI remote is unavailable.

### Tests for User Story 1

- [x] T016 [P] [US1] Add shell component test coverage for OCPI menu visibility and authorization gating in src/app/layout/shell-menu.component.spec.ts
- [x] T017 [P] [US1] Add shell integration test for `/ocpi` route loading and fallback path in src/app/app.routes.spec.ts
- [ ] T018 [P] [US1] Add e2e flow for menu-to-OCPI navigation in e2e/remotes-navigation.spec.ts
- [x] T019 [P] [US1] Add OCPI remote unit/component test for initial page rendering in ../mf-ocpi/src/app/features/ocpi/ocpi-home-page.component.spec.ts
- [x] T020 [P] [US1] Add OCPI remote route exposure contract test for `./routes` and `remoteRoutes` in ../mf-ocpi/src/federation/exposes.routes.spec.ts

### Implementation for User Story 1

- [x] T021 [US1] Add OCPI remote registry entry with route path and permissions in public/config/sidebar-menu.json
- [x] T022 [US1] Register shell top-level `/ocpi` federated route in src/app/app.routes.ts
- [x] T023 [US1] Implement OCPI remote route exposure via `remoteRoutes` in ../mf-ocpi/src/federation/exposes.routes.ts
- [x] T024 [US1] Implement OCPI initial landing page component in ../mf-ocpi/src/app/features/ocpi/ocpi-home-page.component.ts
- [x] T025 [US1] Wire OCPI remote root route to landing component in ../mf-ocpi/src/app/app.routes.ts
- [x] T026 [US1] Integrate OCPI load failure reason mapping to shell unavailable-module state in src/app/layout/shell-remote-loader.ts

**Checkpoint**: US1 is independently functional and demonstrable as MVP.

---

## Phase 4: User Story 2 - Open Gateways from the menu (Priority: P1)

**Goal**: Allow authorized users to discover and open the Gateways remote from shell menu navigation.

**Independent Test**: Authenticate as Gateways-authorized user, confirm Gateways menu entry is visible, navigate to `/gateways`, and verify Gateways initial page renders or fallback appears when Gateways remote is unavailable.

### Tests for User Story 2

- [x] T027 [P] [US2] Add shell component test coverage for Gateways menu visibility and authorization gating in src/app/layout/shell-menu.component.spec.ts
- [x] T028 [P] [US2] Add shell integration test for `/gateways` route loading and fallback path in src/app/app.routes.spec.ts
- [ ] T029 [P] [US2] Add e2e flow for menu-to-Gateways navigation in e2e/remotes-navigation.spec.ts
- [x] T030 [P] [US2] Add Gateways remote unit/component test for initial page rendering in ../mf-gateways/src/app/features/gateways/gateways-home-page.component.spec.ts
- [x] T031 [P] [US2] Add Gateways remote route exposure contract test for `./routes` and `remoteRoutes` in ../mf-gateways/src/federation/exposes.routes.spec.ts

### Implementation for User Story 2

- [x] T032 [US2] Add Gateways remote registry entry with route path and permissions in public/config/sidebar-menu.json
- [x] T033 [US2] Register shell top-level `/gateways` federated route in src/app/app.routes.ts
- [x] T034 [US2] Implement Gateways remote route exposure via `remoteRoutes` in ../mf-gateways/src/federation/exposes.routes.ts
- [x] T035 [US2] Implement Gateways initial landing page component in ../mf-gateways/src/app/features/gateways/gateways-home-page.component.ts
- [x] T036 [US2] Wire Gateways remote root route to landing component in ../mf-gateways/src/app/app.routes.ts
- [x] T037 [US2] Integrate Gateways load failure reason mapping to shell unavailable-module state in src/app/layout/shell-remote-loader.ts

**Checkpoint**: US2 is independently functional with parity to US1 behavior.

---

## Phase 5: User Story 3 - Navigate without confusion (Priority: P2)

**Goal**: Keep OCPI and Gateways clearly distinct in navigation and preserve clear active state while moving between remotes and existing routes.

**Independent Test**: With both remotes available, navigate across `/ocpi`, `/gateways`, and an existing route and verify labels, active state, and recovery messaging remain clear.

### Tests for User Story 3

- [x] T038 [P] [US3] Add shell menu component tests for distinct labels and active-state transitions in src/app/layout/shell-menu.component.spec.ts
- [x] T039 [P] [US3] Add shell integration test for cross-remote navigation state continuity in src/app/app.routes.spec.ts
- [x] T040 [P] [US3] Add e2e scenario covering OCPI-to-Gateways-to-existing-route navigation in e2e/remotes-navigation.spec.ts

### Implementation for User Story 3

- [x] T041 [US3] Add explicit menu metadata and ordering for OCPI and Gateways destinations in public/config/sidebar-menu.json
- [x] T042 [US3] Update shell menu projection logic to keep remote entries distinct and deterministic in src/app/layout/shell-menu-config.loader.ts
- [x] T043 [US3] Update shell active-route highlighting and aria-current behavior for remote routes in src/app/layout/shell-menu.component.ts
- [x] T044 [US3] Add accessibility and visual-state refinements for remote menu entries in src/app/layout/shell-menu.component.scss
- [x] T045 [US3] Ensure shell fallback copy includes destination-specific recovery messaging in src/app/layout/remote-unavailable.component.html

**Checkpoint**: All user stories are independently complete and navigation clarity goals are met.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening, validation, and documentation updates spanning all stories.

- [x] T046 [P] Update federation compatibility and release coordination notes in specs/011-add-ocpi-gateways-remotes/research.md
- [x] T047 [P] Update operational validation checklist and local runbook in specs/011-add-ocpi-gateways-remotes/quickstart.md
- [ ] T048 Run shell lint, unit, integration, and e2e validation commands in package.json
- [ ] T049 [P] Run OCPI remote lint, unit tests, and build verification in ../mf-ocpi/package.json
- [ ] T050 [P] Run Gateways remote lint, unit tests, and build verification in ../mf-gateways/package.json
- [ ] T051 Perform end-to-end acceptance pass for SC-001..SC-004 and capture evidence in specs/011-add-ocpi-gateways-remotes/tasks.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories.
- **User Story Phases (Phase 3-5)**: Depend on Foundational completion.
- **Polish (Phase 6)**: Depends on completion of selected user stories.

### User Story Dependencies

- **US1 (P1, OCPI)**: Starts after Phase 2; no dependency on US2 or US3.
- **US2 (P1, Gateways)**: Starts after Phase 2; no dependency on US1 or US3.
- **US3 (P2, Navigation clarity)**: Starts after Phase 2; depends only on baseline availability of both remote entries.

### Story Completion Order

1. Complete Phase 1 and Phase 2.
2. Implement US1 and US2 in parallel or sequentially (both P1).
3. Implement US3 after both remote entries exist.
4. Complete Phase 6 polish and acceptance evidence.

---

## Parallel Execution Examples

### User Story 1

- Run T016, T017, T018, T019, and T020 in parallel.
- Run T023 and T024 in parallel before T025.

### User Story 2

- Run T027, T028, T029, T030, and T031 in parallel.
- Run T034 and T035 in parallel before T036.

### User Story 3

- Run T038, T039, and T040 in parallel.
- Run T043 and T044 in parallel after T042.

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Setup and Foundational phases.
2. Deliver US1 (OCPI) with tests and fallback behavior.
3. Validate US1 independently and demo MVP.

### Incremental Delivery

1. Deliver US1 (OCPI).
2. Deliver US2 (Gateways) with equivalent quality gates.
3. Deliver US3 (navigation clarity and UX consistency).
4. Finalize with cross-cutting polish and acceptance evidence.

### Parallel Team Strategy

1. Team completes Phase 1 and Phase 2 together.
2. One developer leads US1 while another leads US2.
3. US3 proceeds once both remotes are integrated.
4. Polish phase consolidates quality checks and release readiness.

---

## Notes

- `[P]` tasks are designed for parallel execution across non-conflicting files.
- `[USx]` labels ensure traceability from tasks to user stories.
- Each user story includes explicit independent validation criteria.
- External remote repository paths (`../mf-ocpi`, `../mf-gateways`) are intentional and required by ADR-002 architecture.
