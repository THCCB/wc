// Configuration file for environment-specific settings

// API URL - uses environment variable in production or falls back to localhost in development
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';