import express, { NextFunction, Request, Response } from "express";
import logger from "../../../utils/logger";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  logger.info("Payment route hit", { req, res, geo: req.geo });
  res.status(200).json({ message: "Payment route hit" });
});

export default router;
