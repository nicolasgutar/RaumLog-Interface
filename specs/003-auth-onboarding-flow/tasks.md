# Tasks: Full Auth & Onboarding Flow

**Input**: Design documents from `/specs/003-auth-onboarding-flow/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/api.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic environment setup

- [ ] T001 Configure gcloud project id to "raumlog" using `gcloud config set project raumlog`
- [ ] T002 Create GCS buckets `raumlog-spaces-public` (Public Access) and `raumlog-kyc-private` (Private Access) via gcloud CLI
- [ ] T003 [P] Initialize Firebase Admin SDK in `artifacts/api-server/src/index.ts`
- [ ] T004 [P] Initialize Firebase Client SDK in `artifacts/raumlog/src/services/firebase.ts`
- [ ] T005 [P] Setup `.env` variables for Firebase and GCS in both `artifacts/raumlog` and `artifacts/api-server`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story implementation

- [ ] T006 Create Drizzle migration to add `users` and `kyc_documents` tables and add `owner_id` to `spaces` in `lib/db/schema.ts`
- [ ] T007 [P] Create `FirebaseMiddleware` for ID Token verification in `artifacts/api-server/src/infrastructure/auth/FirebaseMiddleware.ts`
- [ ] T008 [P] Define Zod schemas for `UserResponse` and `OnboardingRequest` in `lib/api-zod/src/user.ts`
- [ ] T009 [P] Create `authStore` using Zustand to manage global user state in `artifacts/raumlog/src/store/authStore.ts`
- [ ] T010 Setup main API routing structure for auth, users, and kyc in `artifacts/api-server/src/routes/`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Simplified Authentication (Priority: P1) 🎯 MVP

**Goal**: Allow users to register/login via Google or Email/Password and start their session.

**Independent Test**: Successfully authenticate via Google and see the user object logged in the console, then be redirected to `/onboarding`.

### Implementation for User Story 1

- [ ] T011 [P] [US1] Implement `AuthService` to handle Firebase signal-to-user-record mapping in `artifacts/api-server/src/application/services/AuthService.ts`
- [ ] T012 [US1] Implement `verify-token` endpoint in `artifacts/api-server/src/api/controllers/AuthController.ts`
- [ ] T013 [P] [US1] Create `useAuth` hook in `artifacts/raumlog/src/hooks/useAuth.ts`
- [ ] T014 [US1] Create `AuthPage` and `AuthForm` layout with Account Type selection and Google button in `artifacts/raumlog/src/pages/AuthPage.tsx`
- [ ] T015 [US1] Implement Email/Password registration with role persistence.

**Checkpoint**: User can create an account and is logged in.

---

## Phase 4: User Story 2 - Mandatory Onboarding & KYC (Priority: P1)

**Goal**: Collect user contact info and identity documents before allowing full access.

**Independent Test**: Complete Step 1 and Step 2 and verify `isOnboardingComplete` becomes `true` in the database.

### Implementation for User Story 2

- [ ] T016 [P] [US2] Implement `OnboardingPage` layout with Step 1 (Contact) and Step 2 (KYC) in `artifacts/raumlog/src/pages/OnboardingPage.tsx`
- [ ] T017 [US2] Create GCS Storage Service for file handling in `artifacts/api-server/src/infrastructure/storage/GCSStorageService.ts`
- [ ] T018 [US2] Implement Step 1 endpoint (`/onboarding/step1`) in `artifacts/api-server/src/api/controllers/UserController.ts`
- [ ] T019 [US2] Implement KYC document upload endpoint with GCS integration in `artifacts/api-server/src/api/controllers/KycController.ts`
- [ ] T020 [US2] Create verification email notice UI in Onboarding Step 1.

**Checkpoint**: User can complete onboarding and upload verification documents.

---

## Phase 5: User Story 3 - Role-Based Redirection & Dashboards (Priority: P2)

**Goal**: Route users to their specific workspace (Anfitrión Profile vs Cliente Marketplace).

**Independent Test**: Login as Anfitrión and be sent to `/perfil`; Login as Cliente and be sent to `/encuentra-tu-espacio`.

### Implementation for User Story 3

- [ ] T021 [P] [US3] Create basic `ProfilePage` (Host Dashboard) shell in `artifacts/raumlog/src/pages/ProfilePage.tsx`
- [ ] T022 [US3] Implement redirection guard logic in `artifacts/raumlog/src/App.tsx` based on `isOnboardingComplete` and `accountType`.
- [ ] T023 [P] [US3] Implement `UserRepository.findById` in `artifacts/api-server/src/infrastructure/repositories/DrizzleUserRepository.ts`

**Checkpoint**: Users are correctly separated by role upon login.

---

## Phase 6: User Story 4 - Host Space Management (Priority: P2)

**Goal**: Allow hosts to see and manage their own storage listings.

**Independent Test**: Create a space as Host and verify it only appears on your dashboard, not in others'.

### Implementation for User Story 4

- [ ] T024 [P] [US4] Update `findAllPublished` in `DrizzleSpaceRepository.ts` to support filtering by `ownerId`.
- [ ] T025 [US4] Create `SpaceModal` for creating new spaces with image upload support in `artifacts/raumlog/src/components/Dashboard/SpaceModal.tsx`
- [ ] T026 [US4] Implement space creation service with public GCS image upload in `artifacts/api-server/src/application/services/SpaceService.ts`
- [ ] T027 [US4] Integrate My Listings list view in the Host Dashboard.

**Checkpoint**: Hosts can manage their inventory.

---

## Phase 7: User Story 5 - Public Marketplace Restrictions (Priority: P3)

**Goal**: Restrict deep marketplace features for guests to encourage signups.

**Independent Test**: Try to search on `/encuentra-tu-espacio` as a guest and verify you are redirected to `/auth`.

### Implementation for User Story 5

- [ ] T028 [US5] Implement `GuestGuard` logic in `artifacts/raumlog/src/hooks/useGuestRestriction.ts`
- [ ] T029 [US5] Wrap Search Bar and Pagination with redirect logic in `artifacts/raumlog/src/pages/FindSpace.tsx`

---

## Phase N: Polish & Cross-Cutting Concerns

- [ ] T030 Add error boundaries for file upload failures
- [ ] T031 Implement manual Account Linking UI for social/email matching
- [ ] T032 Final run of `quickstart.md` validation scenarios.

---

## Dependencies & Execution Order

1. **Setup (Phase 1)** -> **Foundational (Phase 2)** (Critical Path)
2. **Foundational (Phase 2)** -> **US1 (Phase 3)** (Auth MVP)
3. **US1 (Phase 3)** -> **US2 (Phase 4)** (Onboarding depends on user record)
4. **US2 (Phase 4)** -> **US3, US4, US5** (Post-onboarding features)

### Parallel Opportunities
- T003, T004, T005 (Initial config)
- T007, T008, T009 (Foundation schemas and middleware)
- Host Dashboard shell (T021) can be started while US2 is in progress.
