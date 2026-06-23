import express from 'express';
import cors from 'cors';
import { initDB, dbAll, dbRun, dbGet } from './db.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
// Set high body limits to support large image uploads/base64 strings from AdminPanel
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Helper to convert database row representation to frontend representation
const formatProduct = (row) => {
  if (!row) return null;
  return {
    ...row,
    isPrescriptionCompatible: row.isPrescriptionCompatible === 1,
    inStock: row.inStock === 1,
    images: row.images ? JSON.parse(row.images) : [row.imageUrl],
    originalPrice: row.originalPrice !== null ? row.originalPrice : row.currentPrice,
  };
};

// 1. GET all products
app.get('/api/products', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM products ORDER BY id DESC');
    const products = rows.map(formatProduct);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// 2. GET single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const row = await dbGet('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(formatProduct(row));
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
});

// 3. POST add product
app.post('/api/products', async (req, res) => {
  try {
    const p = req.body;
    if (!p.title || !p.currentPrice || !p.description) {
      return res.status(400).json({ error: 'Title, currentPrice, and description are required' });
    }

    const id = p.id || `bc-${Date.now()}`;
    const rating = p.rating !== undefined ? p.rating : 5.0;
    const reviewsCount = p.reviewsCount !== undefined ? p.reviewsCount : 1;
    const inStock = p.inStock !== false ? 1 : 0;
    const isPrescriptionCompatible = p.isPrescriptionCompatible ? 1 : 0;

    const query = `
      INSERT INTO products (
        id, title, category, description, currentPrice, originalPrice, size,
        imageUrl, isPrescriptionCompatible, rating, reviewsCount, inStock,
        gender, frameMaterial, transitionImageUrl, splitLabelTop, splitLabelBottom,
        tryOnImageUrl, images
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      id,
      p.title,
      p.category,
      p.description,
      p.currentPrice,
      p.originalPrice !== undefined ? p.originalPrice : p.currentPrice,
      p.size,
      p.imageUrl || 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&auto=format&fit=crop&q=80',
      isPrescriptionCompatible,
      rating,
      reviewsCount,
      inStock,
      p.gender || 'unisex',
      p.frameMaterial || null,
      p.transitionImageUrl || null,
      p.splitLabelTop || null,
      p.splitLabelBottom || null,
      p.tryOnImageUrl || null,
      p.images ? JSON.stringify(p.images) : null
    ];

    await dbRun(query, params);
    
    // Retrieve the created product
    const createdRow = await dbGet('SELECT * FROM products WHERE id = ?', [id]);
    res.status(201).json(formatProduct(createdRow));
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// 4. PUT update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const p = req.body;

    // Check if product exists
    const exists = await dbGet('SELECT 1 FROM products WHERE id = ?', [id]);
    if (!exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const inStock = p.inStock !== false ? 1 : 0;
    const isPrescriptionCompatible = p.isPrescriptionCompatible ? 1 : 0;

    const query = `
      UPDATE products SET
        title = ?,
        category = ?,
        description = ?,
        currentPrice = ?,
        originalPrice = ?,
        size = ?,
        imageUrl = ?,
        isPrescriptionCompatible = ?,
        rating = ?,
        reviewsCount = ?,
        inStock = ?,
        gender = ?,
        frameMaterial = ?,
        transitionImageUrl = ?,
        splitLabelTop = ?,
        splitLabelBottom = ?,
        tryOnImageUrl = ?,
        images = ?
      WHERE id = ?
    `;

    const params = [
      p.title,
      p.category,
      p.description,
      p.currentPrice,
      p.originalPrice !== undefined ? p.originalPrice : p.currentPrice,
      p.size,
      p.imageUrl,
      isPrescriptionCompatible,
      p.rating !== undefined ? p.rating : 5.0,
      p.reviewsCount !== undefined ? p.reviewsCount : 1,
      inStock,
      p.gender,
      p.frameMaterial || null,
      p.transitionImageUrl || null,
      p.splitLabelTop || null,
      p.splitLabelBottom || null,
      p.tryOnImageUrl || null,
      p.images ? JSON.stringify(p.images) : null,
      id
    ];

    await dbRun(query, params);
    
    const updatedRow = await dbGet('SELECT * FROM products WHERE id = ?', [id]);
    res.json(formatProduct(updatedRow));
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// 5. DELETE product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const exists = await dbGet('SELECT 1 FROM products WHERE id = ?', [id]);
    if (!exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await dbRun('DELETE FROM products WHERE id = ?', [id]);
    res.json({ success: true, message: `Product ${id} deleted successfully` });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Start server after checking DB connections
const startServer = async () => {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Database initialization failed:', err);
    process.exit(1);
  }
};

startServer();
