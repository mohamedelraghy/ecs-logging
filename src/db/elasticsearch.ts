import { Client } from "@elastic/elasticsearch";

// Function to create an Elasticsearch client
const createElasticsearchClient = (node: string): Client => {
  return new Client({
    node,
  });
};

const client = createElasticsearchClient(
  process.env.ELASTICSEARCH_URL || "http://es01:9200"
);

export default client;
