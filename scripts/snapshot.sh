#!/bin/bash

SNAPSHOT_NAME="snapshot_1"

echo "🗑️ Deleting old snapshot (if any): $SNAPSHOT_NAME ..."
curl -s -X DELETE "http://localhost:9200/_snapshot/dev_backup/$SNAPSHOT_NAME" >/dev/null

echo "🟢 Creating snapshot: $SNAPSHOT_NAME ..."
curl -X PUT "http://localhost:9200/_snapshot/dev_backup/$SNAPSHOT_NAME?wait_for_completion=true" \
  -H 'Content-Type: application/json' \
  -d '{
    "indices": "*",  
    "ignore_unavailable": true,
    "include_global_state": true
  }'

echo "✅ Snapshot complete."
