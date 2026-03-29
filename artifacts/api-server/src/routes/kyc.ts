import { Router } from 'express';
import multer from 'multer';
import { KycController } from '../api/controllers/KycController';
import { firebaseAuthMiddleware } from '../infrastructure/auth/FirebaseMiddleware';

const router = Router();
const kycController = new KycController();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.post('/kyc/upload', firebaseAuthMiddleware, upload.single('document'), (req, res) => kycController.uploadKyc(req, res));

export default router;
