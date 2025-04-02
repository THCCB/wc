import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ES module support
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get DATABASE_URL from environment variable or use default
const DATABASE_URL = process.env.DATABASE_URL || join(__dirname, 'welfare_committee.db');

async function testConnection() {
    try {
        console.log('Attempting to connect to database at:', DATABASE_URL);
        
        const db = await open({
            filename: DATABASE_URL,
            driver: sqlite3.Database
        });

        // Test query to check if we can access the submissions table
        const result = await db.get('SELECT COUNT(*) as count FROM submissions');
        
        console.log('Successfully connected to database!');
        console.log('Number of submissions in database:', result.count);
        
        // Close the database connection
        await db.close();
        console.log('Database connection closed.');
        
    } catch (error) {
        console.error('Error connecting to database:', error.message);
        if (error.message.includes('no such file or directory')) {
            console.error('Database file does not exist at:', DATABASE_URL);
            console.error('Please ensure the database file exists and the path is correct.');
        }
        process.exit(1);
    }
}

testConnection();