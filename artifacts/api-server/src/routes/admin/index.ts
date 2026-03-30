import { Router } from "express";
import { AdminUserController } from "../../api/controllers/Admin/AdminUserController";
import { AdminSpaceController } from "../../api/controllers/Admin/AdminSpaceController";
import { firebaseAdminMiddleware } from "../../infrastructure/auth/FirebaseAdminMiddleware";

const router = Router();
const userController = new AdminUserController();
const spaceController = new AdminSpaceController();

// All admin routes are protected by RBAC middleware
router.use(firebaseAdminMiddleware);

// User Management
router.get("/users", (req, res) => userController.listUsers(req, res));
router.get("/users/:uid", (req, res) => userController.getUserDetails(req, res));
router.patch("/users/:uid/verify", (req, res) => userController.verifyUser(req, res));

// Space Management
router.get("/spaces", (req, res) => spaceController.listSpaces(req, res));
router.get("/spaces/:id", (req, res) => spaceController.getSpaceDetails(req, res));
router.patch("/spaces/:id/visibility", (req, res) => spaceController.toggleVisibility(req, res));
router.delete("/spaces/:id", (req, res) => spaceController.deleteSpace(req, res));

router.get("/health", (req, res) => {
  res.json({ status: "Admin API online" });
});

export default router;
