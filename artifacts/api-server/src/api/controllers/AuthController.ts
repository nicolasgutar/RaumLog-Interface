import { Request, Response } from 'express';
import { AuthService } from '../../application/services/AuthService';

const authService = new AuthService();

export class AuthController {
  async verifyToken(req: Request, res: Response) {
    try {
      const { idToken } = req.body;
      if (!idToken) return res.status(400).json({ error: 'Missing ID Token' });
      
      const { user, needsOnboarding } = await authService.verifyToken(idToken);
      return res.status(200).json({ user, needsOnboarding });
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { idToken, name, role } = req.body;
      if (!idToken || !role) return res.status(400).json({ error: 'Missing required fields' });
      
      const user = await authService.register(idToken, name, role);
      return res.status(201).json({ user });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
