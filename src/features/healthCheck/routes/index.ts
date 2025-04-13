import express, { NextFunction, Request, Response } from "express";

import elasticClient from "../../../config/db/elasticsearch";

const router = express.Router();

router.get("/", async (_req: Request, res: Response, _next: NextFunction) => {
  try {
    // Option 1: Light ping check
    await elasticClient.ping();

    // Option 2: More detailed cluster health
    const health = await elasticClient.cluster.health();

    const isHealthy = ["green", "yellow"].includes(health.status); // yellow is acceptable in single-node

    if (isHealthy) {
      res.status(200).json({
        status: "ok",
        elasticsearch: health,
      });
    } else {
      res.status(503).json({
        status: "unhealthy",
        elasticsearch: health,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "❌ Failed to connect to Elasticsearch",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

export default router;
