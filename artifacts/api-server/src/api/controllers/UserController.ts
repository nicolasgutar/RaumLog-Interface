import { Request, Response } from 'express';
import { db, usersTable } from '@workspace/db';
import { eq } from 'drizzle-orm';

export class UserController {
  async getProfile(req: Request, res: Response) {
    try {
      const { uid } = (req as any).user;
      const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.uid, uid)
      });
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.status(200).json({ user });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async completeStep1(req: Request, res: Response) {
    try {
      const { uid } = (req as any).user;
      const { fullName, phone, role, acceptTerms } = req.body;

      if (!fullName || !phone || !acceptTerms) {
        return res.status(400).json({ error: 'Missing required fields or consent' });
      }

      const [updatedUser] = await db.update(usersTable)
        .set({ 
          name: fullName, 
          phone, 
          role: (role as any) || 'Cliente',
          isOnboardingComplete: true, // Complete after first step as requested
          updatedAt: new Date() 
        })
        .where(eq(usersTable.uid, uid))
        .returning();

      return res.status(200).json({ user: updatedUser, nextStep: 'completed' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async becomeHost(req: Request, res: Response) {
    try {
      const { uid } = (req as any).user;
      const [updatedUser] = await db.update(usersTable)
        .set({ 
          role: 'Anfitrión',
          updatedAt: new Date() 
        })
        .where(eq(usersTable.uid, uid))
        .returning();

      return res.status(200).json({ user: updatedUser });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
