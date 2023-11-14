import sqlite3 from 'sqlite3';
sqlite3.verbose();
import { open } from 'sqlite';

const db = await open({
  filename: './db.sqlite',
  driver: sqlite3.Database
});

import express from 'express';
let api = express.Router();

api.get('/products', async (req, res) => {
  const q = "SELECT * FROM Product";
  try {
    const result = await db.all(q);
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

api.delete('/products/:pid', async (req, res) => {
  if (req.params.pid == undefined) { return res.sendStatus(400); }
  let pid = parseInt(req.params.pid);
  try {
    const q = `DELETE FROM Product WHERE id = ${pid}`;
    await db.run(q);
    res.status(200).json({});
  } catch (err) {
    res.status(500).json(err);
  }
});

api.use(express.json());  // middleware that parses incoming requests with JSON payloads in the body

api.put('/products/:pid', async (req, res) => {
  if (req.params.pid == undefined) { return res.sendStatus(400); }
  if (req.body.productName == undefined
    || req.body.category == undefined
    || req.body.unitPrice == undefined
    || req.body.unitsInStock == undefined) {
    return res.sendStatus(400);
  }
  const pid = parseInt(req.params.pid);
  const valuesUpdateProduct = {
    $id: pid,
    $productName: req.body.productName,
    $category: req.body.category,
    $unitPrice: req.body.unitPrice,
    $unitsInStock: req.body.unitsInStock
  }
  // todo: further checking on valid values

  const q1 = `UPDATE Product SET 
        productName = $productName, 
        category = $category, 
        unitPrice = $unitPrice, 
        unitsInStock = $unitsInStock WHERE id = $id`;
  const q2 = "SELECT * FROM Product WHERE id = $id";

  try {
    await db.run(q1, valuesUpdateProduct);
    let result = await db.get(q2, { $id: pid });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

api.post('/products', async (req, res) => {
  if (req.body.productName == undefined
    || req.body.category == undefined
    || req.body.unitPrice == undefined
    || req.body.unitsInStock == undefined) {
    return res.sendStatus(400);
  }

  let valuesNewProduct = {
    $productName: req.body.productName,
    $category: req.body.category,
    $unitPrice: req.body.unitPrice,
    $unitsInStock: req.body.unitsInStock
  };
  // todo: further checking on valid values

  const q1 = `INSERT INTO Product (productName, category, unitPrice, unitsInStock)
    VALUES ($productName, $category, $unitPrice, $unitsInStock)`;

  const q2 = "SELECT * FROM Product WHERE id = $id";

  try {
    const insResult = await db.run(q1, valuesNewProduct);
    const pid = insResult.lastID;
    let result = await db.get(q2, { $id: pid });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default api;
