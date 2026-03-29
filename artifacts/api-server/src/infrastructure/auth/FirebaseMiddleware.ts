import { Request, Response, NextFunction } from 'express';
import { adminAuth } from './FirebaseAdmin';

export const firebaseAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing ID Token' });
    return;
  }

  if (!adminAuth) {
    res.status(503).json({ error: 'Authentication service not initialized. Check server logs for FIREBASE_SERVICE_ACCOUNT.' });
    return;
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    (req as any).user = decodedToken;
    next();
  } catch (err: any) {
    res.status(401).json({ error: 'Unauthorized: Invalid ID Token' });
    return;
  }
};
