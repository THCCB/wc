# Welfare Committee Form - Deployment Steps

Your application has been successfully built and is ready for deployment. Follow these steps to deploy to Render.com:

## 1. Git Setup

1. Download and install Git from https://git-scm.com/download/win
2. Open a new command prompt and initialize your repository:
   ```
   git init
   ```
3. Create a .gitignore file to exclude unnecessary files:
   ```
   node_modules
   .env
   welfare_committee.db
   ```

## 2. GitHub Repository Setup

1. Go to GitHub.com and create a new repository
2. Connect your local repository to GitHub:
   ```
   git remote add origin YOUR_GITHUB_REPO_URL
   ```
3. Add your files, commit, and push to GitHub:
   ```
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

## 3. Render.com Deployment

As outlined in your DEPLOYMENT_GUIDE.md:

1. Sign up for Render.com
2. Create a new Web Service:
   - Connect your GitHub repository
   - Set build command: `npm install && npm run build`
   - Set start command: `NODE_ENV=production node server.js`
   - Add environment variables:
     - PORT: 10000
     - NODE_ENV: production
     - DATABASE_URL: /opt/render/project/src/data/welfare_committee.db (for SQLite on persistent disk)
     - FRONTEND_URL: Your application URL (once deployed)

3. Create a persistent disk for uploads and database:
   - In Render dashboard, create a disk and mount it to your service
   - Set mount path to `/opt/render/project/src/data`
   - Update your code to use this path for uploads and database

## 4. Testing Your Deployment

After deployment:
1. Test form submission with various data
2. Verify file uploads work correctly
3. Test admin login and dashboard functionality
4. Check mobile responsiveness

Refer to your DEPLOYMENT_GUIDE.md for more detailed instructions.