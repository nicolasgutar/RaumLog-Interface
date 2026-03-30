import { Request, Response, NextFunction } from 'express';
import { adminAuth } from './FirebaseAdmin';
import { DrizzleUserRepository } from '../repositories/DrizzleUserRepository';

const userRepository = new DrizzleUserRepository();

export const firebaseAdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing ID Token' });
    return;
  }

  if (!adminAuth) {
    res.status(503).json({ error: 'Authentication service not initialized' });
    return;
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const user = await userRepository.findByUid(decodedToken.uid);

    if (!user || user.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden: Admin access required' });
      return;
    }

    (req as any).user = { ...decodedToken, ...user };
    next();
  } catch (err: any) {
    res.status(401).json({ error: 'Unauthorized: Invalid ID Token' });
    return;
  }
};
