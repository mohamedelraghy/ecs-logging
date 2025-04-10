import { Client } from "@elastic/elasticsearch";

// Function to create an Elasticsearch client
const createElasticsearchClient = (node: string): Client => {
  return new Client({
    node,
  });
};

// Function to test the Elasticsearch connection at startup
const testConnection = async (client: Client, retries = 5, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await client.ping();
      console.log("✅ Connected to Elasticsearch cluster successfully.");
      return true;
    } catch (error) {
      console.error(
        `❌ Elasticsearch connection failed (attempt ${i + 1}/${retries})`
      );
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  console.error("❌ Failed to connect to Elasticsearch after retries.");
  return false;
};
const client = createElasticsearchClient(
  process.env.ELASTICSEARCH_URL || "http://es01:9200"
);

// Initialize Elasticsearch connection and handle failures at app startup
export const initializeElasticsearchConnection = async () => {
  // Attempt to connect once at startup
  const isConnected = await testConnection(client);
  if (!isConnected) {
    console.error("Failed to connect to Elasticsearch. Exiting application.");
    process.exit(1); // Exit if connection fails
  }
};
// Export the client for use in other parts of the application
export { client };
