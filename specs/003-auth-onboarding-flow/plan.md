# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

This feature implements a complete authentication and onboarding ecosystem for RaumLog. It leverages **Firebase Auth** for secure sign-in (Google SSO & Email/Password) and initiates a two-step onboarding process for new users. The process includes collecting legal consent (T&C) and identity verification (KYC) via document uploads to **Google Cloud Storage**. Post-onboarding, users are dynamically routed to role-specific dashboards (Anfitrión vs Cliente), with hosts gaining the ability to manage their space listings directly.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript / Node.js 20+ / React 18+  
**Primary Dependencies**: Firebase SDK (Frontend), Firebase Admin SDK (Backend), Google Cloud Storage (@google-cloud/storage), Drizzle ORM, Zod.  
**Storage**: PostgreSQL (Neon/Local), Google Cloud Storage (Buckets: `raumlog-spaces-public`, `raumlog-kyc-private`).  
**Testing**: Vitest / Playwright (for E2E auth flow).  
**Target Platform**: Web (Vite) + API Server (Express).  
**Project Type**: Web Application (Monorepo with `artifacts/raumlog` and `artifacts/api-server`).  
**Performance Goals**: Auth state resolution in <200ms; Onboarding completion in under 5 minutes.  
**Constraints**: Zero-trust access to KYC documents (private bucket); 5MB limit on document uploads.  
**Scale/Scope**: Initial implementation for Host and Client roles; MVP focuses on Listing management for hosts.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|-----------|-------|--------|
| **I. Unified Source of Truth** | All Auth schemas (Zod) and User types MUST be defined in `lib/api-zod` or `lib/shared`. | ✅ Aligned |
| **III. Compliance** | Onboarding MUST include explicit T&C and Privacy Policy flags (Habeas Data). | ✅ Aligned |
| **V. Fail-Safe Availability** | System MUST handle Firebase being unreachable gracefully (e.g., show login error message). | ✅ Aligned |
| **VI. Clean Architecture** | Use Case layer MUST handle the mapping of Firebase UID to local Database User record. | ✅ Aligned |
| **Security** | JWT from Firebase MUST be verified on Every API request using Middleware. | ✅ Aligned |

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
artifacts/api-server/
├── src/
│   ├── api/controllers/        # AuthController, UserController, KycController
│   ├── application/services/    # AuthService, UserService, KycService
│   ├── infrastructure/
│   │   ├── auth/                # FirebaseMiddleware
│   │   ├── repositories/        # UserRepository, KycRepository (Drizzle)
│   │   └── storage/             # GCSStorageService
│   └── routes/                  # authRoutes.ts, userRoutes.ts, kycRoutes.ts

artifacts/raumlog/
├── src/
│   ├── components/
│   │   ├── Auth/                # AuthForm, GoogleButton
│   │   ├── Dashboard/           # HostDashboard, SpaceModal
│   │   └── Onboarding/          # Step1Contact, Step2KYC
│   ├── hooks/                   # useAuth, useOnboarding, useHostSpaces
│   ├── pages/                   # AuthPage, OnboardingPage, ProfilePage
│   ├── services/                # firebase.ts, api.ts
│   └── store/                   # authStore (Zustand/Context)

lib/
├── api-zod/                     # Auth schemas, User schemas
└── db/                          # User table, KYC table, Space ownerId migration
```

**Structure Decision**: Monorepo split between `api-server` (backend) and `raumlog` (frontend). Using Clean Architecture for the backend and Hook-based service layer for the frontend. All shared schemas reside in `lib/api-zod`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
