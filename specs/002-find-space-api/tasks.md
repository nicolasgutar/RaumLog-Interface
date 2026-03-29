# Tasks: Find Space API Integration

**Input**: Design documents from `/specs/002-find-space-api/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are NOT requested in the spec, so we focus on implementation and manual verification via `quickstart.md`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Shared Libs**: `lib/db/`, `lib/api-zod/`
- **Backend**: `artifacts/api-server/`
- **Frontend**: `artifacts/raumlog/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure updates

- [X] T001 Update `lib/db/src/schema/spaces.ts` to include `category`, `accessType`, and `images` fields per `data-model.md`
- [X] T002 [P] Create/Update Zod validation schemas in `lib/api-zod/src/spaces.ts` to match the new Space entity
- [X] T003 [P] Configure export for new schemas in `lib/db/src/index.ts` and `lib/api-zod/src/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T004 Create `SpaceRepository` interface in `artifacts/api-server/src/domain/repositories/SpaceRepository.ts`
- [X] T005 Create `DrizzleSpaceRepository` implementation in `artifacts/api-server/src/infrastructure/repositories/DrizzleSpaceRepository.ts`
- [X] T006 [P] Setup API routing and middleware in `artifacts/api-server/src/api/routes/spaces.ts`
- [X] T007 [P] Create base database seed script in `lib/db/scripts/seed-spaces.ts` to populate realistic data from `quickstart.md`
- [X] T008 Configure main app entry point in `artifacts/api-server/src/index.ts` to include the new spaces route

**Checkpoint**: Foundation ready - User stories can now be implemented following Clean Architecture.

---

## Phase 3: User Story 1 - Real-time Marketplace Listings (Priority: P1) 🎯 MVP

**Goal**: Fetch approved/published spaces from the database and display them in the frontend.

**Independent Test**: Verify that spaces seeded in the DB appear on the "Find Space" page without hardcoded components.

### Implementation for User Story 1

- [X] T009 [US1] Implement `findAllPublished` method in `SpaceRepository` and `DrizzleSpaceRepository`
- [X] T010 [US1] Create `SpaceService` (Application layer) in `artifacts/api-server/src/application/services/SpaceService.ts` to handle business logic
- [X] T011 [US1] Implement `GET /api/spaces` controller in `artifacts/api-server/src/api/controllers/SpaceController.ts`
- [X] T012 [US1] Create `useSpaces` data-fetching hook in `artifacts/raumlog/src/hooks/useSpaces.ts`
- [X] T013 [US1] Refactor `FindSpace.tsx` in `artifacts/raumlog/src/pages/` to fetch data from the API using the new hook

**Checkpoint**: At this point, User Story 1 is fully functional and replaces hardcoded data.

---

## Phase 4: User Story 2 - Scaleable Result Navigation (Priority: P2)

**Goal**: Implement server-side pagination (limit/offset) and return metadata wrapper.

**Independent Test**: Verify that the API returns `totalCount` and `totalPages`, and the frontend reveals more items when navigating.

### Implementation for User Story 2

- [X] T014 [US2] Update `findAllPublished` in Repository and Service to support `limit` and `offset` parameters
- [X] T015 [US2] Update `SpaceController` response to follow the contract: `{ data: Space[], meta: { totalCount, totalPages } }`
- [X] T016 [US2] Create standalone `Pagination` component in `artifacts/raumlog/src/components/Listing/Pagination.tsx`
- [ ] T017 [US2] Integrate `Pagination` into `FindSpace.tsx` and update `useSpaces` hook to handle page changes

**Checkpoint**: At this point, the marketplace supports large listing volumes via pagination.

---

## Phase 5: User Story 3 - Categorical Filtering (Priority: P3)

**Goal**: Filter space listings by category via API query parameters.

**Independent Test**: Verify that selecting a category filter (e.g., Vehicles) correctly triggers an API call with the filter and updates the list.

### Implementation for User Story 3

- [X] T018 [US3] Add `category` filter support to `findAllPublished` in both Repository and Service layers
- [X] T019 [US3] Update API Controller to parse and pass the `category` query parameter
- [X] T020 [US3] Create `FilterSidebar` component in `artifacts/raumlog/src/components/Listing/FilterSidebar.tsx`
- [X] T021 [US3] Integrate `FilterSidebar` into `FindSpace.tsx` and sync it with the `useSpaces` hook state

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Modularization, error handling, and final validation

- [X] T022 [P] Refactor `SpaceCard` into a dedicated component in `artifacts/raumlog/src/components/Listing/SpaceCard.tsx` (SOLID: Single Responsibility)
- [X] T023 Implement "No Results" and "Error Status" UI in `FindSpace.tsx` using defined edge cases
- [X] T024 [P] Run and verify `quickstart.md` full validation cycle
- [X] T025 Final code cleanup for Clean Architecture compliance (PR Review ready)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - Start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 - BLOCKS all User Stories.
- **User Stories (Phase 3+)**: All depend on Phase 2.
  - US1 (P1) is the primary MVP focus.
  - US2 and US3 can proceed independently after US1's core data-fetching is established.
- **Polish (Phase 6)**: Final touch after all stories are stable.

### Parallel Opportunities

- T002 and T003 can be done in parallel with T001.
- T006 and T007 can be done in parallel (Infrastructure vs Seeding).
- T022 (UI Refactor) can be done in parallel with T018-T021 (Filter backend).

---

## Parallel Example: User Story 1

```bash
# Launch shared library updates together:
Task: "Update lib/db/src/schema/spaces.ts with new fields"
Task: "Create/Update Zod schemas in lib/api-zod/src/spaces.ts"

# Launch Backend logic and Seed script together:
Task: "Implement findAllPublished in DrizzleSpaceRepository.ts"
Task: "Create database seed script in lib/db/scripts/seed-spaces.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2 (Database & Repository Foundation).
2. Complete Phase 3 (US1: Core Data Fetching).
3. **STOP and VALIDATE**: Test that the page renders dynamic data correctly.

### Incremental Delivery

1. Foundation → Marketplace displays real data.
2. Pagination → Marketplace scales to many items.
3. Filtering → Marketplace provides user control.
4. Polish → Componentization and error resilience.
