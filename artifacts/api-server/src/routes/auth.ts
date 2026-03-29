import { Router } from 'express';
import { AuthController } from '../api/controllers/AuthController';
import { firebaseAuthMiddleware } from '../infrastructure/auth/FirebaseMiddleware';

const router = Router();
const authController = new AuthController();

// Public auth endpoints
router.post('/auth/verify-token', (req, res) => authController.verifyToken(req, res));
router.post('/auth/register', (req, res) => authController.register(req, res));

// Protected profile endpoint (example)
router.get('/auth/me', firebaseAuthMiddleware, (req, res) => {
    return res.json({ user: (req as any).user });
});

export default router;
