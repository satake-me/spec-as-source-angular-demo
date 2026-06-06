# Tasks: Independent Remotes Architecture

**Input**: Design documents from `/specs/011-independent-remotes/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Add tests for each behavior change that can be automated. This feature changes routing, remote loading, and deployment boundaries, so tests are expected.

**Organization**: Tasks are grouped by user story so each slice can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and federation baseline

- [X] T001 Add Angular Native Federation and es-module-shims dependencies in package.json and package-lock.json
- [X] T002 Create the host federation config in federation.config.js
- [X] T003 Create the runtime remote registry in public/federation.manifest.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core host wiring that MUST be complete before any user story work begins

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Update angular.json to use @angular-architects/native-federation builders, add es-module-shims as a polyfill, and define the serve-original target
- [X] T005 Update src/main.ts to initialize federation before bootstrap while preserving runtime config loading and error handling
- [X] T006 [P] Create typed federation contract models in src/app/core/federation/federation.models.ts
- [X] T007 [P] Add unit coverage for the federation manifest and remote contract shapes in src/app/core/federation/federation.models.spec.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Consume Independent Capabilities (Priority: P1) 🎯 MVP

**Goal**: Users can navigate from the host to `mf1` and `mf2` through stable host routes and render both remotes successfully.

**Independent Test**: Start the host plus both remotes, open `/mf1` and `/mf2`, and confirm each remote renders from the host shell.

### Tests for User Story 1 ⚠️

- [X] T008 [P] [US1] Add route coverage for mf1 and mf2 lazy loading in src/app/app.routes.spec.ts
- [X] T009 [P] [US1] Add Playwright coverage for host navigation to /mf1 and /mf2 in e2e/independent-remotes.spec.ts

### Implementation for User Story 1

- [X] T010 [P] [US1] Add mf1 and mf2 lazy routes with loadRemoteModule in src/app/app.routes.ts
- [X] T011 [P] [US1] Add mf1 and mf2 navigation entries in public/config/sidebar-menu.json

**Checkpoint**: User Story 1 should now be fully functional and testable independently

---

## Phase 4: User Story 2 - Evolve Features Independently (Priority: P2)

**Goal**: Changing one remote does not require route changes or a coordinated redeploy of unrelated remotes.

**Independent Test**: Change one remote's published content or version, keep the host route contract unchanged, and confirm the host still resolves the capability through the manifest.

### Tests for User Story 2 ⚠️

- [X] T012 [P] [US2] Add regression coverage proving remote URLs are driven by public/federation.manifest.json in src/app/app.routes.spec.ts
- [X] T013 [P] [US2] Add contract coverage for stable exposed module keys in src/app/core/federation/federation.models.spec.ts

### Implementation for User Story 2

- [X] T014 [US2] Update specs/011-independent-remotes/contracts/federation-manifest.contract.md with environment-specific ownership and versioning notes
- [X] T015 [US2] Update specs/011-independent-remotes/contracts/remote-component.contract.md to keep the exposed-module boundary explicit and stable

**Checkpoint**: User Story 1 AND User Story 2 should now both work independently

---

## Phase 5: User Story 3 - Maintain Isolated Ownership (Priority: P3)

**Goal**: Each capability can stay in its own repository and be deployed with minimal coupling to the host and sibling remotes.

**Independent Test**: Confirm that the host still consumes a published remote contract without importing remote source internals, and that the other remote remains usable when one remote is unavailable.

### Tests for User Story 3 ⚠️

- [X] T016 [P] [US3] Add e2e coverage for one remote being unavailable while the other still loads in e2e/independent-remotes.spec.ts
- [X] T017 [P] [US3] Add contract regression coverage that the host only relies on published remote contracts in src/app/core/federation/federation.models.spec.ts

### Implementation for User Story 3

- [X] T018 [US3] Update specs/011-independent-remotes/quickstart.md with separate repository startup, deployment, and validation steps
- [X] T019 [US3] Add remote isolation guidance to specs/011-independent-remotes/data-model.md so the published contract stays the only host dependency

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T020 [P] Add any remaining host-side accessibility or unavailable-remote coverage in e2e/independent-remotes.spec.ts
- [ ] T021 Run the validation steps from specs/011-independent-remotes/quickstart.md and update the quickstart if any command or port differs
- [X] T022 Audit src/app/ and public/ for any hardcoded remote source imports or federation URLs and remove them if found

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - no dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - validates the same manifest and contract surface as US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - validates isolation and resilience on top of the same host contract

### Within Each User Story

- Tests MUST be added at the lowest-cost layer that proves the change
- Typed contracts before route or bootstrap consumers when new shared shapes are introduced
- Route wiring before end-to-end validation for remote navigation
- Story complete before moving to the next priority

### Parallel Opportunities

- T006 and T007 can run in parallel because they touch different files
- T008 and T009 can run in parallel because they are separate test layers
- T010 and T011 can run in parallel because they touch different files
- T012 and T013 can run in parallel because they are separate test files
- T016 and T017 can run in parallel because they validate different isolation aspects

---

## Parallel Example: User Story 1

```bash
# Add route and e2e coverage together for the first capability slice
Task: "Add route coverage for mf1 and mf2 lazy loading in src/app/app.routes.spec.ts"
Task: "Add Playwright coverage for host navigation to /mf1 and /mf2 in e2e/independent-remotes.spec.ts"

# Implement the host route wiring and navigation entries together
Task: "Add mf1 and mf2 lazy routes with loadRemoteModule in src/app/app.routes.ts"
Task: "Add mf1 and mf2 navigation entries in public/config/sidebar-menu.json"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (critical - blocks all stories)
3. Complete Phase 3: User Story 1
4. STOP and VALIDATE: Test host navigation to `mf1` and `mf2` independently

### Incremental Delivery

1. Complete Setup + Foundational → federation baseline ready
2. Add User Story 1 → test independently → deploy/demo the host consuming both remotes
3. Add User Story 2 → test independently → confirm remote evolution remains manifest-driven
4. Add User Story 3 → test independently → confirm repository isolation is explicit and guarded
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 route and navigation integration
   - Developer B: User Story 2 contract/regression coverage
   - Developer C: User Story 3 isolation/resilience coverage
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to a specific user story for traceability
- Each user story should be independently completable and testable
- Verify the planned tests cover the changed behavior before implementing
- Keep the host consuming published remote contracts only; do not introduce direct source imports from `mf1` or `mf2`