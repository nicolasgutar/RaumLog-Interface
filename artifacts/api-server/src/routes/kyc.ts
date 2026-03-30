import { Router } from 'express';
import multer from 'multer';
import { KycController } from '../api/controllers/KycController';
import { firebaseAuthMiddleware } from '../infrastructure/auth/FirebaseMiddleware';
import { db, usersTable, kycSubmissionsTable } from '@workspace/db';
import { eq } from 'drizzle-orm';

const router = Router();
const kycController = new KycController();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Server-side multipart upload (legacy / fallback)
router.post('/kyc/upload', firebaseAuthMiddleware, upload.single('document'), (req, res) => kycController.uploadKyc(req, res));

// Store GCS paths after client-side direct upload
router.post('/kyc/save-paths', firebaseAuthMiddleware, async (req, res) => {
  try {
    const { uid } = (req as any).user;
    const { cedula, soporte } = req.body;

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.uid, uid)
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Upsert submission
    const existing = await db.query.kycSubmissionsTable.findFirst({
        where: eq(kycSubmissionsTable.hostEmail, user.email)
    });

    if (existing) {
        await db.update(kycSubmissionsTable)
            .set({ 
                cedulaData: cedula || existing.cedulaData,
                rutData: soporte || existing.rutData,
                updatedAt: new Date() 
            })
            .where(eq(kycSubmissionsTable.id, existing.id));
    } else {
        await db.insert(kycSubmissionsTable).values({
            hostEmail: user.email,
            hostName: user.name || 'Unknown',
            hostPhone: user.phone || 'Unknown',
            cedulaData: cedula || '',
            rutData: soporte || '',
            status: 'pending'
        });
    }

    // Mark user onboarding complete for second step
    await db.update(usersTable)
      .set({ isOnboardingComplete: true, updatedAt: new Date() })
      .where(eq(usersTable.uid, uid));

    return res.json({ success: true, cedula, soporte });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
