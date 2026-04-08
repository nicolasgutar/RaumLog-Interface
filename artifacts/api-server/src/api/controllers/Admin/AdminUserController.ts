import { Request, Response } from 'express';
import { DrizzleUserRepository } from '../../../infrastructure/repositories/DrizzleUserRepository';
import { GCSStorageService } from '../../../infrastructure/storage/GCSStorageService';
import { AdminUserListQuerySchema } from '../../../../../../lib/api-zod/src/index';

const userRepository = new DrizzleUserRepository();
const storageService = new GCSStorageService();

export class AdminUserController {
  async listUsers(req: Request, res: Response) {
    try {
      const parsed = AdminUserListQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.format() });
      }

      const { limit, offset, search, sortBy } = parsed.data;

      const result = await userRepository.findAllPaginated({
        limit,
        offset,
        search,
        sortBy
      });

      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async verifyUser(req: Request, res: Response) {
    try {
      const uid = req.params.uid as string;
      const { isVerified } = req.body;

      if (typeof isVerified !== 'boolean') {
        return res.status(400).json({ error: 'isVerified must be a boolean' });
      }

      const updated = await userRepository.updateVerification(uid, isVerified);
      if (!updated) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({ user: updated });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async getUserDetails(req: Request, res: Response) {
    try {
      const uid = req.params.uid as string;
      const user = await userRepository.findByUid(uid);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Sign KYC URLs if present
      if (user.kyc) {
        if (user.kyc.cedulaData) {
            try {
                user.kyc.cedulaData = await storageService.generateReadSignedUrl(user.kyc.cedulaData, 'kyc');
            } catch { /* skip if failing */ }
        }
        if (user.kyc.rutData) {
            try {
                user.kyc.rutData = await storageService.generateReadSignedUrl(user.kyc.rutData, 'kyc');
            } catch { /* skip if failing */ }
        }
      }

      return res.status(200).json({ user });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
