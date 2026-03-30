import { Storage } from '@google-cloud/storage';
import path from 'path';

// For signed URLs, use the specific storage service account key
const saPath = process.env.GCS_SERVICE_ACCOUNT || process.env.FIREBASE_SERVICE_ACCOUNT;
let keyFilename: string | undefined;

if (saPath) {
  // If it's not an absolute path, try to resolve it from the root of the project
  // which is usually 2 levels up from artifacts/api-server
  keyFilename = path.isAbsolute(saPath) 
    ? saPath 
    : path.resolve(process.cwd(), '..', '..', saPath);
}

const storage = new Storage({ keyFilename });

export class GCSStorageService {
  private spacesBucket = process.env.GCS_PUBLIC_BUCKET || 'raumlog-spaces-public';
  private kycBucket = process.env.GCS_PRIVATE_BUCKET || 'raumlog-kyc-private';

  /** Generate a V4 signed URL that allows a client to PUT a file directly to GCS */
  async generateUploadSignedUrl(
    filePath: string,
    contentType: string,
    bucket: 'spaces' | 'kyc' = 'kyc',
    expiresMs = 15 * 60 * 1000
  ): Promise<string> {
    const bucketName = bucket === 'spaces' ? this.spacesBucket : this.kycBucket;
    const [url] = await storage.bucket(bucketName).file(filePath).getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + expiresMs,
      contentType,
    });
    return url;
  }

  /** Generate a V4 signed URL for reading a single file */
  async generateReadSignedUrl(
    filePath: string,
    bucket: 'spaces' | 'kyc' = 'spaces',
    expiresMs = 60 * 60 * 1000 // 1 hour default
  ): Promise<string> {
    const bucketName = bucket === 'spaces' ? this.spacesBucket : this.kycBucket;
    const [url] = await storage.bucket(bucketName).file(filePath).getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + expiresMs,
    });
    return url;
  }

  /** Batch-generate signed read URLs for multiple file paths */
  async generateReadSignedUrls(
    filePaths: string[],
    bucket: 'spaces' | 'kyc' = 'spaces',
    expiresMs = 60 * 60 * 1000
  ): Promise<Record<string, string>> {
    const results: Record<string, string> = {};
    await Promise.all(
      filePaths.map(async (filePath) => {
        try {
          results[filePath] = await this.generateReadSignedUrl(filePath, bucket, expiresMs);
        } catch {
          results[filePath] = ''; // gracefully handle missing files
        }
      })
    );
    return results;
  }

  /** Server-side upload (for small files like KYC docs sent via multipart form) */
  async uploadBuffer(
    fileBuffer: Buffer,
    filePath: string,
    contentType: string,
    bucket: 'spaces' | 'kyc' = 'kyc'
  ): Promise<string> {
    const bucketName = bucket === 'spaces' ? this.spacesBucket : this.kycBucket;
    const file = storage.bucket(bucketName).file(filePath);
    await file.save(fileBuffer, { contentType });
    return filePath; // return the GCS path, not a public URL
  }
}
