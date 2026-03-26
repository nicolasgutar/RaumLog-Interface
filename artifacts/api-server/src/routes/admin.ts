import { Router } from "express";
import jwt from "jsonwebtoken";
import { db, spacesTable, reservationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();
const JWT_SECRET = process.env["JWT_SECRET"] || "fallback-secret";
const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"] || "";

function requireAdmin(req: any, res: any, next: any) {
  const auth = req.headers["authorization"] as string | undefined;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "No autorizado" });
  const token = auth.slice(7);
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}

router.post("/admin/login", (req, res) => {
  const { password } = req.body as { password?: string };
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Contraseña incorrecta" });
  }
  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "8h" });
  return res.json({ token });
});

router.get("/admin/spaces", requireAdmin, async (_req, res) => {
  const spaces = await db.select().from(spacesTable).orderBy(spacesTable.createdAt);
  return res.json({ spaces });
});

router.patch("/admin/spaces/:id/status", requireAdmin, async (req, res) => {
  const id = Number(req.params["id"]);
  const { status } = req.body as { status?: string };
  if (!status || !["approved", "rejected", "pending"].includes(status)) {
    return res.status(400).json({ error: "Estado inválido" });
  }
  await db
    .update(spacesTable)
    .set({ status: status as "approved" | "rejected" | "pending", updatedAt: new Date() })
    .where(eq(spacesTable.id, id));
  return res.json({ success: true });
});

router.patch("/admin/spaces/:id/publish", requireAdmin, async (req, res) => {
  const id = Number(req.params["id"]);
  const { published } = req.body as { published?: boolean };
  await db
    .update(spacesTable)
    .set({ published: !!published, updatedAt: new Date() })
    .where(eq(spacesTable.id, id));
  return res.json({ success: true });
});

router.delete("/admin/spaces/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params["id"]);
  await db.delete(spacesTable).where(eq(spacesTable.id, id));
  return res.json({ success: true });
});

router.get("/admin/reservations", requireAdmin, async (_req, res) => {
  const reservations = await db
    .select()
    .from(reservationsTable)
    .orderBy(reservationsTable.createdAt);
  return res.json({ reservations });
});

export default router;
