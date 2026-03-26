import { Router } from "express";
import { db, spacesTable, insertSpaceSchema } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

router.get("/spaces/public", async (req, res) => {
  const { city } = req.query as { city?: string };
  let query = db
    .select()
    .from(spacesTable)
    .where(and(eq(spacesTable.status, "approved"), eq(spacesTable.published, true)));
  const spaces = await query.orderBy(spacesTable.createdAt);
  const filtered = city ? spaces.filter(s => s.city.toLowerCase().includes(city.toLowerCase())) : spaces;
  return res.json({ spaces: filtered });
});

router.get("/spaces/public/:id", async (req, res) => {
  const id = Number(req.params["id"]);
  const [space] = await db
    .select()
    .from(spacesTable)
    .where(and(eq(spacesTable.id, id), eq(spacesTable.status, "approved"), eq(spacesTable.published, true)));
  if (!space) return res.status(404).json({ error: "Espacio no encontrado" });
  return res.json({ space });
});

router.post("/spaces", async (req, res) => {
  const parsed = insertSpaceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos inválidos", details: parsed.error.issues });
  }
  const [space] = await db.insert(spacesTable).values(parsed.data).returning();
  return res.status(201).json({ space });
});

export default router;
