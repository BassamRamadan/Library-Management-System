# Library Management System (Node.js + Express + Sequelize)

A simple, Dockerized REST API for managing books, borrowers, and borrowings.

## Features
- CRUD for Books and Borrowers
- Borrow/Return books with due dates and stock updates
- List borrower's current books
- Overdue listing
- Search by title/author/isbn
- Basic Auth (configurable via env)
- Rate limiting on two sensitive endpoints
- Export CSV reports (last month's overdue and borrowings)
- Dockerfile + docker-compose
- Auto DB sync on startup

## Quick Start

```bash
cp .env.example .env
docker-compose up --build
```

API base: `http://localhost:3000`

Default Basic Auth:
```
user: admin
pass: admin123
```

> Configure via `.env`.

## Endpoints

### Books
- `POST /books` (rate limited) — create
- `GET /books` — list
- `GET /books/search?title=&author=&isbn=` — search any combination
- `PUT /books/:id` — update
- `DELETE /books/:id` — delete

### Borrowers
- `POST /borrowers` — create
- `GET /borrowers` — list
- `PUT /borrowers/:id` — update
- `DELETE /borrowers/:id` — delete
- `GET /borrowers/:id/books` — list books currently borrowed by borrower

### Borrowings
- `POST /borrowings` (rate limited) — borrow a book `{ borrowerId, bookId, dueDate? }`
- `POST /borrowings/:id/return` — return book
- `GET /borrowings/overdue` — list overdue borrowings
- `GET /borrowings` — list all borrowings

### Reports (exports)
- `GET /reports/last-month/borrowings.csv`
- `GET /reports/last-month/overdue.csv`

All endpoints require **Basic Auth**.

## Database Schema

### Tables
- **books**
  - id, title, author, isbn (unique), quantity, shelf_location, createdAt, updatedAt
- **borrowers**
  - id, name, email (unique), registered_date, createdAt, updatedAt
- **borrowings**
  - id, borrower_id (FK), book_id (FK), borrowed_date, due_date, returned_date (nullable), status ('borrowed'|'returned'), createdAt, updatedAt

See `scripts/schema.sql` for a SQL version.

## Notes
- Auto-creates and syncs tables on startup.
- `BORROW_DAYS` env controls default loan duration (days) if `dueDate` not provided.
- Rate limiting applied to `POST /books` and `POST /borrowings`.
