import mongoose from 'mongoose';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// ES module support
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Get MongoDB connection string from environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/welfare_committee';
// Get SQLite database path from environment variable
const DATABASE_URL = process.env.DATABASE_URL || join(__dirname, '..', 'welfare_committee.db');

// MongoDB connection options
const options = {
  // Add any specific options if needed
};

// Connect to MongoDB with SQLite fallback
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    console.log('Attempting to use SQLite as fallback...');
    
    try {
      // Initialize SQLite database
      const db = await open({
        filename: DATABASE_URL,
        driver: sqlite3.Database
      });
      
      console.log('Successfully connected to SQLite database as fallback.');
      return db; // Return the SQLite database connection
    } catch (sqliteError) {
      console.error('Error connecting to SQLite fallback:', sqliteError.message);
      process.exit(1);
    }
  }

  // Handle connection events
  mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });

  // Handle application termination
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  });
}

export default connectDB;