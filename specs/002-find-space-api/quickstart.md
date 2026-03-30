# Feature Quickstart: Find Space API Integration

**Prerequisites**:
1. PostgreSQL container MUST be running (`docker-compose up -d`).
2. `.env` file MUST have `DATABASE_URL=postgres://user:password@localhost:5433/raumlog`.

## Steps

### 1. Database Population
The marketplace requires real data to display. Run the automated seed script to populate the local database with initial storage listings:

```bash
pnpm --filter @workspace/db run seed
```

### 2. Backend Environment
Verify that the `api-server` is running and the database connection is established:

```bash
pnpm --filter @workspace/api-server run dev
```

### 3. Frontend Execution
Start the frontend with the required environment variables:

```bash
$env:PORT=5000; $env:BASE_PATH="/"; pnpm --filter @workspace/raumlog run dev
```

### 4. Verification
1. Open your browser at [http://localhost:5000/encuentra-tu-espacio](http://localhost:5000/encuentra-tu-espacio).
2. Open the network tab and verify a GET call to `/api/spaces` is executed.
3. Check that the displayed spaces are coming from the database response, including category tags and images.
4. Try filtering by category (e.g., "Vehículos") and verify the results update via the API.
