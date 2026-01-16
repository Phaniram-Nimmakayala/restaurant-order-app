const express = require("express");
const sqlite3 = require("sqlite3");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());   // allow all origins for testing

app.use(express.json());
app.use(express.urlencoded({ extended: true }));






/* ⚠️ SQLite must be writable in Render */
const dbPath = "/tmp/orders.db";

const db = new sqlite3.Database(dbPath, err => {
  if (err) console.error("DB error:", err);
  else console.log("SQLite DB ready at", dbPath);
});

db.run(`
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT,
  mobile TEXT,
  address TEXT,
  items TEXT,
  total REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

/* API Routes */

app.post("/place-order", (req, res) => {
  const { name, mobile, address, items, total } = req.body;

  const sql = `
    INSERT INTO orders (customer_name, mobile, address, items, total)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [name, mobile, address, JSON.stringify(items), total], function (err) {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Order saved successfully", id: this.lastID });
  });
});

app.get("/orders", (req, res) => {
  db.all("SELECT * FROM orders ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.delete("/delete-order/:id", (req, res) => {
  const id = req.params.id;

  db.run(`DELETE FROM orders WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ message: "Delete failed" });
    if (this.changes === 0) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted" });
  });
});

/* Health check */
app.get("/", (req, res) => {
  res.send("Restaurant Order API Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
