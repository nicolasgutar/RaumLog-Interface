# API Contracts: Auth & Onboarding Flow

## Authentication
- **Endpoint**: `POST /api/auth/verify-token`
  - **Description**: Verifies Firebase ID token and matches with local User record.
  - **Request Body**: `{ "idToken": "string" }`
  - **Response**: `{ "user": UserObject, "needsOnboarding": boolean }`

## User Profile
- **Endpoint**: `GET /api/users/profile`
  - **Description**: Returns the fully joined profile of the authenticated user.
  - **Auth Required**: `Bearer ID_TOKEN`.
  - **Response**: `{ UserObject, "kycStatus": string }`

- **Endpoint**: `POST /api/users/onboarding/step1`
  - **Description**: Submits contact info and consent.
  - **Body**: `{ "fullName": "string", "phone": "string", "acceptTerms": boolean }`
  - **Response**: `{ "nextStep": "kyc" }`

## KYC Documents
- **Endpoint**: `POST /api/kyc/upload`
  - **Description**: Handles file uploads for identity verification.
  - **Form Data**: `file: Binary, type: enum`.
  - **Response**: `{ "id": number, "status": "Pending" }`

## Space Management (Host)
- **Endpoint**: `POST /api/spaces`
  - **Description**: Creates a new space tied to the current user's UID.
  - **Auth Required**: `Bearer ID_TOKEN`.
  - **Body**: `{ ...SpaceDetails, "images": ["signed_url_paths"] }`
  - **Response**: `{ SpaceObject }`

- **Endpoint**: `GET /api/spaces/my-listings`
  - **Description**: Returns all spaces where `ownerId === user.uid`.
  - **Response**: `{ "data": [Space[]] }`
