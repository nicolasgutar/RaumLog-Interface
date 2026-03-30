import { Router } from "express";
import { DrizzleSpaceRepository } from "../infrastructure/repositories/DrizzleSpaceRepository";
import { SpaceService } from "../application/services/SpaceService";
import { SpaceController } from "../api/controllers/SpaceController";
import { firebaseAuthMiddleware } from "../infrastructure/auth/FirebaseMiddleware";

const router = Router();
const spaceRepo = new DrizzleSpaceRepository();
const spaceService = new SpaceService(spaceRepo);
const spaceController = new SpaceController(spaceService);

// Public marketplace
router.get("/spaces", (req, res) => spaceController.getSpaces(req, res));

// Authenticated host operations
router.get("/spaces/mine", firebaseAuthMiddleware, (req, res) => spaceController.getMySpaces(req, res));
router.post("/spaces", firebaseAuthMiddleware, (req, res) => spaceController.createSpace(req, res));
router.put("/spaces/:id", firebaseAuthMiddleware, (req, res) => spaceController.updateSpace(req, res));
router.delete("/spaces/:id", firebaseAuthMiddleware, (req, res) => spaceController.deleteSpace(req, res));

export default router;
