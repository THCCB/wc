// Health check endpoint for Render.com
// This file will be imported by server.js

export function setupHealthCheck(app) {
  // Simple health check endpoint that returns 200 OK
  app.get('/healthz', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Service is running' });
  });
  
  console.log('Health check endpoint configured at /healthz');
}