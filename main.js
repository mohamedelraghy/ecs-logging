const express = require("express");
const fs = require("fs");
const path = require("path");
const winston = require("winston");
const ecsFormat = require("@elastic/ecs-winston-format");

const app = express();
const port = 3000;

// Use absolute path for Docker container
const logsDir = "/app/logs";
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Configure Winston logger with ECS format
const logger = winston.createLogger({
  level: "info",
  format: ecsFormat({ convertReqRes: true }),
  defaultMeta: { service: "express-app" },
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, "app.log"),
    }),
    new winston.transports.Console(),
  ],
});

// Add a route to generate more logs
app.get("/", (req, res) => {
  logger.info("Received request", { path: req.path });
  res.send("Hello from Express!");
});

logger.info("Server starting");
logger.error("Test error log", { err: new Error("boom") });

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
  console.log(port, "Running");
});
