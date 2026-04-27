# Personal Budget Tracker

A full-stack web application to manage personal income and expenses. Users can add, edit, delete, and filter transactions, then view spending insights through charts.

## Features

- Add income and expense transactions
- Edit existing transactions
- Delete transactions with confirmation
- Filter by type, category, and date range
- View live summary (income, expense, balance)
- View charts:
  - Expense by category (pie chart)
  - Income vs expense (bar chart)

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js + Express
- Database: SQLite
- Chart library: Chart.js

## Project Structure

```
Tracker/
  data/
    budget.db
  public/
    css/style.css
    js/app.js
    index.html
  package.json
  server.js
```

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start server:

   ```bash
   npm start
   ```

3. Open in browser:

   `http://localhost:3000`

## API Endpoints

- `GET /api/health`
- `GET /api/transactions`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`

## Sample Transaction JSON

```json
{
  "type": "expense",
  "amount": 120.5,
  "category": "Food",
  "date": "2026-04-27",
  "note": "Groceries"
}
```

## Author Info (for report)

- Student Name Surname: [Fill this]
- Student Number: [Fill this]
- GitHub Username: [Fill this]
- Public Repository Link: [Fill this]

