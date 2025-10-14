#!/bin/bash
set -e

echo "🟡 Waiting for Elasticsearch to start..."
until curl -s -u elastic:$ELASTIC_PASSWORD http://localhost:9200 >/dev/null; do
  sleep 3
done

echo "✅ Elasticsearch is up, creating Kibana service token..."
TOKEN=$(docker exec es01 bin/elasticsearch-service-tokens create elastic/kibana kibana-token | tail -n 1 | tr -d '\r')

if [[ -z "$TOKEN" ]]; then
  echo "❌ Failed to generate Kibana service token."
  exit 1
fi

echo "🔐 Token created successfully."
echo "KIBANA_SERVICE_TOKEN=$TOKEN" >> .env

echo "🚀 Starting Kibana..."
docker compose up -d kibana
