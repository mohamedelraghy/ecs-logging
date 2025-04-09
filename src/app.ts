import express from "express";
import { initializeElasticsearchConnection } from "./config/db/elasticsearch";

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize the Elasticsearch connection at app startup
initializeElasticsearchConnection();

app.get("/", (_req, res) => {
  res.json({ message: "Hello, Express + TypeScript!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
