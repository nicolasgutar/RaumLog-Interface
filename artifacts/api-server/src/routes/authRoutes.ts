import { Router } from 'express';
import { AuthController } from '../api/controllers/AuthController';

const router = Router();
const authController = new AuthController();

// Authentication endpoints
router.post('/verify-token', (req, res) => authController.verifyToken(req, res));
router.post('/register', (req, res) => authController.register(req, res));

export default router;
