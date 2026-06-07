# Tasks: Add OCPI MFE Remote

**Input**: Design documents from `/specs/013-add-ocpi-mfe-remote/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare test surfaces and route/menu integration baseline for OCPI remote work.

- [x] T001 Add OCPI route placeholder assertions in src/app/app.routes.spec.ts
- [x] T002 [P] Create OCPI end-to-end spec scaffold in e2e/ocpi-remote.spec.ts
- [x] T003 [P] Add OCPI menu item fixture placeholder in public/config/sidebar-menu.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish host federation registration and base route wiring required by all user stories.

**⚠️ CRITICAL**: No user story implementation starts before this phase is complete.

- [x] T004 Register `ocpi-mfe` in public/federation.manifest.json
- [x] T005 [P] Register `ocpi-mfe` in public/config/federation.manifest.development.json
- [x] T006 [P] Register `ocpi-mfe` in public/config/federation.manifest.staging.json
- [x] T007 [P] Register `ocpi-mfe` in public/config/federation.manifest.production.json
- [x] T008 Add lazy-loaded `/ocpi` remote route using `loadRemoteComponent('ocpi-mfe', 'OcpiMfeComponent')` in src/app/app.routes.ts
- [x] T009 Extend route-level remote contract tests for `ocpi-mfe` resolution and fallback behavior in src/app/app.routes.spec.ts

**Checkpoint**: Federation manifest + base OCPI route are ready.

---

## Phase 3: User Story 1 - Access OCPI Modules From Host Navigation (Priority: P1) 🎯 MVP

**Goal**: Users can open OCPI module from host navigation and render remote content in shell.

**Independent Test**: Navigate through the OCPI sidebar entry and confirm `/ocpi` renders remote content in the host shell.

### Tests for User Story 1

- [x] T010 [P] [US1] Add route metadata and shell child-route assertions for `/ocpi` in src/app/app.routes.spec.ts
- [x] T011 [P] [US1] Add e2e happy-path navigation test for OCPI route render in e2e/ocpi-remote.spec.ts

### Implementation for User Story 1

- [x] T012 [US1] Add top-level OCPI menu entry pointing to `/ocpi` in public/config/sidebar-menu.json
- [x] T013 [US1] Ensure route title/icon metadata for OCPI entry in src/app/app.routes.ts
- [x] T014 [US1] Validate OCPI menu visibility/auth flags follow existing mf1/mf2 navigation pattern in public/config/sidebar-menu.json

**Checkpoint**: User Story 1 is independently functional.

---

## Phase 4: User Story 2 - Configure Development Remote Endpoint (Priority: P2)

**Goal**: Developers can use `http://localhost:4203/remoteEntry.json` for local OCPI integration with graceful failure handling.

**Independent Test**: Start host + ocpi-mfe and verify route load; stop ocpi-mfe and verify fallback page appears without shell crash.

### Tests for User Story 2

- [x] T015 [P] [US2] Add e2e fallback test that aborts OCPI `remoteEntry.json` and verifies recoverable UI in e2e/ocpi-remote.spec.ts
- [x] T016 [P] [US2] Extend hardcoded-URL regression assertion to include `http://localhost:4203` exclusion in src/app/app.routes.spec.ts

### Implementation for User Story 2

- [x] T017 [US2] Set development OCPI remote entry to `http://localhost:4203/remoteEntry.json` in public/federation.manifest.json
- [x] T018 [US2] Ensure development config mirror for OCPI remote in public/config/federation.manifest.development.json
- [x] T019 [US2] Keep staging/production OCPI manifest entries environment-specific in public/config/federation.manifest.staging.json and public/config/federation.manifest.production.json

**Checkpoint**: User Story 2 is independently functional.

---

## Phase 5: User Story 3 - Preserve Independent Delivery Boundaries (Priority: P3)

**Goal**: Host integrates OCPI only by manifest/remote contract, preserving independent evolution.

**Independent Test**: Update ocpi-mfe independently and verify host consumes remote without direct source imports or host code coupling.

### Tests for User Story 3

- [x] T020 [P] [US3] Add contract-level test for `loadRemoteModule('ocpi-mfe', './Component')` and expected export mapping in src/app/app.routes.spec.ts
- [x] T021 [P] [US3] Add resilience test proving other remotes remain usable when OCPI is unavailable in e2e/independent-remotes.spec.ts

### Implementation for User Story 3

- [x] T022 [US3] Document OCPI host-consumption contract and no-source-import boundary in specs/013-add-ocpi-mfe-remote/contracts/ocpi-remote-component.contract.md
- [x] T023 [US3] Update independent run/recovery workflow for OCPI remote in specs/013-add-ocpi-mfe-remote/quickstart.md

**Checkpoint**: User Story 3 is independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, docs, and verification across all stories.

- [x] T024 [P] Align federation manifest contract examples with final OCPI key across docs in specs/013-add-ocpi-mfe-remote/contracts/federation-manifest.contract.md
- [x] T025 Run full targeted validation (`app.routes.spec.ts`, OCPI e2e, independent remotes e2e) and record command set in specs/013-add-ocpi-mfe-remote/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): starts immediately.
- Foundational (Phase 2): depends on Setup completion and blocks all user stories.
- User Stories (Phases 3-5): depend on Foundational completion.
- Polish (Phase 6): depends on desired user stories completed.

### User Story Dependencies

- US1 (P1): starts after Phase 2; MVP slice.
- US2 (P2): starts after Phase 2 and uses US1 route/menu surfaces.
- US3 (P3): starts after Phase 2 and verifies long-term contract stability.

### Within Each User Story

- Tests first, then implementation.
- Route/menu contract updates before e2e assertions that consume them.
- Complete each story before broad polish.

## Parallel Opportunities

- Phase 2 manifest file updates T005-T007 can run in parallel.
- US1 test tasks T010-T011 can run in parallel.
- US2 test tasks T015-T016 can run in parallel.
- US3 test tasks T020-T021 can run in parallel.
- Documentation polish T024 can run in parallel with T025 validation prep.

## Parallel Example: User Story 1

```bash
# Run in parallel after foundational completion:
T010 [US1] src/app/app.routes.spec.ts updates
T011 [US1] e2e/ocpi-remote.spec.ts happy-path test

# Then complete implementation sequence:
T012 -> T013 -> T014
```

## Parallel Example: User Story 2

```bash
# Manifest updates in parallel:
T018 public/config/federation.manifest.development.json
T019 public/config/federation.manifest.staging.json + public/config/federation.manifest.production.json

# Fallback validation in parallel with route spec hardening:
T015 e2e/ocpi-remote.spec.ts
T016 src/app/app.routes.spec.ts
```

## Implementation Strategy

### MVP First (US1)

1. Complete Phases 1-2.
2. Deliver Phase 3 (US1) and validate `/ocpi` route render via menu.
3. Demo MVP with host shell + OCPI remote integration.

### Incremental Delivery

1. Add US1 for core user value.
2. Add US2 for development endpoint reliability and fallback behavior.
3. Add US3 for independent delivery guarantees and contract hardening.
4. Finish with Phase 6 polish and final validation.

### Team Parallel Strategy

1. One developer handles route/menu contract tasks (T008-T014).
2. One developer handles manifest/environment registration tasks (T004-T007, T017-T019).
3. One developer handles test automation hardening (T010-T011, T015-T016, T020-T021).
4. Merge into shared polish and quickstart validation tasks.
