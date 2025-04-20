import express from "express";
import { healthCheckController } from "../controller/healthCheckController";

const router = express.Router();

router.get("/", healthCheckController);

export default router;
