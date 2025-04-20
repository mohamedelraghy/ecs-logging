import ecsFormat from "@elastic/ecs-winston-format";
import { join } from "path";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import Transport from "winston-transport";
import { getWss } from "../websocket";

const { combine, prettyPrint } = format;

class WsTransporter extends Transport {
  constructor() {
    super();
    //
    // Consume any custom options here. e.g.:
    // - Connection information for databases
    // - Authentication information for APIs (e.g. loggly, papertrail,
    //   logentries, etc.).
    //
  }
  log(info: any, callback: () => void) {
    // Broadcast to all other clients
    const wss = getWss();

    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(info));
      }
    });

    callback();
  }
}

const rotateTransport = new DailyRotateFile({
  dirname: join(__dirname, "../../logs"),
  filename: "app-%DATE%",
  extension: ".log",
  datePattern: "YYYY-MM-DD",
  maxFiles: 20,
  maxSize: "5m",
  auditFile: join(__dirname, "../../logs/audit.json"),
  format: ecsFormat({ convertReqRes: true, convertErr: true }),
  handleExceptions: true,
});

const logger = createLogger({
  level: "info",
  format: combine(
    ecsFormat({ convertReqRes: true, convertErr: true }),
    prettyPrint()
  ),
  defaultMeta: { service: "express-app" },
  transports: [
    rotateTransport,
    new transports.Console({}),
    new WsTransporter(),
  ],
});

export default logger;
