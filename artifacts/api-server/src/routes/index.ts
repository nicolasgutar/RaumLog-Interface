import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adminRouter from "./admin";
import spacesRouter from "./spaces";
import reservationsRouter from "./reservations";
import hostRouter from "./host";
import kycRouter from "./kyc";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(adminRouter);
router.use(spacesRouter);
router.use(reservationsRouter);
router.use(hostRouter);
router.use(kycRouter);

export default router;
