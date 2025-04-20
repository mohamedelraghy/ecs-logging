import "dotenv/config";
import express from "express";
import { createServer } from "http";

import routes from "./routes";
import { initWebSocketServer } from "./websocket";

const app = express();
const PORT = process.env.PORT || 3000;

const server = createServer(app);
initWebSocketServer(server);

// Middleware to parse JSON request bodies
app.use(express.json());

app.use("/api/v1", routes);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
