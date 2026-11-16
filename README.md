# Book Store API

REST API for a book-store catalog and user authentication, built with Express, Prisma, PostgreSQL, Zod, JWT, and Playwright.

## Current features

- Browse a catalog of books with pagination, search, filters, and sorting.
- Create, update, and delete books.
- Register users, log in, and retrieve the authenticated user's profile.
- Validate request bodies and query parameters with Zod.
- Protect passwords with bcrypt and authenticate requests with JWT.
- Run API tests with Playwright and unit tests with Vitest.

> This is currently the API foundation for the store. Cart, checkout, orders, admin-only inventory management, and AI recommendations are planned next.

## Requirements

- Node.js 20 or newer
- PostgreSQL

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/book_store"
   JWT_SECRET="replace-this-with-a-long-random-secret"
   PORT=3000
   ```

3. Apply database migrations:

   ```bash
   npx prisma migrate dev
   ```

4. Add sample books:

   ```bash
   npm run seed
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

The API runs at `http://localhost:3000`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Start the API server. |
| `npm run dev` | Start the API with Nodemon. |
| `npm run seed` | Add sample books when the database has no books. |
| `npm test` | Run Playwright API tests. |
| `npm run test:unit -- --run` | Run Vitest unit tests once. |

## Authentication

Register a user:

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "secure-password"
}
```

Log in to receive a JWT:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "ada@example.com",
  "password": "secure-password"
}
```

Use the token for authenticated endpoints:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## Endpoints

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a new user. |
| `POST` | `/api/auth/login` | Log in and receive a JWT. |
| `GET` | `/api/auth/me` | Return the authenticated user's ID and role. |

### Books

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/books` | Return a paginated list of books. |
| `GET` | `/api/books/:id` | Return one book. |
| `POST` | `/api/books` | Create a book. |
| `PUT` | `/api/books/:id` | Replace a book. |
| `PATCH` | `/api/books/:id` | Update selected book fields. |
| `DELETE` | `/api/books/:id` | Delete a book. |

## Book fields

```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "category": "Programming",
  "price": 45.99,
  "stock": 10,
  "isbn": "9780132350884",
  "description": "A handbook of agile software craftsmanship."
}
```

`description` is optional. All other fields are required when creating or fully replacing a book.

## Browse, filter, and sort books

`GET /api/books` supports these optional query parameters:

| Parameter | Example | Description |
| --- | --- | --- |
| `page` | `page=2` | Page number, starting at 1. |
| `limit` | `limit=10` | Results per page, from 1 to 100. |
| `search` | `search=clean` | Case-insensitive title search. |
| `category` | `category=Programming` | Exact category filter. |
| `author` | `author=martin` | Case-insensitive author search. |
| `minPrice` | `minPrice=20` | Minimum price, inclusive. |
| `maxPrice` | `maxPrice=50` | Maximum price, inclusive. |
| `inStock` | `inStock=true` | `true` for available books, `false` for out-of-stock books. |
| `sort` | `sort=price_asc` | One of the supported sort values below. |

Supported `sort` values:

```text
price_asc     price_desc
title_asc     title_desc
createdAt_asc createdAt_desc
```

Example:

```http
GET /api/books?category=Programming&minPrice=20&inStock=true&sort=price_asc&page=1&limit=10
```

## Response format

Book lists return both data and pagination metadata:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

Validation errors use this format:

```json
{
  "error": "Validation failed",
  "details": ["Price must be a non-negative number"]
}
```

## Testing

API tests run against a server on port `3001` and execute serially because they currently share one database:

```bash
npm test
```

Run the unit tests once:

```bash
npm run test:unit -- --run
```

## Project structure

```text
src/
  controllers/   HTTP request and response handling
  middleware/    Authentication, validation, and error handling
  repositories/  Database access helpers
  routes/        API endpoint definitions
  services/      Application and business logic
  validators/    Zod request schemas
prisma/          Database schema, migrations, and seed data
tests/           Playwright API tests
unit/            Vitest unit tests
```
