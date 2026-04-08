import { Request, Response } from 'express';
import { GCSStorageService } from '../../infrastructure/storage/GCSStorageService';

const gcsService = new GCSStorageService();

export class StorageController {
  /**
   * POST /api/storage/upload-url
   * Body: { fileName: string, contentType: string, bucket: 'spaces' | 'kyc' }
   * Returns a signed URL the client can PUT the file to directly.
   */
  async getUploadUrl(req: Request, res: Response) {
    try {
      const { uid } = (req as any).user;
      const { fileName, contentType, bucket = 'kyc' } = req.body;

      if (!fileName || !contentType) {
        return res.status(400).json({ error: 'fileName and contentType are required' });
      }

      const allowedBuckets = ['spaces', 'kyc'];
      if (!allowedBuckets.includes(bucket)) {
        return res.status(400).json({ error: 'Invalid bucket' });
      }

      // Scope file to the user's UID to prevent collisions
      const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${uid}/${Date.now()}_${safeName}`;

      const uploadUrl = await gcsService.generateUploadSignedUrl(filePath, contentType, bucket);

      return res.json({ uploadUrl, filePath });
    } catch (err: any) {
      console.error('Error generating upload URL:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  /**
   * POST /api/storage/signed-urls
   * Body: { paths: string[], bucket: 'spaces' | 'kyc' }
   * Returns signed read URLs for viewing private files.
   */
  async getSignedUrls(req: Request, res: Response) {
    try {
      const { paths, bucket = 'spaces' } = req.body;

      if (!Array.isArray(paths) || paths.length === 0) {
        return res.json({ urls: {} });
      }

      if (paths.length > 100) {
        return res.status(400).json({ error: 'Maximum 100 paths per request' });
      }

      const urls = await gcsService.generateReadSignedUrls(paths, bucket);
      return res.json({ urls });
    } catch (err: any) {
      console.error('Error generating signed URLs:', err);
      return res.status(500).json({ error: err.message });
    }
  }
}
