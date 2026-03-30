# API Contracts: Reservations (Zod Documentation)

## Endpoint: `POST /api/reservations`
- **Purpose**: Creates a pending reservation.
- **Payload (`CreateReservationSchema`)**:
  ```typescript
  {
    spaceId: z.number(),
    guestEmail: z.string().email(),
    startDate: z.string().date(),
    endDate: z.string().date(),
    totalPrice: z.string().numeric(), // Includes base + 19% IVA
    months: z.number().optional()
  }
  ```
- **Responses**:
  - `201 Created`: `{ reservation: { id, status: "pending_approval" } }`
  - `400 Bad Request`: Validation error.

---

## Endpoint: `POST /api/reservations/:id/pay`
- **Purpose**: Checks status and "simulates" payment through Wompi reference creation.
- **Requires**: `id` in URL.
- **Payload (`PaymentCheckSchema`)**: Empty for now.
- **Responses**:
  - `200 OK`: `{ success: true, reservation, wompiResponse: { status: "APPROVED", ... } }`
  - `404 Not Found`: Reservation ID not in database.
  - `400 Bad Request`: Reservation is already paid or rejected.

---

## Endpoint: `POST /api/reservations/:id/checkin`
- **Purpose**: Updates reservation to `in_storage`.
- **Requires**: `id` in URL + Authenticated Payload.
- **Payload (`CheckinSchema`)**:
  ```typescript
  {
    checkinNotes: z.string().optional(),
    checkinPhotos: z.array(z.string().url()).optional(),
    declaredValue: z.string().numeric().optional()
  }
  ```
- **Responses**:
  - `200 OK`: `{ success: true, reservation: { status: "in_storage" } }`
  - `400 Bad Request`: Must be in `paid` state before check-in.
