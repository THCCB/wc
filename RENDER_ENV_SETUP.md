# Environment Variables Setup for Render.com Deployment

This guide explains how to configure the required environment variables for deploying the Welfare Committee Form application on Render.com.

## Required Environment Variables

When deploying to Render.com, you need to configure the following environment variables in the Render dashboard:

### 1. PORT

```
PORT=10000
```

**Purpose**: Specifies the port on which your application will run. Render uses port 10000 by default for web services.

### 2. NODE_ENV

```
NODE_ENV=production
```

**Purpose**: Tells the application to run in production mode, which enables optimizations and serves the static frontend files.

### 3. DATABASE_URL

```
DATABASE_URL=/opt/render/project/src/data/welfare_committee.db
```

**Purpose**: Specifies the location of your SQLite database file. 

**Note**: Since you're using SQLite (a file-based database), you should store the database file on Render's persistent disk. The path above assumes you've created a persistent disk mounted at `/opt/render/project/src/data/`.

### 4. FRONTEND_URL

```
FRONTEND_URL=https://your-app-name.onrender.com
```

**Purpose**: Used for CORS configuration to allow requests from your frontend. Replace `your-app-name` with the actual name of your Render service.

### 5. VITE_API_URL

```
VITE_API_URL=https://your-app-name.onrender.com
```

**Purpose**: Used by the frontend to know where to send API requests. This should be the same as your application's URL.

### 6. UPLOADS_DIR (Optional)

```
UPLOADS_DIR=/opt/render/project/src/data/uploads
```

**Purpose**: Specifies where uploaded files (like photos) will be stored. Using the persistent disk ensures uploads aren't lost when the service restarts.

### 7. EXPORTS_DIR (Optional)

```
EXPORTS_DIR=/opt/render/project/src/data/exports
```

**Purpose**: Specifies where exported files (like Excel reports) will be stored.

## Setting Up Environment Variables on Render.com

1. In your Render dashboard, select your web service
2. Go to the "Environment" tab
3. Add each of the environment variables listed above
4. Click "Save Changes"

## Setting Up Persistent Disk

For SQLite database and file uploads to persist between deployments:

1. In your Render dashboard, go to "Disks"
2. Create a new disk with at least 1GB of space
3. Mount it to your web service at path: `/opt/render/project/src/data`
4. Update your environment variables to use this path for database, uploads, and exports

## Additional Configuration

Make sure your application's code is properly set up to use these environment variables. The server.js file already uses environment variables for configuration, so no code changes should be necessary.

## Health Check Path

Render can periodically check if your application is running correctly. You can set the health check path to `/healthz` in the Render dashboard.

## Pre-Deploy Command

If you need to run database migrations or other setup before deployment, you can add a pre-deploy command in the Render dashboard.