import { Router } from "express";
import jwt from "jsonwebtoken";
import { db, spacesTable, reservationsTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";

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

router.get("/admin/finanzas", requireAdmin, async (_req, res) => {
  const paidStatuses = ["paid", "in_storage", "completed"] as const;
  const allPaid = await db
    .select()
    .from(reservationsTable)
    .where(inArray(reservationsTable.status, [...paidStatuses]));

  // totalPrice = basePrice + IVA (19% of basePrice)
  // ivaCollected = totalPrice - platformCommission - hostNetPrice
  const totalRevenue = allPaid.reduce((s, r) => s + Number(r.totalPrice), 0);
  const totalCommission = allPaid.reduce((s, r) => s + Number(r.platformCommission), 0);
  const ivaOnCommission = allPaid.reduce(
    (s, r) => s + (Number(r.totalPrice) - Number(r.platformCommission) - Number(r.hostNetPrice)),
    0
  );
  const netCommissionAfterIva = totalRevenue - ivaOnCommission;

  const payoutMap: Record<string, { email: string; amount: number; count: number }> = {};
  const pendingStatuses = ["paid", "in_storage"];
  for (const r of allPaid) {
    if (!pendingStatuses.includes(r.status)) continue;
    const email = r.spaceOwnerEmail || "sin-email";
    if (!payoutMap[email]) payoutMap[email] = { email, amount: 0, count: 0 };
    payoutMap[email].amount += Number(r.hostNetPrice);
    payoutMap[email].count += 1;
  }
  const pendingPayouts = Object.values(payoutMap).sort((a, b) => b.amount - a.amount);

  const recentTransactions = allPaid
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 30)
    .map((r) => ({
      id: r.id,
      spaceTitle: r.spaceTitle,
      guestName: r.guestName,
      guestEmail: r.guestEmail,
      hostEmail: r.spaceOwnerEmail,
      totalPrice: Number(r.totalPrice),
      platformCommission: Number(r.platformCommission),
      hostNetPrice: Number(r.hostNetPrice),
      status: r.status,
      checkIn: r.checkIn,
      checkOut: r.checkOut,
      months: r.months,
      wompiReference: r.wompiReference,
      createdAt: r.createdAt,
    }));

  return res.json({
    totalRevenue,
    totalCommission,
    ivaOnCommission,
    netCommissionAfterIva,
    transactionCount: allPaid.length,
    pendingPayouts,
    recentTransactions,
  });
});

export default router;
