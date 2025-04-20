import express from "express";

import healthCheckRouter from "../features/healthCheck/routes";
import statsRouter from "../features/stats/routes";

const router = express.Router();

router.use("/health", healthCheckRouter);
router.use("/stats", statsRouter);

export default router;
