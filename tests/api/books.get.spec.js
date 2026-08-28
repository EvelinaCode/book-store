import { test, expect } from "../fixtures/bookFixture.js";

test.describe("GET /api/books", () => {
  test("returns books with 200", async ({ request }) => {
    const response = await request.get("/api/books");

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.data).toBeInstanceOf(Array);
    expect(body.pagination).toBeDefined();
  });

  test("returns a book by id", async ({ request }) => {
    const response = await request.get("/api/books/1");

    expect(response.status()).toBe(200);

    const book = await response.json();

    expect(book.id).toBe(1);
    expect(book.title).toBeTruthy();
  });

  test("returns 404 for non-existing book", async ({ request }) => {
    const response = await request.get("/api/books/999999");

    expect(response.status()).toBe(404);

    const body = await response.json();

    expect(body.error).toBe("Book not found");
  });

  test("returns 400 for invalid book id", async ({ request }) => {
    const response = await request.get("/api/books/abc");

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe("Invalid book ID");
  });

  test("filters books by category", async ({ request }) => {
    const response = await request.get("/api/books?category=Programming");

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.data).toBeInstanceOf(Array);

    for (const book of body.data) {
      expect(book.category).toBe("Programming");
    }
  });

  test("searches books by title", async ({ request }) => {
    const response = await request.get("/api/books?search=Clean");

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.data).toBeInstanceOf(Array);

    for (const book of body.data) {
      expect(book.title.toLowerCase()).toContain("clean");
    }
  });

  test("sorts books by price ascending", async ({ request }) => {
    const response = await request.get("/api/books?sort=price_asc");

    expect(response.status()).toBe(200);

    const body = await response.json();

    const prices = body.data.map((book) => book.price);

    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test("rejects an unsupported sort value", async ({ request }) => {
    const response = await request.get("/api/books?sort=title_asc");

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.details).toContain("sort must be price_asc or price_desc");
  });

  test("supports pagination", async ({ request }) => {
    const response = await request.get("/api/books?page=1&limit=2");

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.pagination.page).toBe(1);
    expect(body.pagination.limit).toBe(2);
    expect(body.data.length).toBeLessThanOrEqual(2);
  });
});
