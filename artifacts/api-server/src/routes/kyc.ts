import { Router } from "express";
import { db, kycSubmissionsTable, insertKycSchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env["JWT_SECRET"] || "fallback-secret";

function requireAdmin(req: any, res: any, next: any) {
  const auth = req.headers["authorization"] as string | undefined;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "No autorizado" });
  try {
    jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}

router.post("/kyc", async (req, res) => {
  const parsed = insertKycSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Datos inválidos", details: parsed.error.issues });
  }
  const [kyc] = await db.insert(kycSubmissionsTable).values(parsed.data).returning();
  return res.status(201).json({ kyc });
});

router.get("/admin/kyc", requireAdmin, async (_req, res) => {
  const submissions = await db
    .select()
    .from(kycSubmissionsTable)
    .orderBy(kycSubmissionsTable.createdAt);
  return res.json({ submissions });
});

router.patch("/admin/kyc/:id/status", requireAdmin, async (req, res) => {
  const id = Number(req.params["id"]);
  const { status, adminNotes } = req.body as { status?: string; adminNotes?: string };
  if (!status || !["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Estado inválido" });
  }
  await db
    .update(kycSubmissionsTable)
    .set({
      status: status as "approved" | "rejected",
      adminNotes: adminNotes || "",
      updatedAt: new Date(),
    })
    .where(eq(kycSubmissionsTable.id, id));
  return res.json({ success: true });
});

export default router;
