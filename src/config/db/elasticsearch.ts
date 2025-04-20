import { Client } from "@elastic/elasticsearch";

// Function to create an Elasticsearch client
const createElasticsearchClient = (node: string): Client => {
  return new Client({
    node: process.env.ELASTICSEARCH_URL, // Your Elastic Cloud endpoint
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME || "elastic",
      password: process.env.ELASTICSEARCH_PASSWORD || "your-password",
    },
    tls: {
      // Elastic Cloud requires SSL
      rejectUnauthorized: true,
    },
  });
};

const client = createElasticsearchClient(
  process.env.ELASTICSEARCH_URL || "http://es01:9200"
);

export default client;
