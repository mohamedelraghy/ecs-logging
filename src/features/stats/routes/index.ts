import express from "express";
import { logsCountController } from "../controller/logsCountController";

const router = express.Router();

router.get("/log-count", logsCountController);

export default router;
