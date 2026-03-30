# Data Model Extension: Admin Dashboard

## Entities

### User (Extended)
- **Role**: `AccountTypeSchema` ('Anfitrión', 'Cliente', 'admin').
- **Status**: `isUserVerified` (boolean) updated via admin verify button.
- **Documents**: GCS paths stored in onboarding steps (e.g. `cedulaFilePath`, `rutFilePath`).

### Space (Existing)
- **Visibility**: `isVisible` (boolean) toggled by admin.
- **Publication**: `published` (boolean) reflects live status.
- **Status**: `status` enum ('pending', 'approved', 'rejected') used for workflows.

## Relationships
- **User → Space**: One-to-Many relationship based on `ownerId` (UID).
- **Space → Reservation**: One-to-Many relationship based on `spaceId`.

## Validation Rules
- `verifyUser`: Can only toggle `isUserVerified` from `false` to `true` (or vice versa for revocation).
- `visibilityToggle`: Can only be set if `isUserVerified` is true and `published` is true.
- `deleteSpace`: Denied if `reservations` exist with status NOT IN ('completed', 'rejected').
