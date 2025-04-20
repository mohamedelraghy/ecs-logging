import { WebSocket, WebSocketServer } from "ws";

export const handleConnection = (ws: WebSocket, wss: WebSocketServer) => {
  ws.on("message", (message) => {
    console.log(`[WSS] Received: ${message}`);

    // Broadcast to all other clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`Broadcast: ${message}`);
      }
    });
  });

  ws.on("close", () => {
    console.log("[WSS] Client disconnected");
  });
};
