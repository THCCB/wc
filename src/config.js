// Configuration file for environment-specific settings

// API URL - uses environment variable in production or falls back to localhost in development
// Always use HTTPS for secure communication
export const API_URL = import.meta.env.VITE_API_URL || 'https://ddcwc.forms.onrender.com';

// Import https for SSL configuration
import https from 'https';

// SSL Configuration
export const axiosConfig = {
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  // SSL/TLS Configuration with proper https.Agent instance
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, // Temporarily disable SSL verification for development
    secureProtocol: 'TLS_method',
    minVersion: 'TLSv1.2',
    ciphers: 'HIGH:!aNULL:!MD5'
  })
};