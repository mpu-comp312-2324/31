import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import express from 'express';

const dbPromise = open({
  filename: './db.sqlite',
  driver: sqlite3.Database
});

const api = express.Router();

// Retrieve the stocktaking list
api.get('/stocktaking-list', async (req, res) => {
  try {
    const db = await dbPromise;
    const stocktakingList = await db.all('SELECT * FROM stocktaking_list');
    res.json(stocktakingList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new stocktaking list item
api.post('/stocktaking-list', async (req, res) => {
  try {
    const { description, maxStock, currentStock } = req.body;

    // Validate the inputs
    if (!description || !maxStock || !currentStock) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const db = await dbPromise;
    const result = await db.run(
      'INSERT INTO stocktaking_list (description, maxStock, currentStock) VALUES (?, ?, ?)',
      description,
      maxStock,
      currentStock
    );

    // Get the newly created item
    const newItem = await db.get(
      'SELECT * FROM stocktaking_list WHERE pk = ?',
      result.lastID
    );

    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a stocktaking list item
api.put('/stocktaking-list/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { description, maxStock, currentStock } = req.body;

    // Validate the inputs
    if (!description || !maxStock || !currentStock) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const db = await dbPromise;
    const result = await db.run(
      'UPDATE stocktaking_list SET description = ?, maxStock = ?, currentStock = ? WHERE pk = ?',
      description,
      maxStock,
      currentStock,
      itemId
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a stocktaking list item
api.delete('/stocktaking-list/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;

    const db = await dbPromise;
    const result = await db.run(
      'DELETE FROM stocktaking_list WHERE pk = ?',
      itemId
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default api;