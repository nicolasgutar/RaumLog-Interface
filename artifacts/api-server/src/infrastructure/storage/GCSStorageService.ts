import { Storage } from '@google-cloud/storage';

const storage = new Storage(); // Uses ADC locally

export class GCSStorageService {
  private publicBucket = process.env.GCS_PUBLIC_BUCKET || 'raumlog-spaces-public';
  private privateBucket = process.env.GCS_PRIVATE_BUCKET || 'raumlog-kyc-private';

  async uploadFile(fileBuffer: Buffer, fileName: string, isPrivate: boolean = true) {
    const bucketName = isPrivate ? this.privateBucket : this.publicBucket;
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    await file.save(fileBuffer);

    if (!isPrivate) {
      // Return public URL
      return `https://storage.googleapis.com/${bucketName}/${fileName}`;
    }

    // Return GCS path for private storage
    return `gs://${bucketName}/${fileName}`;
  }

  async getSignedUrl(fileName: string, isPrivate: boolean = true) {
     const bucketName = isPrivate ? this.privateBucket : this.publicBucket;
     const [url] = await storage.bucket(bucketName).file(fileName).getSignedUrl({
       version: 'v4',
       action: 'read',
       expires: Date.now() + 15 * 60 * 1000, // 15 minutes
     });
     return url;
  }
}
