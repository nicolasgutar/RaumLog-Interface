import { Router } from "express";
import { db, spacesTable, insertSpaceSchema } from "@workspace/db";

const router = Router();

router.post("/spaces", async (req, res) => {
  const parsed = insertSpaceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos inválidos", details: parsed.error.issues });
  }
  const [space] = await db.insert(spacesTable).values(parsed.data).returning();
  return res.status(201).json({ space });
});

export default router;
