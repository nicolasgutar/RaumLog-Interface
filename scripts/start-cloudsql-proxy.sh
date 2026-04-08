#!/bin/bash
set -e

PROXY_BIN="./cloud-sql-proxy"
PROXY_VERSION="v2.15.2"
PROXY_URL="https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/${PROXY_VERSION}/cloud-sql-proxy.linux.amd64"

# Download proxy binary if not present
if [ ! -f "$PROXY_BIN" ]; then
  echo "[cloud-sql-proxy] Downloading ${PROXY_VERSION}..."
  curl -sSL -o "$PROXY_BIN" "$PROXY_URL"
  chmod +x "$PROXY_BIN"
  echo "[cloud-sql-proxy] Downloaded."
fi

# Write service account JSON from environment secret to a temp file
if [ -z "$FIREBASE_SERVICE_ACCOUNT" ]; then
  echo "[cloud-sql-proxy] ERROR: FIREBASE_SERVICE_ACCOUNT secret is not set."
  exit 1
fi

SA_FILE="/tmp/sa.json"
echo "$FIREBASE_SERVICE_ACCOUNT" > "$SA_FILE"

INSTANCE="${CLOUD_SQL_INSTANCE_CONNECTION_NAME:-raumlog:us-central1:raumlog-db}"

echo "[cloud-sql-proxy] Starting proxy for ${INSTANCE} on port 5432..."
GOOGLE_APPLICATION_CREDENTIALS="$SA_FILE" exec "$PROXY_BIN" \
  --port=5432 \
  "$INSTANCE"
