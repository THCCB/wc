#!/bin/bash

# Wait for disk mount to be ready
sleep 5

# Create necessary directories with proper permissions
mkdir -p /opt/render/project/src/data
chmod 755 /opt/render/project/src/data

mkdir -p /opt/render/project/src/data/exports
chmod 755 /opt/render/project/src/data/exports

mkdir -p /opt/render/project/src/data/uploads
chmod 755 /opt/render/project/src/data/uploads

# Initialize SQLite database if it doesn't exist
if [ ! -f /opt/render/project/src/data/welfare_committee.db ]; then
    touch /opt/render/project/src/data/welfare_committee.db
    chmod 644 /opt/render/project/src/data/welfare_committee.db
fi

# Verify directories and files exist
ls -la /opt/render/project/src/data

# Start the server
NODE_ENV=production node server.js