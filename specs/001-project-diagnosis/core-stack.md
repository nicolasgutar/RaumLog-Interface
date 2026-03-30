# RaumLog Core Technology Stack

## Backend (API-Server)
- **Runtime**: Node.js 20+
- **Framework**: Express 5 (TypeScript)
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (Cloud SQL candidate)
- **Validation**: Zod
- **Logging**: Pino / Pino-HTTP
- **Auth**: JWT (to be phased into Firebase)
- **Key dependencies**: `bcryptjs`, `jsonwebtoken`, `cors`, `pg`

## Web Frontend (Raumlog)
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3 / v4
- **Component Library**: Radix UI (shadcn/ui style components)
- **State Management**: Zustand
- **Routing**: Wouter / React Router Dom
- **Data Fetching**: React Query (TanStack Query)
- **Icons**: Lucide-React / React-Icons

## Mobile (Raumlog-Mobile)
- **Framework**: React Native (Expo 52)
- **Navigation**: Expo Router (Tabs)
- **State Management**: Zustand / AsyncStorage (Auth)
- **UI**: Custom components based on Tailwind-style utilities

## Shared Libraries (Monorepo/Workspace)
- **`lib/db`**: Shared Drizzle schema and connection pool.
- **`lib/api-zod`**: Centralized Zod validation schemas for API contracts.
- **`lib/api-client-react`**: Shared API client hooks for frontend consumption.

## Infrastructure (GCP Target)
- **Hosting**: App Engine or Cloud Run (Candidate)
- **Auth**: Firebase Auth
- **Storage**: Cloud Storage (Public & Private Buckets)
- **Database**: Cloud SQL for PostgreSQL
- **Monitoring**: Google Cloud Logging / Pino
