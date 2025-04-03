# Deployment Guide for Render.com with MongoDB Atlas

## Overview

This guide provides step-by-step instructions for deploying the Welfare Committee Form application on Render.com using MongoDB Atlas as the database. The application has been configured to work with both MongoDB Atlas as the primary database and SQLite as a fallback option.

## Prerequisites

1. A Render.com account
2. A MongoDB Atlas account
3. The application code pushed to a Git repository (GitHub, GitLab, etc.)

## Step 1: Set Up MongoDB Atlas

1. Log in to your MongoDB Atlas account at [https://cloud.mongodb.com/](https://cloud.mongodb.com/)
2. Create a new project (if needed)
3. Create a new cluster (the free tier is sufficient for testing)
4. Once the cluster is created, click on "Connect"
5. Choose "Connect your application"
6. Select "Node.js" as the driver and copy the connection string
7. Replace `<password>` in the connection string with your actual password

## Step 2: Configure Render.com

1. Log in to your Render.com account
2. Click on "New" and select "Web Service"
3. Connect your Git repository
4. Configure the service with the following settings:
   - **Name**: welfare-committee-form (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `bash init-data-dir.sh`

5. Add the following environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `DATABASE_URL`: `/opt/render/project/src/data/welfare_committee.db`
   - `MONGODB_URI`: Your MongoDB Atlas connection string (from Step 1)
   - `FRONTEND_URL`: `https://welfare-committee-form.onrender.com` (replace with your actual Render URL)
   - `VITE_API_URL`: `https://welfare-committee-form.onrender.com` (replace with your actual Render URL)
   - `UPLOADS_DIR`: `/opt/render/project/src/data/uploads`
   - `EXPORTS_DIR`: `/opt/render/project/src/data/exports`

6. Add a disk:
   - **Name**: data
   - **Mount Path**: `/opt/render/project/src/data`
   - **Size**: 1 GB (or more if needed)

7. Click "Create Web Service"

## Step 3: Verify Deployment

1. Once the deployment is complete, click on the URL provided by Render.com to access your application
2. Test the form submission functionality to ensure it's working correctly
3. Check the logs in Render.com dashboard for any errors

## Troubleshooting

### MongoDB Connection Issues

If you encounter issues connecting to MongoDB Atlas, check the following:

1. Ensure the MongoDB Atlas connection string is correct
2. Verify that your IP address is whitelisted in MongoDB Atlas (or set it to allow access from anywhere for testing)
3. Check the Render.com logs for specific error messages

### SSL/HTTPS Issues

If you encounter SSL/HTTPS issues, check the following:

1. Ensure all environment variables are correctly set
2. Verify that the `FRONTEND_URL` and `VITE_API_URL` are using HTTPS
3. Check the browser console for any SSL-related errors

### Data Migration

If you need to migrate data from SQLite to MongoDB Atlas, you can use the provided script:

```bash
node scripts/migrate-to-mongodb.js
```

## Additional Resources

- [Render.com Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Node.js Deployment Guide](https://render.com/docs/deploy-node-express-app)