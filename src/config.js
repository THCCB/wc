// Configuration file for environment-specific settings

// API URL - uses environment variable in production or falls back to localhost in development
// Always use HTTPS for secure communication
export const API_URL = import.meta.env.VITE_API_URL || 'https://ddcwc.forms.onrender.com';

// SSL Configuration
export const axiosConfig = {
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  // SSL/TLS Configuration
  httpsAgent: {
    rejectUnauthorized: false, // Temporarily disable SSL verification for development
    secureProtocol: 'TLS_method',
    minVersion: 'TLSv1.2',
    ciphers: 'HIGH:!aNULL:!MD5'
  }
};