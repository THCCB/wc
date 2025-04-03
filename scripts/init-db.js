import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initializeDatabase() {
  const dataDir = join(__dirname, '..', 'data');
  const dbPath = join(dataDir, 'welfare_committee.db');

  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Create submissions table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        department TEXT NOT NULL,
        reason TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        photo_path TEXT
      );
    `);

    console.log('Database initialized successfully');
    await db.close();
  } catch (error) {
    console.error('Error initializing database:', error.message);
    process.exit(1);
  }
}

initializeDatabase();