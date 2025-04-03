// Configuration file for environment-specific settings

// API URL - uses environment variable in production or falls back to localhost in development
// Always use HTTPS for secure communication
export const API_URL = import.meta.env.VITE_API_URL || 'https://ddcwc.forms.onrender.com';

// Axios configuration for browser environment
export const axiosConfig = {
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
  // Note: SSL/TLS is handled automatically by the browser
  // No need for custom https configuration in browser environment
};