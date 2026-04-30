import { Router } from "express";
import { createHash } from "crypto";
import { db, reservationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/wompi", async (req, res) => {
  const { event, data, sent_at, signature } = req.body;
  const eventsKey = process.env["WOMPI_EVENTS_KEY"];

  if (eventsKey && signature?.checksum) {
    const properties = Object.values(data as Record<string, unknown>).join("");
    const timestamp = Math.floor(new Date(sent_at).getTime() / 1000);
    const computed = createHash("sha256")
      .update(`${properties}${timestamp}${eventsKey}`)
      .digest("hex");
    if (computed !== signature.checksum)
      return res.status(401).json({ error: "Invalid signature" });
  }

  if (event === "transaction.updated" && (data as any)?.transaction?.status === "APPROVED") {
    const reference: string = (data as any).transaction?.reference ?? "";
    const parts = reference.split("-");
    const reservationId = parseInt(parts[1], 10);
    if (!isNaN(reservationId)) {
      await db
        .update(reservationsTable)
        .set({ status: "paid", wompiReference: reference, updatedAt: new Date() })
        .where(eq(reservationsTable.id, reservationId));
    }
  }

  return res.status(200).json({ received: true });
});

export default router;
