# Workspace — RaumLog

## Overview

**RaumLog** — Spanish-language storage marketplace for Medellín and Bogotá, Colombia. Connects people needing storage (garages, cuartos útiles, bodegas) with hosts. Built as a pnpm monorepo with React + Vite + Tailwind CSS frontend and Express + PostgreSQL backend.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **Frontend**: React + Vite + Tailwind CSS
- **State management**: Zustand with persist middleware
- **Build**: esbuild (API), Vite (frontend)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (port 8080)
│   │   └── src/routes/
│   │       ├── admin.ts    # Admin CRUD (JWT-protected)
│   │       ├── spaces.ts   # Space submission
│   │       ├── reservations.ts  # Booking + state machine + check-in
│   │       ├── host.ts     # Host dashboard data
│   │       └── kyc.ts      # KYC document submission
│   └── raumlog/            # React frontend
│       └── src/
│           ├── pages/
│           │   ├── Home.tsx
│           │   ├── FindSpace.tsx     # Space search + booking modal
│           │   ├── OfferSpace.tsx    # Host registration + KYC
│           │   ├── HostDashboard.tsx # /dashboard/host
│           │   ├── AdminLogin.tsx    # /admin/login
│           │   ├── AdminDashboard.tsx # /admin
│           │   └── AdminControl.tsx  # /admin/control (superadmin)
│           ├── lib/
│           │   ├── api.ts            # All API fetch functions
│           │   ├── payment-service.ts # PaymentService + CommissionEngine
│           │   └── notifications.ts  # NotificationService (console.log)
│           └── store/
│               └── useStore.ts       # Zustand store (hostEmail, guestInfo, adminToken)
└── lib/db/src/schema/
    ├── spaces.ts
    ├── reservations.ts    # 6-state machine enum
    └── kyc_submissions.ts
```

## DB Schema

### `spaces` table
- `id`, `ownerName`, `ownerEmail`, `ownerPhone`, `spaceType`, `city`, `address`, `description`
- `priceDaily`, `priceMonthly`, `priceAnnual` (strings, in COP)
- `status` enum: `pending` | `approved` | `rejected`
- `published` boolean (admin can publish after approving)
- `createdAt`

### `reservations` table
- `id`, `spaceId`, `spaceTitle`, `spaceOwnerEmail`
- `guestName`, `guestEmail`, `guestPhone`, `itemsDescription`
- `declaredValue`, `checkIn`, `checkOut`, `days`, `months`
- `totalPrice`, `hostNetPrice`, `platformCommission`
- `acceptedTerms` boolean
- `status` enum: `pending_approval` | `approved_by_host` | `rejected` | `paid` | `in_storage` | `completed`
- `wompiReference`
- `checkinNotes`, `checkinPhotos` (JSON array of base64 strings)
- `createdAt`, `updatedAt`

### `kyc_submissions` table
- `id`, `hostEmail`, `hostName`, `hostPhone`
- `cedulaFilename`, `cedulaData` (base64), `rutFilename`, `rutData` (base64)
- `status` enum: `pending` | `approved` | `rejected`
- `adminNotes`, `createdAt`, `updatedAt`

## Business Logic

### Commission Engine (20%)
- Host enters "Precio Deseado" (what they want to receive)
- Public Price = Desired / 0.80
- Commission = Public Price × 0.20
- Host receives 80% of public price paid by guest
- `CommissionEngine` exported from `artifacts/raumlog/src/lib/payment-service.ts`

### Reservation State Machine
```
PENDIENTE_APROBACION → APROBADA_POR_ANFITRION → PAGADA → EN_ALMACENAMIENTO → FINALIZADA
      (created)              (host approves)     (paid)   (check-in done)     (checkout)
```
- Each transition logs a notification to console via `NotificationService`
- Demo spaces auto-approve after 2s (simulate host approval)

### PaymentService (Wompi Sandbox)
- Prepares `{ amount_in_cents, currency: "COP", reference, integrity_signature }`
- SHA-256 integrity signature via `crypto.subtle`
- Sandbox mode: simulates APPROVED response
- `reference` format: `RL-{reservationId}-{timestamp}`

### Digital Check-in (Acta de Entrega)
- Unlocked only after PAID status
- Upload up to 5 photos (stored as base64 in DB)
- Inventory notes text
- Declared value (limits liability)
- Completing check-in transitions to IN_STORAGE

## Auth & Access

- **Admin login**: `POST /api/admin/login` with `ADMIN_PASSWORD` env var → JWT (stored in `sessionStorage`)
  - `/admin` — Admin Dashboard (approve/reject spaces, view reservations, manage KYC)
  - `/admin/control` — SuperAdmin (publish/unpublish/delete + all CRUD)
  - Not linked in main nav
- **Host login**: email-only (no password), persisted in Zustand store
  - `/dashboard/host` — view own spaces, approve/reject incoming reservations, earnings summary
- **JWT_SECRET** env var required for admin JWT signing

## T&C Items (Booking Modal)
1. RaumLog es intermediario; la custodia es del anfitrión
2. Prohibido almacenar perecederos, inflamables o artículos ilegales
3. La responsabilidad se limita al valor declarado en el Acta de Entrega

## Routes

### API Routes (`/api`)
- `POST /spaces` — submit new space
- `POST /reservations` → creates as `pending_approval`
- `POST /reservations/:id/approve-host` → `approved_by_host`
- `POST /reservations/:id/pay` → `paid` + Wompi simulation
- `POST /reservations/:id/checkin` → `in_storage` + stores photos/notes
- `POST /reservations/:id/complete` → `completed`
- `GET /host/spaces?email=` + `GET /host/reservations?email=`
- `PATCH /host/reservations/:id/status`
- `POST /kyc` — submit KYC documents
- `GET /admin/spaces` + `GET /admin/reservations` + `GET /admin/kyc` (JWT)
- `PATCH /admin/spaces/:id/status` + `PATCH /admin/spaces/:id/publish` + `DELETE /admin/spaces/:id`
- `PATCH /admin/kyc/:id/status`

### Frontend Routes
- `/` — Home / Landing
- `/encuentra-tu-espacio` — Find & Book spaces
- `/ofrece-tu-espacio` — Host registration
- `/dashboard/host` — Host Panel
- `/admin/login` → `/admin` → `/admin/control`
- `/contacto` — Contact

## Design Tokens

- Primary: `#2C5E8D`
- Light blue: `#AECBE9`
- Warm beige (bg): `#D8CFC3`
- Font: Bebas Neue (headings), system (body)
- Logo: `public/raumlog-logo-main.png` (transparent bg)

## Environment Variables

- `DATABASE_URL` — auto-provided by Replit PostgreSQL
- `ADMIN_PASSWORD` — admin panel password
- `JWT_SECRET` — for admin JWT signing

## Notifications (console.log simulation)

`NotificationService` in `src/lib/notifications.ts` logs to console for:
- Every status transition (state machine)
- Payment received (with commission breakdown)
- Check-in / Acta de Entrega completed

In production, these would be replaced with email/SMS/push integrations.
