import { adminAuth } from '../../infrastructure/auth/FirebaseAdmin';
import { usersTable } from '@workspace/db/schema';
import { db } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { AccountType } from '@workspace/api-zod/user';

export class AuthService {
  async verifyToken(idToken: string) {
    if (!adminAuth) {
      throw new Error('Firebase Admin SDK is not initialized. Please provide FIREBASE_SERVICE_ACCOUNT in .env');
    }
    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      const { uid, email, name, picture } = decodedToken;

      // Find user in local DB
      let user = await db.query.usersTable.findFirst({
        where: eq(usersTable.uid, uid)
      });

      // If not exists, create with generic role
      if (!user) {
        // We'll redirect to onboarding if no user found
        // or create with default "Cliente"
        const [newUser] = await db.insert(usersTable).values({
          uid,
          email: email || '',
          name: name || '',
          role: 'Cliente',
        }).returning();
        user = newUser;
      }

      return { user, needsOnboarding: !user.isOnboardingComplete };
    } catch (err: any) {
      throw new Error(`Authentication failed: ${err.message}`);
    }
  }

  async register(idToken: string, name?: string, role?: string) {
    if (!adminAuth) {
      throw new Error('Firebase Admin SDK is not initialized. Please provide FIREBASE_SERVICE_ACCOUNT in .env');
    }
    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      const { uid, email } = decodedToken;

      const [newUser] = await db.insert(usersTable).values({
        uid,
        email: email || '',
        name: name || '',
        role: (role as any) || 'Cliente',
      }).onConflictDoUpdate({
        target: usersTable.uid,
        set: { role: (role as any) || 'Cliente', name: name || '' }
      }).returning();

      return newUser;
    } catch (err: any) {
       throw new Error(`Registration failed: ${err.message}`);
    }
  }
}
