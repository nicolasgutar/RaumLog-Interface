# Quickstart: Developer Setup for RaumLog (Diagnosis Phase)

## Prerequisites
- **Node.js**: v20.x+
- **pnpm**: v9.x+
- **PostgreSQL**: (Replit managed or locally installed v15+)
- **Google Cloud CLI**: Installed and configured with `gcloud auth application-default login`.

## 1. Initial Setup
Clone the repository and install all workspace dependencies:
```bash
pnpm install
```

## 2. Environment Configuration
Create a `.env` file in the root directory and in `artifacts/api-server/`:

```env
# Database Connection
DATABASE_URL="postgres://user:password@localhost:5432/raumlog"

# API Server Config
PORT=5001
JWT_SECRET="development-only-secret"

# GCP Infrastructure Target (Requires GCP Project ID)
GCP_PROJECT_ID="your-project-id"

# Firebase Config (Client SDK)
FIREBASE_API_KEY="AIzaSy..."
FIREBASE_PROJECT_ID="raumlog-firebase"

# Wompi Config (Sandbox)
WOMPI_PUBLIC_KEY="pub_test_..."
```

## 3. Database Schema Push
Push the latest Drizzle schema from the shared library to your local database:
```bash
cd lib/db
pnpm run push
```

## 4. Launching Projects
In separate terminals, run the dev servers:

**API-Server**:
```bash
pnpm --filter @workspace/api-server run dev
```

**Web App**:
```bash
pnpm --filter @workspace/raumlog run dev
```

**Mobile App**:
```bash
pnpm --filter @workspace/raumlog-mobile run dev
```

---

## Troubleshooting
- **Build Errors**: Run `pnpm run build` from the root to ensure the `@workspace/shared` libs are compiled first.
- **Drizzle Push Failure**: Ensure your `DATABASE_URL` is accessible and the user has schema creation privileges.
