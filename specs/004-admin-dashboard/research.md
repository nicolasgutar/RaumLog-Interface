# Research: Admin Dashboard Implementation

## Decisions

### D-001: PDF/Image Preview
- **Chosen**: Standard `<iframe>` for PDFs and `<img>` for images in a dedicated preview panel.
- **Rationale**: Browsers handle PDFs natively via iframes with good UX, and it avoids heavy third-party dependencies.
- **Alternatives**: `react-pdf` (rejected for simplicity and to keep bundle size small).

### D-002: Deletion Restriction Query
- **Chosen**: Use Drizzle `notIn` to check for active/pending reservations.
- **Rationale**: Statuses like `pending_approval`, `paid`, and `in_storage` clearly represent ongoing business obligations.
- **Query Logic**: 
  ```ts
  const ongoing = await db.select().from(reservationsTable)
    .where(and(
      eq(reservationsTable.spaceId, id),
      notInArray(reservationsTable.status, ["completed", "rejected"])
    ));
  if (ongoing.length > 0) throw Error("Active reservations exist");
  ```

### D-003: UI Framework Alignment
- **Chosen**: Tailwind CSS with Radix UI (or standard HTML5 elements) for accessibility.
- **Rationale**: High flexibility and alignment with current `FindSpace.tsx` aesthetics.

## Rationale
Ensuring robust security and operational integrity while maintaining lean frontend and backend implementations.
