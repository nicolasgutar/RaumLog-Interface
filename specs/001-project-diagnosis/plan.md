# Implementation Plan: Project Diagnosis and Blueprinting

**Branch**: `001-project-diagnosis` | **Date**: 2026-03-27 | **Spec**: [spec.md](file:///c:/Users/57321/OneDrive%20-%20Universidad%20EIA/RaumLog/specs/001-project-diagnosis/spec.md)
**Input**: Feature specification from `specs/001-project-diagnosis/spec.md`

## Summary

Perform a comprehensive audit of the RaumLog monorepo to map the existing architecture, identify functional gaps (Social Auth, Real Payments, Service Layering), and define the infrastructure requirements for a production-ready GCP deployment.

## Technical Context

**Language/Version**: TypeScript 5.9 / Node 20 (LTS)  
**Primary Dependencies**: Express 5, React 18, Expo 52, Drizzle ORM, Zod  
**Storage**: PostgreSQL (GCP Cloud SQL target), GCP Buckets (Public/Private)  
**Testing**: pnpm workspace test scripts (to be defined)  
**Target Platform**: GCP Cloud Run, Firebase Auth  
**Project Type**: Monorepo with `api-server`, `raumlog` (web), and `raumlog-mobile` (expo)  
**Performance Goals**: Sub-200ms API response time (p95)  
**Constraints**: Colombian Tax Compliance (IVA 19%), LOPD (Habeas Data)  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **Unified Source of Truth**: All schema definitions MUST stay in `lib/db`. (✅ PASS)
2. **Payment Integrity**: Wompi logic MUST have 100% test coverage. (⚠️ PENDING: Current logic is simulated; plan requires defining the testing strategy for the real integration).
3. **Regional Compliance**: IVA 19% validation. (✅ PASS: Logic identified in reservations route).
4. **Mobile-First UX**: Expo parity. (✅ PASS: Structure exists).
5. **Security Standards**: JWT and Bcrypt usage. (✅ PASS: Identified in auth routes).

## Project Structure

### Documentation (this feature)

```text
specs/001-project-diagnosis/
├── spec.md              # Feature specification
├── plan.md              # This file
├── diagnosis.md         # Folder mapping and gap analysis
├── core-stack.md        # Technical stack documentation
├── research.md          # Infrastructure and service decisions (Phase 0)
├── data-model.md        # Database and entity mapping (Phase 1)
└── contracts/           # API Contract definitions (Phase 1)
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| No Service Layer | Existing prototype structure | Direct DB access in routes is faster for MVP but lacks scalability |

---

## Phase 0: Outline & Research

### Tasks
1. **Research GCP Service Integration**: Identify specific GCP SDKs for Node.js to handle Buckets and Cloud SQL connectivity.
2. **Research Firebase Auth Migration**: Determine how to wrap existing JWT logic or replace it entirely with Firebase Admin SDK on the backend and Firebase Client SDK on web/mobile.
3. **Audit Environment Variable Security**: Determine the best practice for managing secrets in GCP (Secret Manager vs. JSON keys).

**Output**: `research.md`

---

## Phase 1: Design & Contracts

### Tasks
1. **Define Data Entities**: Formalize the entity relationships in `data-model.md`.
2. **API Contract Specification**: Document existing Express routes as formal Zod-backed contracts in `contracts/`.
3. **Quickstart Documentation**: Create a `quickstart.md` for developers to set up the environment with the required GCP/Firebase credentials.

**Output**: `data-model.md`, `contracts/`, `quickstart.md`
