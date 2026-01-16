const path = require("path");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Proper CORS configuration for GitHub Pages
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// Handle preflight requests
app.options("*", cors());

app.use(express.json());
app.use(express.static(__dirname));


const db = new sqlite3.Database("./orders.db", err => {
  if (err) console.error(err);
  console.log("SQLite database connected");
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
)
`);

app.post("/place-order", (req, res) => {
  console.log("Order received:", req.body);

  const { name, mobile, address, items, total } = req.body;

  const sql = `
    INSERT INTO orders (customer_name, mobile, address, items, total)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [name, mobile, address, JSON.stringify(items), total], err => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Database error" });
      return;
    }
    res.json({ message: "Order saved successfully" });
  });
});

app.get("/orders", (req, res) => {
  db.all("SELECT * FROM orders ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// 🔥 New delete route
app.delete("/delete-order/:id", (req, res) => {
  const id = req.params.id;
  console.log("Delete request received for ID:", id);

  const sql = `DELETE FROM orders WHERE id = ?`;

  db.run(sql, [id], function (err) {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ message: "Failed to delete order" });
    }

    if (this.changes === 0) {
      // No row found with this ID
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "view-orders.html"));
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

