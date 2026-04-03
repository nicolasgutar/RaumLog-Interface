# RaumLog Frontend — Agent Guide

## Running the App

### Prerequisites

- Node.js 22+
- pnpm (`npm install -g pnpm`)
- A `.env` file in `artifacts/api-server/` and a `.env` file (or `.env.local`) in `artifacts/raumlog/` — see env vars below

### Install dependencies (repo root, run once)

```bash
pnpm install
```

### Development (two terminals)

Run from the **repo root**. Use PowerShell.

**Terminal 1 — backend** (Express API, port 5001):

```powershell
$env:PORT=5001; pnpm --filter @workspace/api-server dev
```

**Terminal 2 — frontend** (Vite, port 5000):

```powershell
$env:PORT=5000; $env:BASE_PATH='/'; pnpm --filter @workspace/raumlog dev
```

Frontend is at `http://localhost:5000`. Backend is at `http://localhost:5001`.

### Build

```bash
# Full production build (runs typecheck first, then builds all packages)
pnpm build

# Build frontend only
cd artifacts/raumlog && pnpm build

# Build backend only
cd artifacts/api-server && pnpm build
```

### Typecheck (no emit)

```bash
# All packages
pnpm typecheck

# Frontend only
cd artifacts/raumlog && pnpm typecheck

# Backend only
cd artifacts/api-server && pnpm typecheck
```

### Preview production build

```bash
cd artifacts/raumlog
pnpm build && pnpm serve
```

### Required environment variables

**`artifacts/api-server/.env`**

```
DATABASE_URL=               # PostgreSQL connection string (Cloud SQL or local)
FIREBASE_PROJECT_ID=        # Firebase project ID
GOOGLE_APPLICATION_CREDENTIALS=  # Path to GCP service account JSON
GCS_BUCKET_SPACES=          # GCS bucket name for space images
GCS_BUCKET_KYC=             # GCS bucket name for KYC documents
ADMIN_PASSWORD=             # Password for the legacy /admin/login endpoint
JWT_SECRET=                 # Secret for legacy admin JWTs
```

**`artifacts/raumlog/.env.local`**

```
VITE_API_BASE_URL=http://localhost:5001   # Omit in production (set via Cloud Run env)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_WOMPI_PUBLIC_KEY=      # Wompi payment gateway public key
```

---

Reference for coding agents working on the `artifacts/raumlog` frontend (React 18 + Vite + TypeScript).

---

## Hard Rules

1. **Never call `fetch()` directly in a component or page.** All HTTP calls must go through `src/lib/api.ts`. Add a new function there if the endpoint doesn't exist yet.
2. **Never inline the API base URL.** Import `API_URL` from `src/lib/constants.ts`. Do not read `import.meta.env.VITE_API_BASE_URL` anywhere else.
3. **Auth state lives in `authStore`.** Do not read or write `idToken` / `user` via `useStore`. That store is for booking and host/admin session data only.
4. **New components go in `src/components/<Domain>/ComponentName.tsx`.** Do not put large inline components inside page files.

---

## 1. Constants (`src/lib/constants.ts`)

```ts
export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";
export const API_URL  = `${API_BASE}/api`;
```

`API_URL` already includes `/api`. Do **not** append it again.

```ts
// correct
fetch(`${API_URL}/spaces`)          // → /api/spaces

// wrong — double prefix
fetch(`${API_URL}/api/spaces`)      // → /api/api/spaces
```

Import pattern:

```ts
import { API_URL } from "@/lib/constants";
```

---

## 2. Stores

### `authStore` — Firebase auth state (`src/store/authStore.ts`)

Persisted to `localStorage` as `raumlog-auth-storage`.

```ts
import { useAuthStore } from "@/store/authStore";

const { user, idToken } = useAuthStore();
```

| Field | Type | Description |
|---|---|---|
| `user` | `User \| null` | Logged-in user profile |
| `user.uid` | `string` | Firebase UID |
| `user.email` | `string` | Email |
| `user.name` | `string?` | Display name |
| `user.phone` | `string?` | Phone number |
| `user.role` | `'Anfitrión' \| 'Cliente'` | Account type |
| `user.isOnboardingComplete` | `boolean` | Has completed onboarding |
| `user.isEmailVerified` | `boolean` | Firebase email verified |
| `user.isUserVerified` | `boolean` | Admin-verified host |
| `user.isAdmin` | `boolean` | Is a platform admin |
| `idToken` | `string \| null` | Firebase ID token — pass as `Bearer` to all authenticated endpoints |

