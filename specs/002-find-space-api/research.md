# Research: Find Space API Integration

## Decision 1: Repository Pattern for Drizzle
- **Decision**: Implement a **`SpaceRepository`** interface in the Domain/Application layer and a **`DrizzleSpaceRepository`** in the Infrastructure layer.
- **Rationale**: Direct usage of Drizzle in controllers violates Clean Architecture (Dependency Inversion). By using an interface, we can mock the database for unit testing and keep business logic decoupled from the ORM.
- **Alternatives considered**: Direct Drizzle access in services (rejected to maintain strict SOLID/Clean compliance as mandated by the Constitution).

## Decision 2: Pagination Strategy
- **Decision**: Traditional **Offset-based pagination** using `limit()` and `offset()` in Drizzle.
- **Rationale**: The specification requires simple "Next" navigation and a "Page X of Y" style, which offset-based pagination handles naturally.
- **Efficient Count**: We will use a separate `count()` query or `SQL` fragment to get the total number of records for the metadata wrapper.

## Decision 3: Modular React Components (SOLID)
- **Decision**: Partition `FindSpace.tsx` into:
    - `components/Listing/SpaceCard.tsx`: Single Responsibility (Display).
    - `components/Listing/FilterSidebar.tsx`: Single Responsibility (Filtering state).
    - `hooks/useSpaces.ts`: Interface Segregation (Data fetching logic).
    - `services/SpaceService.ts`: Adaptation layer between API and UI.
- **Rationale**: Aligns with the Open/Closed principle (easy to add new filters) and Single Responsibility.

## Decision 4: Shared Schemas (Unified Source of Truth)
- **Decision**: Update `lib/db/src/schema/spaces.ts` and ensure the Zod validation schemas in `lib/api-zod` are updated accordingly.
- **Rationale**: Follows Constitution Principle I to prevent drift between API and Frontend.
