// Configuration file for environment-specific settings

// API URL - uses environment variable in production or falls back to localhost in development
// Always use HTTPS for secure communication
export const API_URL = import.meta.env.VITE_API_URL || 'https://ddcwc.forms.onrender.com';

// Ensure API URL always uses HTTPS in production
if (import.meta.env.PROD && !API_URL.startsWith('https://')) {
  console.warn('API_URL should use HTTPS in production for security');
}

// Axios configuration for browser environment
export const axiosConfig = {
  withCredentials: false, // Set to false to avoid CORS issues
  timeout: 30000, // Increased timeout for larger form data
  headers: {
    'Content-Type': 'application/json'
  },
  // Essential settings for secure HTTPS communication
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  },
  maxRedirects: 5
  // Remove Node.js specific SSL/TLS Configuration that doesn't work in browsers
  // Browser will handle SSL/TLS negotiation automatically
};