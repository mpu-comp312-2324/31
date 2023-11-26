import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import express from 'express';

const dbPromise = await open({
  filename: './db.sqlite',
  driver: sqlite3.Database
})

const api = express.Router();
api.use(express.json());

// Retrieve stocktaking list
api.get('/stocktaking-list', async (req, res) => {
  try {
    const db = await dbPromise;
    const rows = await db.all('SELECT * FROM stocktaking_list');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new stocktaking list item
api.post('/stocktaking-list', async (req, res) => {
  try {
    const { name, description, maxStock, currentStock } = req.body;
    if (!name || !description || !maxStock || !currentStock) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = await dbPromise;
    const result = await db.run(
      'INSERT INTO stocktaking_list (name, description, maxStock, currentStock) VALUES (?, ?, ?, ?)',
      [name, description, maxStock, currentStock]
    );

    res.json({ id: result.lastID });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a stocktaking list item
api.put('/stocktaking-list/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, description, maxStock, currentStock } = req.body;
    if (!name || !description || !maxStock || !currentStock) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = await dbPromise;
    const result = await db.run(
      'UPDATE stocktaking_list SET name = ?, description = ?, maxStock = ?, currentStock = ? WHERE id = ?',
      [name, description, maxStock, currentStock, itemId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a stocktaking list item
api.delete('/stocktaking-list/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;

    const db = await dbPromise;
    const result = await db.run(
      'DELETE FROM stocktaking_list WHERE id = ?',
      itemId
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default api;
