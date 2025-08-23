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

## 🧪 Testing the API with Postman

### 1. Import the Collection
- Open Postman.
- Go to **File → Import**.
- Select:  
  - `postman/Library-Management.postman_collection.json`

---

### 2. Base URL Configuration
The Postman collection `postman/Library-Management.postman_collection.json` already includes a `base-URL` variable:

```json
"variable": [
  {
    "key": "base-URL",
    "value": "http://localhost:3000"
  }
]
```

👉 If you are running the API locally or on another server, **update this value**:

- **Local development(default)**
```json
"value": "http://localhost:3000"
```

- **GitHub Codespaces**
for setup the codespaces go to the next section **Run in GitHub Codespaces**
```json
"value": "https://<your-port>-<username>-<id>.app.github.dev"
```

- **Production server**
```json
"value": "https://your-production-domain.com"
```

You can edit it in **two ways**:
1. Directly in the JSON file before importing to Postman.  
2. Inside Postman → Open the collection → **View Variables** → change `base-URL`.  


## 🚀 Run in GitHub Codespaces

You can run this project directly in **GitHub Codespaces** without installing dependencies locally.

### 1. Open in Codespaces
- Navigate to the repository on GitHub via `https://github.com/BassamRamadan/Library-Management-System`.
- Click the green **Code** button → **Open with Codespaces** → **New codespace**.

### 2. Start the API
Inside the Codespace terminal, run:

```bash
cp .env.example .env
docker-compose up --build

```
#### 3. Make Port Public

1. Find the port your app is running on (e.g. `3000`) in the **Ports tab** via vscode for example.  
2. Right-click the port → **Change Port Visibility** → select **Public**.  
3. GitHub will generate a public URL like:  `https://jubilant-acorn-rrwp7959gp4259j7.github.dev/`
4. Use this URL as your `base-URL` in Postman.

## Notes
- Auto-creates and syncs tables on startup.
- `BORROW_DAYS` env controls default loan duration (days) if `dueDate` not provided.
- Rate limiting applied to `POST /books` and `POST /borrowings`.
