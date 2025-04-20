// websocket/index.ts
import type { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { handleConnection } from "./handler";

let wss: WebSocketServer | null = null;

export const initWebSocketServer = (server: Server) => {
  if (wss) return; // Already initialized

  wss = new WebSocketServer({ server });

  wss.on("connection", (ws: WebSocket) => {
    console.log("[WSS] Client connected");
    handleConnection(ws, wss!);
  });

  console.log("[WSS] WebSocket server initialized");
};

export const getWss = (): WebSocketServer => {
  if (!wss) {
    throw new Error("WebSocket server not initialized. Call initWebSocketServer() first.");
  }
  return wss;
};
