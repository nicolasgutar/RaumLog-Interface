# Tasks: Project Diagnosis and Blueprinting

**Input**: Design documents from `specs/001-project-diagnosis/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup (Environment Initialization)

**Purpose**: Get the local environment ready for testing and further diagnosis.

- [x] T001 Initialize workspace-level configurations
- [x] T002 [P] Create `.env` files in project root and artifacts/api-server/
- [x] T003 [P] Populate `.env` with template variables (PORT, JWT_SECRET, etc.)

---

## Phase 2: Foundational (Database & Connectivity)

**Purpose**: Establish a working connection to the local Postgres container.

- [x] T004 Verify connectivity to Docker Postgres on localhost:5433
- [x] T005 Create `raumlog` database in the local Postgres instance
- [x] T006 Update `DATABASE_URL` in `.env` to `postgres://user:password@localhost:5433/raumlog`
- [x] T007 Initialize database schema by running `pnpm run push` from lib/db/

---

## Phase 3: User Story 1 - Technical Mapping Diagnosis (Priority: P1)

**Goal**: Complete the audit of the codebase structure and simulated logic.

**Independent Test**: Verify `diagnosis.md` accurately reflects the file system and simulated payment logic.

### Implementation for User Story 1

- [x] T008 [US1] Complete the mapping of all folders and subfolders in specs/001-project-diagnosis/diagnosis.md
- [x] T009 [US1] Audit and document current auth (JWT/Bcrypt) and persistence mechanisms in specs/001-project-diagnosis/diagnosis.md

---

## Phase 4: User Story 2 - Infrastructure & Service Mapping (Priority: P2)

**Goal**: Define the environment variables and external services for GCP/Firebase.

**Independent Test**: Review `diagnosis.md` for a complete list of GCP Buckets, Firebase IDs, and DB configurations.

### Implementation for User Story 2

- [x] T010 [US2] Map and document all GCP/Firebase environment variables and services in specs/001-project-diagnosis/diagnosis.md

---

## Phase N: Polish & Cross-Cutting Concerns

- [x] T011 Verify quickstart.md accuracy against the local setup established in Phase 2

---

## Dependencies & Execution Order

1. **Setup (Phase 1)**: Must complete first to provide environment placeholders.
2. **Foundational (Phase 2)**: Depends on Phase 1. Must complete before any database-reliant diagnosis.
3. **User Stories (Phase 3 & 4)**: Can proceed in parallel after Phase 2 is complete.
4. **Polish**: Final step.
