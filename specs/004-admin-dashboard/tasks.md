# Tasks: Admin Dashboard

**Input**: Design documents from `/specs/004-admin-dashboard/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: API and routing initialization.

- [X] T001 [P] Register admin routes entry point in `artifacts/api-server/src/routes/index.ts`
- [X] T002 [P] Create `adminRoutes.ts` with basic health check in `artifacts/api-server/src/routes/adminRoutes.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core RBAC and repository extensions.

- [X] T003 Create `FirebaseAdminMiddleware.ts` to protect `/api/admin/*` routes in `artifacts/api-server/src/infrastructure/auth/`
- [X] T004 Extend `DrizzleUserRepository.ts` with `findAllPaginated` including search and sorting in `artifacts/api-server/src/infrastructure/repositories/`
- [X] T005 Extend `DrizzleSpaceRepository.ts` with `findAllAdminPaginated` in `artifacts/api-server/src/infrastructure/repositories/`
- [ ] T006 [P] Create `AdminLayout.tsx` with sidebar navigation in `artifacts/raumlog/src/components/Admin/`

---

## Phase 3: User Story 1 - Verify a New Host (Priority: P1) 🎯 MVP

**Goal**: Admins can view user profile details and KYC documents to verify them.

**Independent Test**: Log in as Admin, navigate to `/admin/users`, see list of users, click one, see their docs (PDF/Image) in preview, click "Verify", and see status change to "Verified".

### Implementation for User Story 1

- [X] T007 [US1] Implement `AdminUserController.ts` with `getUsers` and `verifyUser` in `artifacts/api-server/src/api/controllers/`
- [X] T008 [US1] Connect `AdminUserController` to routes in `artifacts/api-server/src/routes/adminRoutes.ts`
- [ ] T009 [US1] Create `AdminUsersPage.tsx` using the AdminLayout in `artifacts/raumlog/src/pages/Admin/`
- [ ] T010 [P] [US1] Implement `UserSidebarList.tsx` for paginated browsing in `artifacts/raumlog/src/components/Admin/`
- [ ] T011 [P] [US1] Create `KycPreviewPane.tsx` with `<iframe>` and `<img>` support in `artifacts/raumlog/src/components/Admin/`
- [ ] T012 [US1] Implement user verification button logic in `AdminUsersPage.tsx`

---

## Phase 4: User Story 2 - Manage Space Visibility (Priority: P1)

**Goal**: Admins can browse all spaces, toggle their visibility, or delete them (if no active bookings).

**Independent Test**: Navigate to `/admin/spaces`, see list of spaces, toggle visibility switch, verify space disappears/reappears in marketplace. Attempt to delete a space with an active booking and see the warning.

### Implementation for User Story 2

- [X] T013 [US2] Implement `AdminSpaceController.ts` with `getSpaces`, `toggleVisibility`, and `deleteSpace` in `artifacts/api-server/src/api/controllers/`
- [X] T014 [US2] Add reservation check logic to `deleteSpace` in `AdminSpaceController.ts` using statuses NOT IN ('completed', 'rejected')
- [X] T015 [US2] Connect `AdminSpaceController` to routes in `artifacts/api-server/src/routes/adminRoutes.ts`
- [ ] T016 [US2] Implement `AdminSpacesPage.tsx` with space list and detail view in `artifacts/raumlog/src/pages/Admin/`
- [ ] T017 [P] [US2] Implement `SpaceSidebarList.tsx` for paginated browsing in `artifacts/raumlog/src/components/Admin/`
- [ ] T018 [US2] Implement visibility toggle and delete button with confirmation/warning dialogs in `AdminSpacesPage.tsx`

---

## Phase 5: User Story 3 - Filter Spaces by Host (Priority: P2)

**Goal**: Admin can filter the entire space list to show only those belonging to a specific host.

**Independent Test**: In `/admin/spaces`, enter a Host UID or select a host from a filter, verify only their spaces are shown.

### Implementation for User Story 3

- [ ] T019 [P] [US3] Add `ownerId` filtering support to `AdminSpaceListQuerySchema` in `lib/api-zod/src/admin.ts`
- [ ] T020 [US3] Update `getSpaces` query in `AdminSpaceController.ts` to apply the `ownerId` filter
- [ ] T021 [US3] Add "Filter by Host" input or dropdown in `SpaceSidebarList.tsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Security hardening and navigation consistency.

- [ ] T022 [P] Implement unauthorized redirect (403 fallback) in `AdminLayout.tsx` for non-admin users
- [ ] T023 [P] Add breadcrumbs and active state highlighting to `AdminSidebar.tsx`
- [ ] T024 Perform final audit of RBAC protection on all new API endpoints

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: Base for all routes.
- **Foundational (Phase 2)**: Middleware and Repository extensions are required for both User and Space management.
- **User Story 1 (Phase 3)**: MVP - High priority.
- **User Story 2 (Phase 4)**: Secondary administration - P1.
- **User Story 3 (Phase 5)**: Enhancement - P2.

### Parallel Opportunities
- T001, T002 (Setup)
- T010, T011 (User UI components)
- T017 (Space UI component)
- Backend controllers for US1 and US2 (T007, T013) can be developed in parallel if schemas are agreed.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Setup + Foundational.
2. Complete US1 (Verify Host).
3. **STOP and VALIDATE**: Verify a host manually and check their ability to list spaces.

### Incremental Delivery
1. Foundation -> Admin RBAC fixed.
2. US1 -> Onboarding verification enabled.
3. US2 -> Listing management enabled.
4. US3 -> Operational efficiency improvements.
