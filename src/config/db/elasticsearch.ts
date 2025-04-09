import { Client } from "@elastic/elasticsearch";

// Function to create an Elasticsearch client
const createElasticsearchClient = (node: string): Client => {
  return new Client({
    node,
  });
};

// Function to test the Elasticsearch connection at startup
const testConnection = async (client: Client) => {
  try {
    await client.ping();
    console.log("Connected to Elasticsearch cluster successfully.");
    return true;
  } catch (error) {
    console.error("Error connecting to Elasticsearch:", error);
    return false;
  }
};

// Initialize Elasticsearch connection and handle failures at app startup
export const initializeElasticsearchConnection = async () => {
  const client = createElasticsearchClient(
    process.env.ELASTICSEARCH_URL || "http://localhost:9200"
  );

  // Attempt to connect once at startup
  const isConnected = await testConnection(client);
  if (!isConnected) {
    console.error("Failed to connect to Elasticsearch. Exiting application.");
    process.exit(1); // Exit if connection fails
  }
};
