# Welfare Committee Form - Deployment Guide

This guide will help you deploy the Welfare Committee Form application to the internet so users can access and fill out the form remotely.

## Prerequisites

- A GitHub account (for code hosting)
- A Render.com, Heroku, or similar platform account (for hosting the application)
- Basic knowledge of command line operations

## Deployment Steps

### 1. Prepare Your Application for Production

#### Update Backend Configuration

Modify `server.js` to use environment variables for configuration:

```javascript
// Add these environment variables at the top of server.js
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL || join(__dirname, 'welfare_committee.db');
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Update CORS configuration
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// Update database connection to use DATABASE_URL
async function initializeDatabase() {
  db = await open({
    filename: DATABASE_URL,
    driver: sqlite3.Database
  });
  // ... rest of the function
}
```

#### Update Frontend API Calls

Create a `.env` file in the project root with:

```
VITE_API_URL=http://localhost:3000
```

Then create a config file at `src/config.js`:

```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

Update all API calls in your components to use this config:

```javascript
import { API_URL } from '../config';

// Replace all instances of 'http://localhost:3000' with API_URL
const response = await axios.post(`${API_URL}/api/submit`, form, {
  // ... rest of the code
});
```

### 2. Choose a Deployment Strategy

You have two main options:

#### Option A: Deploy Frontend and Backend Together (Recommended for Simplicity)

1. Build the frontend:
   ```bash
   npm run build
   ```

2. The server.js already has code to serve the frontend in production:
   ```javascript
   if (process.env.NODE_ENV === 'production') {
     app.use(express.static(join(__dirname, 'dist')));
     
     app.get('*', (req, res) => {
       res.sendFile(join(__dirname, 'dist', 'index.html'));
     });
   }
   ```

#### Option B: Deploy Frontend and Backend Separately

This gives more flexibility but requires more configuration.

### 3. Database Considerations

For a production environment, consider:

- Using a managed database service instead of SQLite (PostgreSQL, MySQL)
- Implementing proper backup strategies
- If keeping SQLite, ensure the database file is in a persistent storage location

### 4. File Upload Handling

Update the file upload configuration for production:

```javascript
// In server.js
const uploadsDir = process.env.UPLOADS_DIR || join(__dirname, 'uploads');
```

Ensure the uploads directory is properly configured on your hosting platform.

### 5. Deploy to Render.com (Recommended Option)

1. Push your code to a GitHub repository

2. Sign up for Render.com

3. Create a new Web Service:
   - Connect your GitHub repository
   - Set build command: `npm install && npm run build`
   - Set start command: `NODE_ENV=production node server.js`
   - Add environment variables:
     - `PORT`: 10000 (Render uses this port by default)
     - `NODE_ENV`: production
     - `DATABASE_URL`: (if using external database)
     - `FRONTEND_URL`: Your application URL (once deployed)

4. Create a persistent disk for uploads and database:
   - In Render dashboard, create a disk and mount it to your service
   - Set mount path to `/opt/render/project/src/data`
   - Update your code to use this path for uploads and database

### 6. Alternative: Deploy to Heroku

1. Install Heroku CLI and login

2. Create a `Procfile` in your project root:
   ```
   web: node server.js
   ```

3. Add a `engines` field to package.json:
   ```json
   "engines": {
     "node": "18.x"
   }
   ```

4. Deploy to Heroku:
   ```bash
   heroku create welfare-committee-form
   git push heroku main
   ```

5. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   ```

### 7. Testing Your Deployment

After deployment:

1. Test form submission with various data
2. Verify file uploads work correctly
3. Test admin login and dashboard functionality
4. Check mobile responsiveness

### 8. Domain Configuration (Optional)

To use a custom domain:

1. Purchase a domain from a registrar (Namecheap, GoDaddy, etc.)
2. Configure DNS settings according to your hosting provider's instructions
3. Update your application's environment variables to use the new domain

## Troubleshooting

- **Database Issues**: Check database connection string and permissions
- **File Upload Problems**: Verify upload directory exists and has proper permissions
- **CORS Errors**: Ensure CORS configuration includes your frontend domain
- **Build Failures**: Check build logs for errors and missing dependencies

## Security Considerations

- Implement HTTPS for all traffic
- Consider adding rate limiting for form submissions
- Regularly update dependencies
- Implement proper authentication for admin access
- Consider adding CSRF protection

## Maintenance

- Set up monitoring for your application
- Implement regular database backups
- Create a process for updating the application

By following this guide, your Welfare Committee Form should be successfully deployed and accessible to users over the internet.