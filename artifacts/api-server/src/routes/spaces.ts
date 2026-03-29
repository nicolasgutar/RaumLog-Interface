import { Router } from "express";
import { db, spacesTable, insertSpaceSchema } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { DrizzleSpaceRepository } from "../infrastructure/repositories/DrizzleSpaceRepository";
import { SpaceService } from "../application/services/SpaceService";
import { SpaceController } from "../api/controllers/SpaceController";

const router = Router();

// Dependency Injection
const spaceRepo = new DrizzleSpaceRepository();
const spaceService = new SpaceService(spaceRepo);
const spaceController = new SpaceController(spaceService);

import { firebaseAuthMiddleware } from "../infrastructure/auth/FirebaseMiddleware";

// Marketplace Route (Paginated & Filterable)
router.get("/spaces", (req, res) => spaceController.getSpaces(req, res));
router.post("/spaces", firebaseAuthMiddleware, (req, res) => spaceController.createSpace(req, res));

export default router;
