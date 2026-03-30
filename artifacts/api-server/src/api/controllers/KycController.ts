import { Request, Response } from 'express';
import { GCSStorageService } from '../../infrastructure/storage/GCSStorageService';
import { db, usersTable } from '@workspace/db';
import { eq } from 'drizzle-orm';

const gcsService = new GCSStorageService();

export class KycController {
  async uploadKyc(req: Request, res: Response) {
    try {
      const { uid } = (req as any).user;
      const { type } = req.body; // e.g., 'CEDULA', 'RUT'
      const file = (req as any).file; // From multer or similar middleware

      if (!file || !type) {
        return res.status(400).json({ error: 'Missing file or document type' });
      }

      const fileName = `${uid}/${type}-${Date.now()}-${file.originalname}`;
      const storagePath = await gcsService.uploadBuffer(file.buffer, fileName, file.mimetype, 'kyc');

      // In a real scenario, we might want a separate kyc_documents table
      // For now, update user status to pending verification
      await db.update(usersTable)
        .set({ isOnboardingComplete: true, updatedAt: new Date() })
        .where(eq(usersTable.uid, uid));

      return res.status(200).json({ status: 'Pending', path: storagePath });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
