# Quickstart Guide: Auth & Onboarding Flow

## Environment Setup
- **Firebase**: Ensure you have a service account JSON for `api-server` (Backend) and a Firebase Client Config for `raumlog` (Frontend).
- **GCP**: Verify you can run `gcloud info` and `gcloud config set project raumlog`.
- **Database**: Run the migration to add the `users`, `kyc_documents` tables and the `owner_id` column to `spaces`.

## Local Development Flow
1.  **Auth Simulation**: Use the Firebase Emulator for early testing of registration/sign-in flows.
2.  **GCS Emulation**: Use `gcloud storage` or a mock service to handle document uploads locally.
3.  **User State Manipulation**: You can manually toggle `isOnboardingComplete` in the DB for testing various redirection logic.

## Key Routes to Test
- `GET /api/auth/verify-token` -> Should succeed if a valid Firebase token is provided.
- `POST /api/users/onboarding/step1` -> Should fail if terms are not accepted.
- `GET /api/spaces/my-listings` -> Should return empty for a fresh Host until they create a space.
