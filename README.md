# Book Store API

A small Express and Prisma API for managing books.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file with a PostgreSQL connection string:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/book_store"
   PORT=3000
   ```

3. Apply the database migrations and add sample books:

   ```bash
   npx prisma migrate dev
   npm run seed
   ```

## Run

```bash
npm run dev
```

The API is available at `http://localhost:3000/api/books`.

## Tests

```bash
npm test
```

Tests run one at a time because they share the same database.

## Endpoints

- `GET /api/books` — list books. Supports `category`, `search`, `sort`, `page`, and `limit`.
- `GET /api/books/:id` — get one book.
- `POST /api/books` — create a book.
- `PUT /api/books/:id` — replace a book.
- `PATCH /api/books/:id` — update selected fields.
- `DELETE /api/books/:id` — delete a book.

`sort` can be `price_asc` or `price_desc`.
