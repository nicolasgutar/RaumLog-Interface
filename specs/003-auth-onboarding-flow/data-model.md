# Data Model: Auth & Onboarding Flow

## Entities

### User
| Field | Type | Description |
|-------|------|-------------|
| **uid** (PK) | `varchar(255)` | Firebase Auth Unique ID. |
| **email** | `varchar(255)` | Primary user email. |
| **displayName** | `text` | Full name from step 1 onboarding. |
| **phone** | `varchar(20)` | Phone number from step 1 onboarding. |
| **accountType** | `enum('Cliente', 'Anfitrión')` | User Role. |
| **isOnboardingComplete** | `boolean` | Flag for redirection logic. |
| **isEmailVerified** | `boolean` | Firebase email status. |
| **isUserVerified** | `boolean` | Admin status for KYC. |
| **isAdmin** | `boolean` | Platform admin access. |
| **lastLogin** | `timestamp` | Audit track. |

### KycDocument
| Field | Type | Description |
|-------|------|-------------|
| **id** (PK) | `serial` | Internal identifier. |
| **userId** (FK) | `varchar(255)` | Linked to `User.uid`. |
| **type** | `varchar(20)` | `CEDULA`, `RUT`, `BILL`. |
| **storagePath** | `text` | GCS Private Bucket path. |
| **status** | `enum('Pending', 'Approved', 'Rejected')` | KYC workflow state. |
| **notes** | `text` | Rejection feedback for user. |

### Space (Updates)
| Field | Type | Description |
|-------|------|-------------|
| **ownerId** (FK) | `varchar(255)` | Linked to `User.uid`. New field. |

## Relationships
- **User (1) <---> (0..N) Space**: A Host can own multiple spaces.
- **User (1) <---> (0..N) KycDocument**: A User can upload multiple identity records.
