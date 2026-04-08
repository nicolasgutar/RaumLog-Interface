# Feature Specification: Admin Dashboard

**Feature Branch**: `004-admin-dashboard`
**Created**: 2026-03-30
**Status**: Draft
**Input**: User description: "I want admin users to be able to use an admin dashboard at route /admin. Dashboard should have users and spaces management. Users: paginated list, search, sort, detail view with image/pdf preview for onboarding documents, verify user capability. Spaces: paginated list, detail view, toggle visibility, delete, filter by user. RBAC protection for all admin routes."

## User Scenarios & Testing

### Scenario 1: Verify a New Host
- **Precondition**: User has completed the second onboarding step (uploaded KYC documents) but is not yet verified.
- **Action**: Admin logs in, navigates to `/admin`, selects the "Users" sidebar option, and finds the user.
- **Expected Outcome**: Admin can see the user's KYC documents in a preview pane. Admin clicks "Verify User", and the user's status is updated. The user can now publish their spaces.

### Scenario 2: Manage Space Visibility
- **Precondition**: A space is currently visible in the marketplace but needs to be temporarily hidden.
- **Action**: Admin logs in, navigates to `/admin`, selects the "Spaces" sidebar option, and finds the space.
- **Expected Outcome**: Admin can toggle the "Visible" switch. The space is immediately hidden from users in the `/encuentra-tu-espacio` marketplace.

### Scenario 3: Filter Spaces by Host
- **Precondition**: Multiple hosts have created spaces.
- **Action**: Admin applies a "User" filter in the spaces management dashboard.
- **Expected Outcome**: The list shows only the spaces belonging to that specific user.

## Functional Requirements

- **Admin Access Only (RBAC)** (Priority: P1)
  - **Description**: The `/admin` route and all associated API endpoints must be restricted to users with the `role` of "Admin".
  - **Acceptance Criteria**: Unauthorized users are redirected to the home page or shown a 403 Forbidden message. API calls from non-admin accounts return a 403 status.

- **Admin Sidebar Navigation** (Priority: P1)
  - **Description**: A persistent sidebar for navigation between different administrative sections.
  - **Acceptance Criteria**: Sidebar contains links for "Users" and "Spaces". The current active section is highlighted.

- **User Management: Pagination & List** (Priority: P1)
  - **Description**: A paginated list of all registered users shown in a left-aligned master column.
  - **Acceptance Criteria**: List shows 10-20 users per page. Admins can navigate between pages.

- **User Management: Search & Sort** (Priority: P2)
  - **Description**: Tools to filter the user list by name and sort them alphabetically.
  - **Acceptance Criteria**: Real-time or submit-based search by user name. Sorting toggle (Ascending/Descending) works correctly.

- **User Management: Details & Verification** (Priority: P1)
  - **Description**: Selection of a user opens a detailed view in the main/right column.
  - **Acceptance Criteria**: Details include profile info and an embedded preview of uploaded files (PDF/Images) from onboarding step 2. A "Verify User" button updates the user's verification status.

- **Space Management: Pagination & List** (Priority: P1)
  - **Description**: A paginated list of all created spaces in a left-aligned master column.
  - **Acceptance Criteria**: Admins can browse all spaces across the entire platform.

- **Space Management: Search & Filtering** (Priority: P2)
  - **Description**: Admins can filter spaces by the owner/host UID or email.
  - **Acceptance Criteria**: Filter reduces the list to only spaces belonging to the specified user.

- **Space Management: Details & Controls** (Priority: P1)
  - **Description**: Detailed view of space including a "Visibility" toggle and a "Delete" action.
  - **Acceptance Criteria**: Toggling visibility updates the `isVisible` field and reflects immediately. Deleting a space removes it from the list after confirmation. **Strict Restriction**: Admins cannot delete a space if it has active or future bookings; a warning is displayed instead.

## Success Criteria

- **SC-001**: Admins can find and verify a new user's KYC documents within 20 seconds.
- **SC-002**: Verification status updates are reflected in the database and user profile within 1 second of action.
- **SC-003**: Paginated lists (Users/Spaces) load within 800ms for up to 50,000 records.
- **SC-004**: Non-admin users are strictly blocked from accessing any `/admin` path or backend endpoint.

## Key Entities

- **Admin User**: A user entity with administrative permissions.
- **KYC Document Reference**: Metadata linking to user-provided verification files stored in secure storage.
- **User Activity Log**: (Optional) Tracking actions taken by admins for auditing.

## Assumptions

- **A1**: Administrative users have already been designated in the database (via manual flag or role assignment).
- **A2**: Users' KYC documents follow a consistent naming/path convention in GCS to facilitate previews.
- **A3**: The dashboard is designed for internal desktop use (mobile responsiveness is P3).

## Non-Functional Requirements

- **Security**: All admin actions must be authenticated via Firebase and validated on the backend.
- **Auditability**: Critical actions (verification, deletion) should ideally be logged.
- **Performance**: Dashboard must remain responsive even during large data retrieval operations.
