import mongoose from 'mongoose';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ES module support
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Get MongoDB connection string from environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://cbvcroom6:fA0ZkeAFIzmIj7mB@cluster0.ctiutem.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// Get SQLite database path from environment variable
const DATABASE_URL = process.env.DATABASE_URL || join(__dirname, '..', 'welfare_committee.db');

// MongoDB Atlas connection options
const options = {
  serverSelectionTimeoutMS: 15000, // Increased timeout for better connection stability
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip trying IPv6
  retryWrites: true,
  w: 'majority',
  ssl: true,
  authSource: 'admin',
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// Connect to MongoDB with SQLite fallback
async function connectDB() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI, options);
    console.log('Successfully connected to MongoDB.');
    
    // Initialize MongoDB models
    const db = mongoose.connection;
    await db.collection('submissions').createIndex({ createdAt: 1 });
    
    return db; // Return MongoDB connection
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    console.log('Attempting to use SQLite as fallback...');
    
    try {
      // Ensure the data directory exists
      const dataDir = join(__dirname, '..', 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      // Initialize SQLite database
      const db = await open({
        filename: join(dataDir, 'welfare_committee.db'),
        driver: sqlite3.Database
      });
      
      console.log('Successfully connected to SQLite database as fallback.');
      return db; // Return the SQLite database connection
    } catch (sqliteError) {
      console.error('Error connecting to SQLite fallback:', sqliteError.message);
      throw new Error('Failed to connect to both MongoDB and SQLite');
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