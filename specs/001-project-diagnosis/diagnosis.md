# RaumLog Project Diagnosis: Mapping & Gap Analysis

## Project Structure Mapping

### Root Directory
- `.agent/`, `.specify/`: Meta-configuration for AI reasoning and project specification.
- `artifacts/`: Major product workspaces.
- `lib/`: Shared cross-workspace libraries.
- `packages/`: (Reserved for future shared packages, although currently integrated into `lib/`).
- `scripts/`: Utilities for the environment.
- `specs/`: Detailed feature specifications and implementation planning documents.

## Detailed Folder Mapping

- **`artifacts/`**: Product-specific codebases.
  - `api-server/src/`: Express backend (routes, middleware, logic).
  - `raumlog/src/`: Web frontend (React + Vite + Tailwind CSS v4).
  - `raumlog-mobile/app/`: Expo Router based mobile app.
- **`lib/`**: Shared workspace libraries.
  - `db/src/schema/`: Drizzle entity definitions (shared source of truth).
  - `api-zod/src/`: Cross-platform validation schemas.
  - `api-client-react/src/`: Type-safe API client hooks for React.
- **`scripts/src/`**: Infrastructure and data utilities.
- **`specs/001-project-diagnosis/`**: Diagnosis documentation, contracts, and research.

---

### Artifacts (Core Products)

#### `artifacts/api-server/` (The Backend)
- **Framework**: Express 5.
- **Purpose**: Centralized REST API for Web and Mobile platforms.
- **Structure**:
  - `src/app.ts`: Core application setup.
  - `src/index.ts`: Server entry point.
  - `src/routes/`: Route handlers for authentication (`auth.ts`), spaces (`spaces.ts`), reservations (`reservations.ts`), and more.
  - `src/middlewares/`: Express middlewares for authentication, error handling, etc.

#### `artifacts/raumlog/` (The Web Frontend)
- **Stack**: React 18 + Vite + Tailwind CSS v4 + Radix UI.
- **Purpose**: Customer and host web portal.
- **Key Modules**:
  - `src/pages/`: Main application screens (Home, FindSpace, HandleSpace, Admin).
  - `src/lib/`: Local utilities, including payment and authentication bridges.

#### `artifacts/raumlog-mobile/` (The Mobile App)
- **Stack**: Expo 52 (React Native).
- **Purpose**: Mobile companion app for real-time storage management.
- **Key Modules**:
  - `app/`: Expo Router based screens (Dashboard, Reservations, Auth).
  - `context/`: Application state management (AuthContext).

---

### Libraries (Shared Logic)

#### `lib/db/` (Data Access Layer)
- **Tooling**: Drizzle ORM + Drizzle Kit (Migrations).
- **Database**: PostgreSQL (managed locally or via Replit).
- **Connection**: Established in `lib/db/src/index.ts` using `pg.Pool`.
- **Credential Path**: Relies on `process.env.DATABASE_URL`.
- **Schema Gaps**: 
  - `spacesTable` lacks `category`, `accessType`, and `images` fields.
  - `reservationsTable` stores prices as `text`; consider `integer` (cents) for better precision in calculations.

#### `lib/api-zod/` (Validation Layer)
- **Tooling**: Zod.
- **Purpose**: Contract-first validation shared between API, Web, and Mobile to ensure data integrity.

#### `lib/api-client-react/` (Communication Layer)
- **Purpose**: Type-safe React hooks for consuming the Backend API.

---

## 🔍 System Diagnosis

### What it currently DOES:
1.  **Auth**: Local email and password authentication with JWT is implemented in `api-server/src/routes/auth.ts`.
2.  **Marketplace**: Space listings with search, filtering, and detail views are functional in both Web and Mobile.
3.  **Reservations**: Flow for creating, approving, and completing reservations is present in `api-server/src/routes/reservations.ts`.
4.  **Local Database**: Successfully connected to Docker PostgreSQL (`localhost:5433`) with `raumlog` database initialized. (✅ Setup Complete)
5.  **UI/UX**: Responsive landing pages and dashboards for both hosts and guests.

### Hardcoding & Data Model Gaps (Action Required):
1.  **FindSpace.tsx**:
    -   **Gap**: The `spaces` list is currently hardcoded in the frontend.
    -   **Refactor**: Implement `useEffect` fetch to retrieve published spaces from the backend.
    -   **Missing API Hook**: `src/lib/api.ts` lacks a public `fetchSpaces()` function to retrieve the marketplace listings.
    -   **Model Mismatch**: Frontend expects `category`, `accessType`, and `images[]`, which are missing from the `spacesTable` schema.
2.  **OfferSpace.tsx**:
    -   **Gap**: The space submission form works but needs to include the newly identified fields (`category`, `accessType`, `images`).
    -   **Refactor**: Update `submitSpace` call and form state to include all necessary operational data.
3.  **AuthPage.tsx**:
    -   **Refactor**: Ensure the `register` function correctly maps the `phone` and `role` fields to the `usersTable`.

### What it NEEDS (Infrastructure & Services):
1.  **Firebase Auth**: Replace/Augment local JWT with Firebase for social sign-in (Google/Apple) and centralized user management.
2.  **GCP Cloud Storage**:
    - `raumlog-public-photos`: Public bucket for space listings and marketing assets.
    - `raumlog-user-docs`: Protected bucket for KYC/Identity info and check-in photos.
3.  **GCP Cloud SQL**: Managed PostgreSQL instance (replaces Replit/Local DB).

---

## 🔑 Environment Variables & Configuration

The following variables MUST be configured across the environments (API, Web, Mobile):

### Backend (API Server)
- `DATABASE_URL`: Connection string for Cloud SQL (PostgreSQL).
- `PORT`: Port for the API server (default 8080/4000).
- `JWT_SECRET`: Secret key for token signing (to be phased out or used for intra-service auth).
- `FIREBASE_PROJECT_ID`: ID of the project in Google Cloud.
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to JSON key for GCP service account.
- `WOMPI_PUBLIC_KEY` / `WOMPI_PRIVATE_KEY`: Credentials for real payment integration.
- `GCP_S3_PUBLIC_BUCKET`: Name of the public photo bucket.
- `GCP_S3_PRIVATE_BUCKET`: Name of the protected user info bucket.
- `CORS_ORIGIN`: Allowed frontend domains (Web/Mobile).

### Frontend (Web/Mobile)
- `API_BASE_URL`: The URL where the `api-server` is deployed.
- `FIREBASE_API_KEY`: API key for Firebase Client SDK.
- `WOMPI_WIDGET_KEY`: Public key for the Wompi payment widget.

---

## ⚡ Next Steps
1.  **Plan Infrastructure**: Detailed specification for GCP resource provisioning.
2.  **Plan Firebase Integration**: Design the migration from local JWT to Firebase Auth.
3.  **Plan Service Layer**: Refactor bloated routes into a clean `api-server/src/services` structure.

