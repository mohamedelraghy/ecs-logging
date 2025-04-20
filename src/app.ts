import "dotenv/config";
import express, { Request, Response } from "express";
import { createServer } from "http";

import client from "./config/db/elasticsearch";
import routes from "./routes";
import { initWebSocketServer } from "./websocket";

const app = express();
const PORT = process.env.PORT || 3000;

const server = createServer(app);
initWebSocketServer(server);

// Middleware to parse JSON request bodies
app.use(express.json());

app.use("/api/v1", routes);

// Endpoint to insert a record into Elasticsearch
app.post("/insert", async (req: Request, res: Response) => {
  const { index, document } = req.body; // Expect index and document in the request body

  // Validate if index and document are provided
  if (!index || !document) {
    res.status(400).json({ message: "Index and document are required." });
  }

  try {
    // Insert the document into Elasticsearch
    const response = await client.index({
      index, // The Elasticsearch index to insert into
      body: document, // The document to insert
    });

    // Log success message
    console.log("Record inserted into Elasticsearch:", response);

    // Return success response
    res.status(201).json({
      message: "Record inserted successfully",
      data: response,
    });
  } catch (error) {
    // Log error and return failure response
    console.error("Error inserting document into Elasticsearch:", error);
    res.status(500).json({ message: "Error inserting document", error });
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
