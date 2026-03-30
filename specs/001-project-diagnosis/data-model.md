# Data Model: Entity Relationships and Schema

## Entities

### `users`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | SERIAL | Yes | Primary Key |
| `email` | VARCHAR(100) | Yes | Unique index, lowercase |
| `name` | VARCHAR(100) | Yes | Full name |
| `phone` | VARCHAR(20) | No | Secondary contact |
| `passwordHash` | TEXT | Yes | Bcrypt hash (to be phased to Firebase UID) |
| `role` | ENUM | Yes | `host` or `guest` |
| `createdAt` | TIMESTAMP | Yes | Auto-generated |
| `updatedAt` | TIMESTAMP | Yes | Auto-generated |

### `spaces`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | SERIAL | Yes | Primary Key |
| `hostId` | INTEGER | Yes | FK to `users.id` |
| `title` | VARCHAR(255) | Yes | Display name |
| `description` | TEXT | Yes | Full details |
| `pricePerMonth` | NUMERIC | Yes | Base price (before IVA) |
| `location` | TEXT | Yes | Full address/coord |
| `photos` | JSONB | No | Array of GCS URLs |
| `status` | ENUM | Yes | `available`, `hidden`, `deactivated` |

### `reservations`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | SERIAL | Yes | Primary Key |
| `spaceId` | INTEGER | Yes | FK to `spaces.id` |
| `guestEmail` | VARCHAR(100) | Yes | Guest identifier |
| `startDate` | DATE | Yes | Check-in |
| `endDate` | DATE | Yes | Check-out |
| `totalPrice` | NUMERIC | Yes | Base + IVA |
| `platformCommission`| NUMERIC | Yes | RaumLog's 20% or 1-mo rent |
| `hostNetPrice` | NUMERIC | Yes | Owner's payout |
| `status` | ENUM | Yes | `pending_approval`, `approved_by_host`, `rejected`, `paid`, `in_storage`, `completed` |
| `wompiReference` | VARCHAR(100) | No | Payment tracking |

---

## State Transitions (Reservations)
- `pending_approval` → `approved_by_host` (or `rejected`)
- `approved_by_host` → `paid` (via Wompi check)
- `paid` → `in_storage` (Check-in confirmed)
- `in_storage` → `completed` (Check-out)

## Shared Schemas (`lib/api-zod`)
- All entities MUST have a Zod schema for input validation and output serialization.
