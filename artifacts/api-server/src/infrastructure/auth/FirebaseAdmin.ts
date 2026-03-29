import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT;
let serviceAccount: any = null;

if (serviceAccountStr) {
  if (serviceAccountStr.endsWith('.json')) {
    try {
        // Find project root by searching for package.json
        let currentDir = process.cwd();
        let projectRoot = currentDir;
        for (let i = 0; i < 5; i++) {
            if (fs.existsSync(path.join(currentDir, 'package.json')) && 
                fs.existsSync(path.join(currentDir, 'pnpm-workspace.yaml'))) {
                projectRoot = currentDir;
                break;
            }
            const parent = path.dirname(currentDir);
            if (parent === currentDir) break;
            currentDir = parent;
        }

        let filePath = path.isAbsolute(serviceAccountStr) ? serviceAccountStr : path.join(projectRoot, serviceAccountStr);
        
        if (!fs.existsSync(filePath)) {
            // Backup: try looking in current process.cwd if it's different
            const backupPath = path.join(process.cwd(), serviceAccountStr);
            if (fs.existsSync(backupPath)) {
                filePath = backupPath;
            } else {
                // Secondary backup: try looking in parent of projectRoot (sometimes root is one level up)
                const secondaryPath = path.join(path.dirname(projectRoot), serviceAccountStr);
                if (fs.existsSync(secondaryPath)) {
                    filePath = secondaryPath;
                } else {
                    throw new Error(`Could not find Firebase Service Account file at ${filePath} or backups. Project root found at: ${projectRoot}`);
                }
            }
        }

        console.log(`Loading Firebase Service Account from: ${filePath}`);
        const data = fs.readFileSync(filePath, 'utf8');
        serviceAccount = JSON.parse(data);
    } catch (e: any) {
        console.error(`ERROR: Failed to read Firebase Service Account from file: "${serviceAccountStr}". ${e.message}`);
    }
  } else {
    try {
      serviceAccount = JSON.parse(serviceAccountStr);
    } catch (e) {
      console.error("ERROR: FIREBASE_SERVICE_ACCOUNT environment variable is not valid JSON string.");
    }
  }
}

// Global initialization
if (getApps().length === 0 && serviceAccount) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.GCS_BUCKET_NAME || 'raumlog-spaces-public'
  });
}

// Exported instances
export const firebaseAdmin = admin;
export const adminAuth = getApps().length > 0 ? getAuth() : null as any;
export const adminStorage = getApps().length > 0 ? getStorage() : null as any;
