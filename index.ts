import { Router, type IRouter } from "express";
import healthRouter from "./health";
import foodAnalyzeRouter from "./food-analyze";

const router: IRouter = Router();

router.use(healthRouter);
router.use(foodAnalyzeRouter);

export default router;
