#!/bin/bash

SNAPSHOT_NAME="snapshot_1"
REPO_NAME="dev_backup"
ES_URL="http://localhost:9200"
SNAPSHOT_RESPONSE=$(curl -s "$ES_URL/_snapshot/$REPO_NAME/$SNAPSHOT_NAME")

# Extract indices from the snapshot response using jq
indices=$(echo "$SNAPSHOT_RESPONSE" | jq -r '.snapshots[0].indices[]')

# First, delete all data streams
echo "🗑️ Deleting all data streams..."
curl -X DELETE "$ES_URL/_data_stream/*?expand_wildcards=all" >/dev/null

# 🗑️ Closing all indices in Elasticsearch
echo "🗑️ Closing all indices in Elasticsearch..."
curl -X POST "$ES_URL/_all/_close?expand_wildcards=all&ignore_unavailable=true" >/dev/null

# 🗑️ Deleting all indices in Elasticsearch
echo "🗑️ Deleting all indices in Elasticsearch..."
curl -X DELETE "$ES_URL/_all?expand_wildcards=all&ignore_unavailable=true" >/dev/null

# 🗑️ Force delete system indices that might still exist
echo "🗑️ Force deleting system indices (if any)..."
curl -X DELETE "$ES_URL/.kibana*?expand_wildcards=all&ignore_unavailable=true" >/dev/null
curl -X DELETE "$ES_URL/.security*?expand_wildcards=all&ignore_unavailable=true" >/dev/null
curl -X DELETE "$ES_URL/.apm*?expand_wildcards=all&ignore_unavailable=true" >/dev/null
curl -X DELETE "$ES_URL/.tasks*?expand_wildcards=all&ignore_unavailable=true" >/dev/null
curl -X DELETE "$ES_URL/.ds-*?expand_wildcards=all&ignore_unavailable=true" >/dev/null
curl -X DELETE "$ES_URL/.logs-*?expand_wildcards=all&ignore_unavailable=true" >/dev/null
curl -X DELETE "$ES_URL/.monitoring-*?expand_wildcards=all&ignore_unavailable=true" >/dev/null
curl -X DELETE "$ES_URL/.watches*?expand_wildcards=all&ignore_unavailable=true" >/dev/null
curl -X DELETE "$ES_URL/.ml-*?expand_wildcards=all&ignore_unavailable=true" >/dev/null

# 🗑️ Loop through snapshot indices and delete them if they exist
echo "🗑️ Deleting conflicting indices from snapshot... $indices"
for index in $indices; do
  # Check if the index exists and delete it
  echo "🗑️ Deleting index: $index if it exists..."
  curl -X DELETE "$ES_URL/$index?ignore_unavailable=true" >/dev/null
done

# 🟡 Restoring snapshot: $SNAPSHOT_NAME ...
echo "🟡 Restoring snapshot: $SNAPSHOT_NAME ..."
curl -X POST "$ES_URL/_snapshot/$REPO_NAME/$SNAPSHOT_NAME/_restore?wait_for_completion=true" \
  -H 'Content-Type: application/json' \
  -d '{
    "indices": "*",
    "ignore_unavailable": true,
    "include_global_state": false,
    "include_aliases": true
  }'

echo "✅ Restore complete."