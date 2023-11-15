import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();
const port = 3000;

app.use(express.json());

// Connect to the SQLite database
const db = new sqlite3.Database('./db.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Retrieve the stocktaking list
app.get('/api/stocklist', (req, res) => {
  db.all('SELECT * FROM stocktaking', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to fetch stock list' });
    } else {
      res.json(rows);
    }
  });
});

// Create a stocktaking list item
app.post('/api/stocklist', (req, res) => {
  const { description, maxStock, currentStock } = req.body;
  const stmt = db.prepare('INSERT INTO stocktaking (description, maxStock, currentStock) VALUES (?, ?, ?)');
  stmt.run(description, maxStock, currentStock, (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to create item' });
    } else {
      res.sendStatus(201);
    }
  });
});

// Update a stocktaking list item
app.put('/api/stocklist/:id', (req, res) => {
  const id = req.params.id;
  const { description, maxStock, currentStock } = req.body;
  const stmt = db.prepare('UPDATE stocktaking SET description = ?, maxStock = ?, currentStock = ? WHERE pk = ?');
  stmt.run(description, maxStock, currentStock, id, (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to update item' });
    } else {
      res.sendStatus(200);
    }
  });
});

// Delete a stocktaking list item
app.delete('/api/stocklist/:id', (req, res) => {
  const id = req.params.id;
  const stmt = db.prepare('DELETE FROM stocktaking WHERE pk = ?');
  stmt.run(id, (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to delete item' });
    } else {
      res.sendStatus(200);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