Methods:

```ts
setAuth(user, idToken)   // called by useAuth hook after Firebase sign-in
setLoading(bool)
setError(msg)
logout()                 // clears user + idToken
```

`idToken` is a short-lived Firebase JWT. The `useAuth` hook refreshes it automatically on Firebase `onIdTokenChanged`. Pass it as-is to API functions — do not decode it or cache it separately.

### `useStore` — Booking and session state (`src/store/useStore.ts`)

Persisted to `localStorage` as `raumlog-store` (only `hostEmail` and `guestInfo` survive page reload; `booking` and `adminToken` are in-memory only).

```ts
import { useStore } from "@/store/useStore";

const { guestInfo, booking, adminToken, setGuestInfo, setBooking, updateBooking, clearBooking } = useStore();
```

| Field | Type | Description |
|---|---|---|
| `hostEmail` | `string` | Email of the host whose dashboard is being viewed (legacy host portal) |
| `adminToken` | `string` | Legacy admin JWT from `/admin/login` password flow |
| `guestInfo` | `{ name, email, phone }` | Guest details collected during booking flow |
| `booking` | `BookingDraft \| null` | Active booking being constructed |

`BookingDraft` shape:

```ts
{
  spaceId: number;
  spaceTitle: string;
  spaceOwnerEmail: string;
  priceDaily: string;
  priceMonthly: string;
  checkIn: string;        // ISO date string
  checkOut: string;       // ISO date string
  days: number;
  months: number;
  totalPrice: number;
  itemsDescription: string;
  acceptedTerms: boolean;
  reservationId: number | null;
  status: "idle" | "pending" | "confirmed" | "paid";
}
```

---

## 3. API functions (`src/lib/api.ts`)

Import individually — no default export:

```ts
import { fetchMySpaces, saveSpace, deleteSpace } from "@/lib/api";
```

All authenticated functions take `idToken: string` (from `useAuthStore`) as their first argument and send it as `Authorization: Bearer <idToken>`.

Admin functions take `token: string` — this is `adminToken` from `useStore`, obtained via `adminLogin()`.

---

### Auth

| Function | Signature | Notes |
|---|---|---|
| `verifyToken` | `(idToken) → { user }` | Called by `useAuth` on every Firebase token refresh |
| `registerUser` | `(idToken, role, name) → { user }` | Finalises new user registration in DB |

---

### User / Onboarding

| Function | Signature | Notes |
|---|---|---|
| `onboardingStep1` | `(idToken, { fullName, phone, role, acceptTerms }) → { user }` | Saves profile details, completes onboarding |
| `becomeHost` | `(idToken) → { user }` | Switches user role to `Anfitrión` |

---

### KYC

| Function | Signature | Notes |
|---|---|---|
| `saveKycPaths` | `(idToken, cedula, soporte) → {}` | Saves GCS file paths for uploaded KYC docs |
| `submitKyc` | `(data) → {}` | Legacy unauthenticated KYC submit (older flow) |

---

### Spaces (host-authenticated)

| Function | Signature | Notes |
|---|---|---|
| `fetchMySpaces` | `(idToken) → Space[]` | Returns the logged-in host's spaces |
| `saveSpace` | `(idToken, payload, spaceId?) → Space` | `POST /spaces` if no `spaceId`, `PUT /spaces/:id` if provided |
| `deleteSpace` | `(idToken, spaceId) → void` | Hard-deletes a space |
| `submitSpace` | `(data) → {}` | Legacy unauthenticated space creation |

---

### Reservations

| Function | Signature | Notes |
|---|---|---|
| `createReservation` | `(data) → Reservation` | Creates a new reservation (unauthenticated) |
| `approveReservationByHost` | `(id) → Reservation` | Host approves a pending reservation |
| `payReservation` | `(id) → {}` | Marks reservation as paid |
| `checkinReservation` | `(id, { checkinNotes, checkinPhotos, declaredValue }) → Reservation` | Records check-in data |

