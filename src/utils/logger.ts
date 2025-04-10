import ecsFormat from "@elastic/ecs-winston-format";
import { join } from "path";
import { createLogger, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const rotateTransport = new DailyRotateFile({
  dirname: join(__dirname, "../../logs"),
  filename: "app-%DATE%",
  extension: ".log",
  datePattern: "YYYY-MM-DD",
  maxFiles: 20,
  maxSize: "5m",
  auditFile: join(__dirname, "logs/audit.json"),
  format: ecsFormat({ convertReqRes: true }),
  handleExceptions: true,
});

const logger = createLogger({
  level: "info",
  format: ecsFormat({ convertReqRes: true }),
  defaultMeta: { service: "express-app" },
  transports: [rotateTransport, new transports.Console()],
});

export default logger;
