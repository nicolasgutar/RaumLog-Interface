# Feature Specification: Project Diagnosis and Functional Mapping

**Feature Branch**: `001-project-diagnosis`  
**Created**: 2026-03-27  
**Status**: Draft  
**Input**: User description: "Explore project structure, run diagnosis, and map current capabilities to missing functional requirements."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Comprehensive Technical Mapping (Priority: P1)
As a lead developer, I want a complete audit of the codebase so that I can understand where to implement missing features without breaking existing logic.

**Why this priority**: High. This is the foundation for all architectural decisions.

**Independent Test**: Verification of the `diagnosis.md` and file tree by inspection.

**Acceptance Scenarios**:
1. **Given** the current project, **When** the diagnosis is complete, **Then** all key directories (artifacts, lib, packages) MUST be defined in the documentation.
2. **Given** the existing backend, **When** evaluated, **Then** simulated vs. functional logic (like payments) MUST be clearly identified.

---

### User Story 2 - Infrastructure and Service Mapping (Priority: P2)
As a DevSecOps engineer, I want to map the environment variables and external services needed for GCP and Firebase integration.

**Why this priority**: High. Prevents configuration drift and clarifies infra needs.

**Independent Test**: Review of `diagnosis.md` infra section.

**Acceptance Scenarios**:
1. **Given** the GCP choice, **When** reviewed, **Then** all required assets (Buckets, DB, Firebase Auth) MUST be listed.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Mapping of all project modules and their responsibilities.
- **FR-002**: Audit of current authentication and data persistence mechanisms.
- **FR-003**: Definition of required environment variables for a multi-service environment.
- **FR-004**: Identification of external cloud services (GCP/Firebase) required for production.
- **FR-005**: Documentation of the core technology stack.


### Key Entities

- **User**: Name, Email, Hash, Role (Host/Guest), Phone.
- **Space**: Location, Price, Title, Description, HostID.
- **Reservation**: SpaceID, GuestID, Status, Dates, TotalPrice, PlatformCommission, HostNetPrice, WompiRef.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Delivery of a complete `spec.md` mapping 100% of the key directories identified by `ls -R`.
- **SC-002**: List of [NEEDS CLARIFICATION] items if the connection between layers is broken or undocumented.
- **SC-003**: 100% identification of simulated mocks versus real API integrations.

## Assumptions

- The project uses `pnpm` workspace functionality for package linking.
- Mobile app (Expo) is intended to consume the same API as the Web app via `@workspace/api-client-react`.
- "Full functionality" includes readiness for live transactions in Colombia.
- Database access relies on Drizzle Kit for schema pushes/migrations.
