import express from "express";

import healthCheckRouter from "../features/healthCheck/routes";

const router = express.Router();

router.use("/health", healthCheckRouter);

export default router;
