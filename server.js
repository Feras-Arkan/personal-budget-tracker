const express = require("express");
const path = require("path");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;
const dbPath = path.join(__dirname, "data", "budget.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      amount REAL NOT NULL CHECK(amount > 0),
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      note TEXT DEFAULT '',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Budget Tracker API is running" });
});

app.get("/api/transactions", (req, res) => {
  const query = `
    SELECT id, type, amount, category, date, note, created_at
    FROM transactions
    ORDER BY date DESC, id DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch transactions." });
    }
    return res.json(rows);
  });
});

app.post("/api/transactions", (req, res) => {
  const { type, amount, category, date, note = "" } = req.body;

  if (!["income", "expense"].includes(type)) {
    return res.status(400).json({ error: "Type must be income or expense." });
  }
  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ error: "Amount must be a positive number." });
  }
  if (!category || typeof category !== "string") {
    return res.status(400).json({ error: "Category is required." });
  }
  if (!date || typeof date !== "string") {
    return res.status(400).json({ error: "Date is required." });
  }

  const query = `
    INSERT INTO transactions (type, amount, category, date, note)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [type, amount, category.trim(), date, String(note).trim()];

  db.run(query, params, function onInsert(err) {
    if (err) {
      return res.status(500).json({ error: "Failed to create transaction." });
    }

    return res.status(201).json({
      id: this.lastID,
      type,
      amount,
      category: category.trim(),
      date,
      note: String(note).trim(),
    });
  });
});

app.put("/api/transactions/:id", (req, res) => {
  const id = Number(req.params.id);
  const { type, amount, category, date, note = "" } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid transaction id." });
  }
  if (!["income", "expense"].includes(type)) {
    return res.status(400).json({ error: "Type must be income or expense." });
  }
  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ error: "Amount must be a positive number." });
  }
  if (!category || typeof category !== "string") {
    return res.status(400).json({ error: "Category is required." });
  }
  if (!date || typeof date !== "string") {
    return res.status(400).json({ error: "Date is required." });
  }

  const query = `
    UPDATE transactions
    SET type = ?, amount = ?, category = ?, date = ?, note = ?
    WHERE id = ?
  `;
  const params = [type, amount, category.trim(), date, String(note).trim(), id];

  db.run(query, params, function onUpdate(err) {
    if (err) {
      return res.status(500).json({ error: "Failed to update transaction." });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Transaction not found." });
    }
    return res.json({ message: "Transaction updated successfully." });
  });
});

app.delete("/api/transactions/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid transaction id." });
  }

  const query = "DELETE FROM transactions WHERE id = ?";
  db.run(query, [id], function onDelete(err) {
    if (err) {
      return res.status(500).json({ error: "Failed to delete transaction." });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Transaction not found." });
    }
    return res.json({ message: "Transaction deleted successfully." });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
