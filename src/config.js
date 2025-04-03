// Configuration file for environment-specific settings

// API URL - uses environment variable in production or falls back to localhost in development
// Ensure HTTPS is used in production and HTTP in development
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// SSL Configuration
export const axiosConfig = {
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  // Force using TLS 1.2 or higher
  httpsAgent: {
    secureProtocol: 'TLS_method',
    minVersion: 'TLSv1.2'
  }
};