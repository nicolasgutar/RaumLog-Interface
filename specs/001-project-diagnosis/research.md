# Research: Infrastructure and Service Decisions

## Decisions

### 1. GCP Architecture
- **Decision**: Deploy `api-server` on **Google Cloud Run** using a Docker container.
- **Rationale**: Serverless, autoscaling, and ideal for a mid-transaction marketplace like RaumLog.
- **Alternatives Considered**: App Engine (rejected due to more rigid environment), Compute Engine (rejected due to high maintenance overhead).

### 2. Authentication
- **Decision**: Use **Firebase Auth** (Identity Platform) with the **Firebase Admin SDK** on the server.
- **Rationale**: Supports Google/Apple social sign-in out of the box, provides secure session management, and works across Web and Expo.
- **Alternatives Considered**: Keep local JWT/Bcrypt (rejected because it's harder to scale and lacks multi-factor/social features), Auth0 (rejected due to GCP ecosystem alignment).

### 3. File Storage
- **Decision**: Use **Google Cloud Storage** (GCS) Buckets.
- **Implementation**:
  - `raumlog-public-photos`: For listings.
  - `raumlog-user-docs`: For private assets (KYC).
- **Rationale**: Native GCP integration, fine-grained ACLs, and highly secure.
- **Alternatives Considered**: S3 (rejected to stay within GCP), Cloudinary (rejected due to extra costs at this stage).

### 4. Database Persistence
- **Decision**: Use **Google Cloud SQL for PostgreSQL** (v15+).
- **Connectivity**: Use the **Cloud SQL Auth Proxy** for local development and direct connection via `pg.Pool` in Cloud Run.
- **Rationale**: Managed, automated backups, and fully compatible with the current Drizzle ORM setup.
- **Alternatives Considered**: Supabase (rejected to centralize infra), AlloyDB (rejected as it's overkill for current scale).

---

## Best Practices Identification

- **Secret Management**: Store sensitive keys (Wompi, Firebase keys) in **Google Cloud Secret Manager** and inject them as environment variables in Cloud Run.
- **Environment Parity**: Use `dotenv` for local dev to mirror Cloud Run's injected environment variables.
- **Asset Privacy**: Use **Signed URLs** from GCS for temporary access to protected user documents.
