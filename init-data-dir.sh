#!/bin/bash

# Wait for disk mount to be ready
sleep 10

# Set base directory
BASE_DIR="/opt/render/project/src"
DATA_DIR="${BASE_DIR}/data"

# Create necessary directories with proper permissions
mkdir -p "${DATA_DIR}"
chmod 777 "${DATA_DIR}"

mkdir -p "${DATA_DIR}/exports"
chmod 777 "${DATA_DIR}/exports"

mkdir -p "${DATA_DIR}/uploads"
chmod 777 "${DATA_DIR}/uploads"

# Initialize SQLite database if it doesn't exist
DB_FILE="${DATA_DIR}/welfare_committee.db"
if [ ! -f "${DB_FILE}" ]; then
    touch "${DB_FILE}"
    chmod 666 "${DB_FILE}"
fi

# Verify directories and files exist
echo "Listing data directory contents:"
ls -la "${DATA_DIR}"

# Set environment variables
export NODE_ENV=production
export DATABASE_URL="${DB_FILE}"
export UPLOADS_DIR="${DATA_DIR}/uploads"
export EXPORTS_DIR="${DATA_DIR}/exports"

# Start the server
node server.js