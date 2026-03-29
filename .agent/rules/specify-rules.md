# RaumLog Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-27

## Active Technologies
- TypeScript / Node.js v22.17.1 / React / Vite. + Express (API), Drizzle ORM (DB), Zod (Validation), React/TailwindCSS (UI). (002-find-space-api)
- PostgreSQL v16 (locally via Docker). (002-find-space-api)
- TypeScript / Node.js 20+ / React 18+ + Firebase SDK (Frontend), Firebase Admin SDK (Backend), Google Cloud Storage (@google-cloud/storage), Drizzle ORM, Zod. (003-auth-onboarding-flow)
- PostgreSQL (Neon/Local), Google Cloud Storage (Buckets: `raumlog-spaces-public`, `raumlog-kyc-private`). (003-auth-onboarding-flow)

- TypeScript 5.9 / Node 20 (LTS) + Express 5, React 18, Expo 52, Drizzle ORM, Zod (001-project-diagnosis)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

npm test; npm run lint

## Code Style

TypeScript 5.9 / Node 20 (LTS): Follow standard conventions

## Recent Changes
- 003-auth-onboarding-flow: Added TypeScript / Node.js 20+ / React 18+ + Firebase SDK (Frontend), Firebase Admin SDK (Backend), Google Cloud Storage (@google-cloud/storage), Drizzle ORM, Zod.
- 002-find-space-api: Added TypeScript / Node.js v22.17.1 / React / Vite. + Express (API), Drizzle ORM (DB), Zod (Validation), React/TailwindCSS (UI).

- 001-project-diagnosis: Added TypeScript 5.9 / Node 20 (LTS) + Express 5, React 18, Expo 52, Drizzle ORM, Zod

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
