import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adminRouter from "./admin/index";
import spacesRouter from "./spaces";
import reservationsRouter from "./reservations";
import hostRouter from "./host";
import kycRouter from "./kyc";
import authRouter from "./auth";
import userRouter from "./userRoutes";
import storageRouter from "./storage";
import webhooksRouter from "./webhooks";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use("/user", userRouter);
router.use(storageRouter);
router.use("/admin", adminRouter);
router.use(spacesRouter);
router.use(reservationsRouter);
router.use(hostRouter);
router.use(kycRouter);
router.use("/webhooks", webhooksRouter);

export default router;
