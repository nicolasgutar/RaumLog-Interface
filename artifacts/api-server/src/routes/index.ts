import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adminRouter from "./admin";
import spacesRouter from "./spaces";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminRouter);
router.use(spacesRouter);

export default router;
