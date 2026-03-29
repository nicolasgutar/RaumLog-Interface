import { Router } from 'express';
import { UserController } from '../api/controllers/UserController';
import { firebaseAuthMiddleware } from '../infrastructure/auth/FirebaseMiddleware';

const router = Router();
const userController = new UserController();

router.get('/profile', firebaseAuthMiddleware, (req, res) => userController.getProfile(req, res));
router.post('/onboarding/step1', firebaseAuthMiddleware, (req, res) => userController.completeStep1(req, res));

export default router;
