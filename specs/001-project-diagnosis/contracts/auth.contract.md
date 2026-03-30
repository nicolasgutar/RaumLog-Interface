# API Contracts: Authentication (Zod Documentation)

## Endpoint: `POST /api/auth/register`
- **Purpose**: Creates a new user.
- **Payload (`RegisterSchema`)**:
  ```typescript
  {
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string(),
    phone: z.string().optional(),
    role: z.enum(["host", "guest"])
  }
  ```
- **Responses**:
  - `201 Created`: `{ token, user: { id, email, name, role } }`
  - `400 Bad Request`: Validation error.
  - `409 Conflict`: User already exists.

---

## Endpoint: `POST /api/auth/login`
- **Purpose**: Logs in a user.
- **Payload (`LoginSchema`)**:
  ```typescript
  {
    email: z.string().email(),
    password: z.string()
  }
  ```
- **Responses**:
  - `200 OK`: `{ token, user: { id } }`
  - `401 Unauthorized`: Invalid credentials.

---

## Endpoint: `GET /api/auth/me`
- **Purpose**: Returns current user profile.
- **Requires**: `Bearer <JWT>`
- **Responses**:
  - `200 OK`: `{ user: { id, name, role } }`
  - `401 Unauthorized`: No token or invalid.
