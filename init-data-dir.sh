#!/bin/bash

# Create necessary directories
mkdir -p /opt/render/project/src/data
mkdir -p /opt/render/project/src/data/exports
mkdir -p /opt/render/project/src/data/uploads

# Set proper permissions
chmod 777 /opt/render/project/src/data
chmod 777 /opt/render/project/src/data/exports
chmod 777 /opt/render/project/src/data/uploads

# Touch the database file to ensure it exists
touch /opt/render/project/src/data/welfare_committee.db
chmod 666 /opt/render/project/src/data/welfare_committee.db

# Start the server
NODE_ENV=production node server.js