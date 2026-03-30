# Research Artifact: Auth & Onboarding Flow

## Decisions

### 1. Firebase Auth Integration
- **Decision**: Use `firebase-admin` on the backend to verify ID tokens in a custom Middleware.
- **Rationale**: Provides secure, server-side validation of user identity. Decouples the frontend's social/email auth from the backend's data operations.
- **Alternatives considered**: Directly trusting frontend UID (Insecure); Using secondary JWTs (Redundant as Firebase tokens are JWTs).

### 2. Account Linking Logic
- **Decision**: Implement a manual linking flow using Firebase's `linkWithCredential` and `fetchSignInMethodsForEmail`.
- **Rationale**: User explicitly selected Option C in the clarification stage to prevent unauthorized account mergers and maintain high security.
- **Alternatives considered**: Automatic merging (rejected for security concerns).

### 3. GCS Infrastructure
- **Decision**: Use two distinct buckets. One public (`raumlog-spaces-public`) for space images via signed URLs or public access, and one private (`raumlog-kyc-private`) for KYC documents accessed solely via Signed URLs for Admins.
- **Rationale**: Ensures PII (Personally Identifiable Information) is never exposed to the public internet while keeping marketplace images highly available.
- **GCloud Config**: `gcloud config set project raumlog`.

### 4. Search Restrictions
- **Decision**: Implement a `GuestGuard` middleware/component on the frontend that intercepts search/filter/pagination state changes.
- **Rationale**: User opted for Option A (Auth Redirect). Simplest to implement and highest incentive for registration.
