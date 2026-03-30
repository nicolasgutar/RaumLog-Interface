# Implementation Plan: Admin Dashboard

**Feature**: Admin Dashboard (004-admin-dashboard)
**Created**: 2026-03-30
**Status**: Draft
**Spec**: [spec.md](./spec.md)

## Technical Context

### Existing Systems
- **Backend API**: Node.js/Express in `artifacts/api-server`.
- **Frontend**: React/Vite in `artifacts/raumlog`.
- **Database**: PostgreSQL with Drizzle ORM in `lib/db`.
- **Auth**: Firebase Authentication with custom `role` in DB.
- **Storage**: GCS for KYC documents.
- **Schemas**: Zod-based validation in `lib/api-zod`.

### Architecture
- **Admin RBAC**: Middleware to check `user.role === 'Admin'`.
- **UI Pattern**: Master-Detail view for both Users and Spaces. Sidebar for navigation.
- **API Pattern**: Paginated endpoints (`GET /api/admin/users`, `GET /api/admin/spaces`).

### Constraints
- **Security**: Strict server-side validation of the admin role.
- **Performance**: Pagination is mandatory for both lists.
- **Policy**: No space deletion if active/future reservations exist.

## Constitution Check (v1.1.0)

- **Principle I: Unified Source of Truth**: All new Admin API request/response schemas MUST be added to `lib/api-zod`.
- **Principle VI: Clean Architecture**: New Admin functionality MUST follow the `Controller -> Service -> Repository` pattern.
- **Principle III: Regional & Legal Compliance**: User data viewing must adhere to LOPD/Habeas Data (internal admin use only).

## Gates

- [x] All admin endpoints are protected by `role === 'Admin'`.
- [ ] 100% test coverage NOT required unless it affects financial logic (Principle II).

## Phase 0: Outline & Research

### Unknowns & Research Tasks
1. **R-001**: Research best practice for PDF/Image preview in a React Master-Detail view.
2. **R-002**: Determine the query logic needed to detect active/future reservations for a space.

### Findings (research.md)
*To be populated during Phase 0.*

## Phase 1: Design & Contracts

### Data Model updates (data-model.md)
*To be populated during Phase 1.*

### API Contracts
- `GET /api/admin/users`: Paginated list with search and sort.
- `GET /api/admin/spaces`: Paginated list with user filtering.
- `PATCH /api/admin/users/:uid/verify`: Toggle verification.
- `PATCH /api/admin/spaces/:id/visibility`: Toggle visibility.
- `DELETE /api/admin/spaces/:id`: Strict deletion.

## Phase 2: Implementation Sequence

### 2.1 Core Infrastructure (RBAC & Repositories)
1. **Admin Middleware**: Create `FirebaseAdminMiddleware.ts` to verify `user.role === 'admin'`.
2. **UserRepository Extension**: Add `findAllPaginated` method with support for search and alphabetical sorting.
3. **SpaceRepository Extension**: Add `findAllAdminPaginated` method allowing global visibility and filtering.

### 2.2 Backend API (User Management)
1. **AdminUserController**: Implement `getUsers` and `verifyUser`.
2. **AdminRoutes**: Register `/admin/users` and `/admin/users/:uid/verify`.

### 2.3 Backend API (Space Management)
1. **AdminSpaceController**: Implement `getSpaces`, `toggleVisibility`, and `deleteSpace` (incorporating deletion restriction logic).
2. **AdminRoutes**: Register `/admin/spaces` endpoints.

### 2.4 Frontend Foundation (Dashboard)
1. **Admin Layout**: Split-screen sidebar and detail panel at `/admin`.
2. **Sidebar Navigation**: Routing between `/admin/users` and `/admin/spaces`.

### 2.5 User Management UI
1. **User List**: Sidebar component fetching paginated users with search/sort.
2. **User Details**: Detail view showing profile information.
3. **Document Preview**: `<iframe>` viewer for PDF/Image KYC documents.
4. **Verification Action**: Verification toggle button.

### 2.6 Space Management UI
1. **Space List**: Sidebar component fetching paginated spaces with user-based filtering.
2. **Space Details**: Detail view with visibility toggle and delete action.
3. **Guardrails**: Implement UI feedback if deletion is restricted by active bookings.
