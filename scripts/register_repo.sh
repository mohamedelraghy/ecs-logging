#!/bin/bash
curl -X PUT "http://localhost:9200/_snapshot/dev_backup" -H 'Content-Type: application/json' -d'
{
  "type": "fs",
  "settings": {
    "location": "/usr/share/elasticsearch/backup",
    "compress": true
  }
}'
