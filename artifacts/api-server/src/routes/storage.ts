import { Router } from 'express';
import { StorageController } from '../api/controllers/StorageController';
import { firebaseAuthMiddleware } from '../infrastructure/auth/FirebaseMiddleware';

const router = Router();
const storageController = new StorageController();

// Generate a signed URL for uploading a file (auth required)
router.post('/storage/upload-url', firebaseAuthMiddleware, (req, res) =>
  storageController.getUploadUrl(req, res)
);

// Generate signed read URLs for private files — auth optional (public spaces visible without login)
router.post('/storage/signed-urls', (req, res) =>
  storageController.getSignedUrls(req, res)
);

export default router;
