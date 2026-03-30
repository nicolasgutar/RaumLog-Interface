# Feature Specification: Full Auth & Onboarding Flow

**Feature Branch**: `003-auth-onboarding-flow`  
**Created**: 2026-03-27  
**Status**: Draft  
**Input**: User description: "Implement full authentication and onboarding flow for RaumLog. The auth page allows a user to either sign in or register. Register should prompt for account type, email, password, and confirm password. Simplified with a 'Sign in with Google' button. Redirect to '/onboarding' if incomplete. Onboarding Step 1: Name, phone, T&C, Privacy Policy. Onboarding Step 2: KYC docs (Cédula, RUT/Recibo). Redirection post-onboarding based on account type. Dashboard for Anfitrión to manage spaces. Search/filter restrictions for unauthenticated users on marketplace."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Simplified Authentication (Priority: P1)

As a visitor, I want to sign in or register quickly using my Google account or traditional email/password so that I can start using the platform's advanced features.

**Why this priority**: Core entry point for all personalized features and trust-based transactions.

**Independent Test**: Can be fully tested by attempting to sign in with Google and verifying the user record is created in the database.

**Acceptance Scenarios**:

1. **Given** a visitor on the landing page, **When** they click "Sign in with Google", **Then** they are prompted by Firebase Google Auth and redirected back as a signed-in user.
2. **Given** a new user registering via email/password, **When** they provide account type, email, and matching passwords, **Then** a new user account is created and they are redirected to the onboarding flow.

---

### User Story 2 - Mandatory Onboarding & KYC (Priority: P1)

As a newly registered user, I need to complete my profile and provide identity verification documents so that the platform remains secure and compliant (especially for hosts).

**Why this priority**: Essential for trust and safety (KYC). Ensures all active users have basic contact info and verified identity.

**Independent Test**: Can be tested by creating a user with `isOnboardingComplete: false` and verifying they are always redirected to `/onboarding` until both steps are finished.

**Acceptance Scenarios**:

1. **Given** a user who hasn't completed onboarding, **When** they access any protected route, **Then** they are redirected to `/onboarding`.
2. **Given** Step 1 of onboarding, **When** user provides name, phone, and accepts T&C/Privacy Policy, **Then** they proceed to the KYC document upload step.
3. **Given** Step 2 of onboarding (KYC), **When** user uploads Cédula and RUT/Receipt, **Then** `isOnboardingComplete` is set to true and they are redirected to their designated start page.

---

### User Story 3 - Role-Based Redirection & Dashboards (Priority: P2)

As a registered user, I want to be sent to the most relevant page for my account type (Host or Client) so that I can immediately perform my primary tasks.

**Why this priority**: Optimizes user experience and ensures access control/privacy by separating concerns between hosts and clients.

**Independent Test**: Verify that a "Cliente" is redirected to the marketplace, while an "Anfitrión" is redirected to their space management dashboard.

**Acceptance Scenarios**:

1. **Given** a user with account type "Anfitrión", **When** they sign in or finish onboarding, **Then** they are redirected to `/perfil` (Host Dashboard).
2. **Given** a user with account type "Cliente", **When** they sign in or finish onboarding, **Then** they are redirected to `/encuentra-tu-espacio` (Marketplace).
3. **Given** a "Cliente", **When** they try to access `/perfil`, **Then** they are redirected away or shown an "Access Denied" message.

---

### User Story 4 - Host Space Management (Priority: P2)

As a Host (Anfitrión), I want to see my registered spaces and add new ones via a simple dashboard interface so that I can manage my inventory effectively.

**Why this priority**: Crucial for supply generation. Allows hosts to manage their own business within the platform.

**Independent Test**: Verify that the dashboard only shows spaces belonging to the currently logged-in user and that successful form submission creates a new space in the DB with uploaded images.

**Acceptance Scenarios**:

1. **Given** a host on their dashboard, **When** they click "Add Space", **Then** a modal appears with fields for space details and image upload.
2. **Given** the space creation form, **When** submitted, **Then** images are stored in a public bucket and the space record is linked to the host's UID.

---

### User Story 5 - Public Marketplace Restrictions (Priority: P3)

As a visitor (unsigned user), I should be able to see the first results of the marketplace but be restricted from deep search or filtering so that I am encouraged to register.

**Why this priority**: Incentivizes registration while preserving platform resources and preventing scraping.

**Independent Test**: Verify that search/filters are disabled and pagination beyond page 1 is blocked for guests.

**Acceptance Scenarios**:

1. **Given** an unsigned visitor on `/encuentra-tu-espacio`, **When** they try to apply a filter or search term, **Then** they are redirected to the login page.
2. **Given** an unsigned visitor, **When** they try to click "Page 2" of results, **Then** they are redirected to the login page.

---

### Edge Cases

- **Expired Sessions**: What happens when a user's Auth session expires while they are mid-onboarding?
- **Invalid File Formats**: How does the KYC step handle non-supported file formats or files exceeding the 5MB limit?
- **Duplicate Registration**: How does the system handle an attempt to register an email that already exists via Google Auth? The system will ask the user to manually link the accounts.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to Sign In/Register using Google (SSO) via Firebase.
- **FR-002**: Registration MUST support selecting account type: "Anfitrión" (Host) or "Cliente" (Client).
- **FR-003**: System MUST redirect users with `isOnboardingComplete: false` to the onboarding route.
- **FR-004**: Onboarding MUST collect Full Name, Phone Number, and explicit acceptance of Terms & Conditions and Privacy Policy.
- **FR-005**: KYC Step MUST require two document uploads: Cédula de Ciudadanía and RUT/Utility Bill.
- **FR-006**: KYC documents MUST be stored in a **Private** Cloud Storage bucket. Initial account linking between social and email methods requires manual user consent.
- **FR-007**: Host Dashboard MUST list only the spaces associated with the logged-in user. The initial dashboard implementation focuses exclusively on listing management (Create/List/Waitlist).
- **FR-008**: Host Dashboard MUST include a modal for creating new spaces with support for multiple image uploads.
- **FR-009**: Space images MUST be stored in a **Public** Cloud Storage bucket.
- **FR-010**: Marketplace MUST restrict search, filtering, and deep pagination (beyond page 1) for unsigned users.

### Key Entities *(include if feature involves data)*

- **User**: Represents the platform member. Attributes: `uid`, `email`, `accountType`, `displayName`, `phone`, `isOnboardingComplete`, `isEmailVerified`, `isUserVerified`, `isAdmin`.
- **KYC Document**: Represents identity verification files. Linked to a `User`. Status: "Pending", "Approved", "Rejected".
- **Space**: (Existing) Updated to include an `ownerId` (UID) relationship.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of hosts have verified contact details and identity documents before their spaces appear as "approved".
- **SC-002**: Users can complete the full onboarding (Step 1 & 2) in under 5 minutes on average.
- **SC-003**: Guests are unable to bypass search/filter restrictions without a valid authentication token.
- **SC-004**: Host dashboard loads only the relevant user dataset in under 1 second.

## Assumptions

- **Firebase Setup**: Firebase project is configured for Google Auth and Email/Password.
- **GCP Environment**: Google Cloud Storage buckets (Public and Private) are accessible via the provided ADC (Application Default Credentials).
- **Security**: The backend will enforce UID-based ownership checks for space management and image uploads.
- **Verification Notice**: The "verification email notice" in onboarding assumes an asynchronous email service is or will be configured.
