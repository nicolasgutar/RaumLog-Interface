import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();
const JWT_SECRET = process.env["JWT_SECRET"] || "fallback-secret";

function signUserToken(user: { id: number; email: string; name: string; role: string }) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function requireUser(req: any, res: any, next: any) {
  const auth = req.headers["authorization"] as string | undefined;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "No autenticado" });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

router.post("/auth/register", async (req, res) => {
  const { email, password, name, phone, role } = req.body as {
    email?: string; password?: string; name?: string; phone?: string; role?: string;
  };

  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  if (!["host", "guest"].includes(role)) {
    return res.status(400).json({ error: "Rol inválido" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });
  }

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
  if (existing.length > 0) {
    return res.status(409).json({ error: "Ya existe una cuenta con este correo electrónico" });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db.insert(usersTable).values({
    email: email.toLowerCase(),
    passwordHash,
    name,
    phone: phone || "",
    role: role as "host" | "guest",
  }).returning();

  const token = signUserToken(user);
  return res.status(201).json({
    token,
    user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role },
  });
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
  if (!user) {
    return res.status(401).json({ error: "Correo o contraseña incorrectos" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Correo o contraseña incorrectos" });
  }

  const token = signUserToken(user);
  return res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role },
  });
});

router.get("/auth/me", requireUser, async (req: any, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id));
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  return res.json({
    user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role },
  });
});

export default router;
