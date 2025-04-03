#!/bin/bash

# Create data directory if it doesn't exist
mkdir -p /opt/render/project/src/data
mkdir -p /opt/render/project/src/data/exports

# Set proper permissions
chmod 777 /opt/render/project/src/data
chmod 777 /opt/render/project/src/data/exports

# Start the server
NODE_ENV=production node server.js