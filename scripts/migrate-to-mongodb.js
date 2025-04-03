import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection string and options
const MONGODB_URI = 'mongodb+srv://cbvcroom6:fA0ZkeAFIzmIj7mB@cluster0.ctiutem.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const options = {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    family: 4,
    retryWrites: true,
    w: 'majority',
    ssl: true,
    authSource: 'admin'
};

// SQLite database path
const SQLITE_PATH = path.join(process.cwd(), 'data', 'welfare_committee.db');

async function migrateData() {
    let sqliteDb = null;
    try {
        console.log('Starting migration process...');

        // Connect to SQLite
        console.log('Connecting to SQLite database...');
        sqliteDb = await open({
            filename: SQLITE_PATH,
            driver: sqlite3.Database
        });

        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, options);

        // Get all submissions from SQLite
        console.log('Fetching submissions from SQLite...');
        const submissions = await sqliteDb.all('SELECT * FROM submissions');
        console.log(`Found ${submissions.length} submissions to migrate`);

        // Create submissions collection in MongoDB if it doesn't exist
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        if (!collections.some(c => c.name === 'submissions')) {
            await db.createCollection('submissions');
        }

        // Migrate each submission
        console.log('Migrating submissions to MongoDB...');
        for (const submission of submissions) {
            const mongoSubmission = {
                ...submission,
                _id: new mongoose.Types.ObjectId(),
                createdAt: new Date(submission.createdAt),
                updatedAt: new Date(submission.updatedAt)
            };

            await db.collection('submissions').insertOne(mongoSubmission);
            console.log(`Migrated submission ID: ${submission.id}`);
        }

        console.log('Migration completed successfully!');

        // Print summary
        const mongoCount = await db.collection('submissions').countDocuments();
        console.log('\nMigration Summary:');
        console.log(`Total records in SQLite: ${submissions.length}`);
        console.log(`Total records in MongoDB: ${mongoCount}`);

    } catch (error) {
        console.error('Error during migration:', error);
        process.exit(1);
    } finally {
        // Close connections
        if (sqliteDb) await sqliteDb.close();
        await mongoose.connection.close();
        console.log('Database connections closed.');
    }
}

migrateData();