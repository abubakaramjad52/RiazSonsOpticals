import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'riaz_opticals.db');
const SEED_DATA_PATH = path.join(__dirname, '../src/data/initialProducts.json');

// Initialize sqlite3 database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Failed to connect to the database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', DB_PATH);
  }
});

// Wrap DB runs and queries in Promises
export const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

export const dbAll = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

export const dbGet = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Initialize database schema and seeds
export const initDB = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      currentPrice REAL NOT NULL,
      originalPrice REAL,
      size TEXT NOT NULL,
      imageUrl TEXT NOT NULL,
      isPrescriptionCompatible INTEGER NOT NULL, -- 0 or 1
      rating REAL NOT NULL DEFAULT 5.0,
      reviewsCount INTEGER NOT NULL DEFAULT 1,
      inStock INTEGER NOT NULL DEFAULT 1, -- 0 or 1
      gender TEXT NOT NULL,
      frameMaterial TEXT,
      transitionImageUrl TEXT,
      splitLabelTop TEXT,
      splitLabelBottom TEXT,
      tryOnImageUrl TEXT,
      images TEXT -- JSON array string
    )
  `;

  await dbRun(createTableQuery);
  console.log('Database schema verified.');

  // Check if seeding is required
  const countRow = await dbGet('SELECT COUNT(*) as count FROM products');
  if (countRow && countRow.count === 0) {
    console.log('Database is empty. Seeding initial products...');
    if (fs.existsSync(SEED_DATA_PATH)) {
      try {
        const seedData = JSON.parse(fs.readFileSync(SEED_DATA_PATH, 'utf-8'));
        
        // Prepare insert query
        const insertQuery = `
          INSERT INTO products (
            id, title, category, description, currentPrice, originalPrice, size,
            imageUrl, isPrescriptionCompatible, rating, reviewsCount, inStock,
            gender, frameMaterial, transitionImageUrl, splitLabelTop, splitLabelBottom,
            tryOnImageUrl, images
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        for (const item of seedData) {
          const params = [
            item.id,
            item.title,
            item.category,
            item.description,
            item.currentPrice,
            item.originalPrice || null,
            item.size,
            item.imageUrl,
            item.isPrescriptionCompatible ? 1 : 0,
            item.rating || 5.0,
            item.reviewsCount || 1,
            item.inStock !== false ? 1 : 0,
            item.gender,
            item.frameMaterial || null,
            item.transitionImageUrl || null,
            item.splitLabelTop || null,
            item.splitLabelBottom || null,
            item.tryOnImageUrl || null,
            item.images ? JSON.stringify(item.images) : null
          ];
          await dbRun(insertQuery, params);
        }
        console.log(`Successfully seeded ${seedData.length} products into the database.`);
      } catch (err) {
        console.error('Error seeding database:', err.message);
      }
    } else {
      console.warn('Initial products seed file not found at:', SEED_DATA_PATH);
    }
  }
};