---

### Host portal (legacy email-based)

| Function | Signature | Notes |
|---|---|---|
| `fetchHostSpaces` | `(email) → Space[]` | Spaces belonging to a host email |
| `fetchHostReservations` | `(email) → Reservation[]` | Reservations for a host email |
| `updateReservationStatus` | `(id, status, ownerEmail) → Reservation` | Updates reservation status |

---

### Admin (`adminToken` required)

| Function | Signature | Notes |
|---|---|---|
| `adminLogin` | `(password) → token` | Returns a JWT stored in `useStore.adminToken` |
| `fetchAdminUsers` | `(token, page?, search?, sort?, order?) → {}` | Paginated user list |
| `fetchAdminUserDetails` | `(token, userId) → {}` | Single user detail |
| `fetchAdminUserById` | `(token, userId) → {}` | Alias of the above, used in onboarding context |
| `verifyHost` | `(token, userId, isVerified) → {}` | Toggle host verification status |
| `fetchAdminSpacesV2` | `(token, page?, limit?, ownerId?) → {}` | Paginated space list |
| `toggleSpaceVisibility` | `(token, spaceId, isVisible) → {}` | Show/hide a space |
| `adminDeleteSpace` | `(token, spaceId) → {}` | Hard-delete a space as admin |

---

### Payments

| Function | Signature | Notes |
|---|---|---|
| `generateWompiSignature` | `(reference, amountInCents, currency, integrityKey) → string` | Client-side SHA-256 integrity hash for Wompi checkout |

---

## 4. File upload (`src/hooks/useSignedUpload.ts`)

Used for space images and KYC documents. Requests a signed GCS upload URL from the backend, then PUTs the file directly to GCS.

```ts
import { useSignedUpload, fetchSignedUrls, UploadedFile } from "@/hooks/useSignedUpload";

const { uploadFile } = useSignedUpload();

// Upload a file — returns { filePath, fileName, contentType }
const result: UploadedFile = await uploadFile(file, "spaces", setProgressCallback);

// Get signed read URLs for private files
const urlMap: Record<string, string> = await fetchSignedUrls(filePaths, "spaces");
```

Buckets: `"spaces"` for public space images, `"kyc"` for private identity documents.

---

## 5. Spaces query hook (`src/hooks/useSpaces.ts`)

Read-only, for the public listing page.

```ts
import { useSpaces, type SpacesQuery } from "@/hooks/useSpaces";

const { data, loading, error } = useSpaces({
  limit: 6,
  offset: 0,
  search: "bodega",
  category: "General",
  minPrice: 500000,
  maxPrice: 2000000,
});

// data.data       → SpaceDTO[]
// data.meta.totalCount
// data.meta.totalPages
```

---

## 6. Component conventions

Large UI blocks are extracted into domain components. Page files should stay under ~250 lines.

```
src/
  components/
    FindSpace/
      BookingModal.tsx       — multi-step booking flow modal
      ContractView.tsx       — storage contract document
      DepositReceipt.tsx     — post-checkin deposit receipt
    ProfilePage/
      SpaceFormModal.tsx     — create/edit space modal + delete confirmation
    OfferSpace/
      KycUploadForm.tsx      — KYC document upload (cédula + RUT)
    Listing/
      SpaceCard.tsx          — single space card for the grid
      FilterSidebar.tsx      — price/category filters
      Pagination.tsx         — page navigation
```

---

## 7. Typical patterns

### Authenticated page

```tsx
const { user, idToken } = useAuthStore();

// Guard
useEffect(() => {
  if (!user) navigate("/auth");
}, [user]);

// API call
const spaces = await fetchMySpaces(idToken!);
```

### Admin page

```tsx
const { adminToken } = useStore();

const data = await fetchAdminUsers(adminToken, page, search);
```

### Booking flow (guest)

```tsx
const { guestInfo, setGuestInfo, setBooking, updateBooking } = useStore();

// After collecting guest details:
setGuestInfo({ name, email, phone });

// After createReservation:
setBooking({ ...draft, reservationId: res.id, status: "pending" });

// After payment:
updateBooking({ status: "paid" });
```
