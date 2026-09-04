import { test, expect } from "../fixtures/bookFixture.js";

test.describe("GET /api/books", () => {
  test("returns books with 200", async ({ request }) => {
    const response = await request.get("/api/books");

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.data).toBeInstanceOf(Array);
    expect(body.pagination).toBeDefined();
  });

  test("returns a book by id", async ({ request, book }) => {
    const response = await request.get(`/api/books/${book.id}`);

    expect(response.status()).toBe(200);

    const responseBook = await response.json();

    expect(responseBook.id).toBe(book.id);
    expect(responseBook.title).toBe(book.title);
    expect(responseBook.author).toBe(book.author);
    expect(responseBook.category).toBe(book.category);
    expect(responseBook.price).toBe(book.price);
    expect(responseBook.stock).toBe(book.stock);
    expect(responseBook.isbn).toBe(book.isbn);
    expect(responseBook.description).toBe(book.description);
    expect(responseBook.createdAt).toBeTruthy();
    expect(responseBook.updatedAt).toBeTruthy();
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

    const prices = body.data.map((book) => Number(book.price));

    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test("rejects an unsupported sort value", async ({ request }) => {
    const response = await request.get("/api/books?sort=rating_desc");

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.details).toContain(
      "sort must be one of: price_asc, price_desc, title_asc, title_desc, createdAt_asc, createdAt_desc",
    );
  });

  test("supports pagination", async ({ request }) => {
    const response = await request.get("/api/books?page=1&limit=2");

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.pagination.page).toBe(1);
    expect(body.pagination.limit).toBe(2);
    expect(body.data.length).toBeLessThanOrEqual(2);
  });

  test("sorts books by title ascending", async ({ request, sortingBooks }) => {
    const response = await request.get(
      "/api/books?category=Sorting%20Test&sort=title_asc",
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    const titles = body.data.map((book) => book.title);

    const expectedTitles = sortingBooks
      .map((book) => book.title)
      .sort((firstTitle, secondTitle) => firstTitle.localeCompare(secondTitle));

    expect(titles).toEqual(expectedTitles);
  });

  test("sorts books by title descending", async ({ request, sortingBooks }) => {
    const response = await request.get(
      "/api/books?category=Sorting%20Test&sort=title_desc",
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    const titles = body.data.map((book) => book.title);

    const expectedTitles = sortingBooks
      .map((book) => book.title)
      .sort((firstTitle, secondTitle) => secondTitle.localeCompare(firstTitle));

    expect(titles).toEqual(expectedTitles);
  });

  test("filters books by author", async ({ request, sortingBooks }) => {
    const response = await request.get("/api/books?author=test%20author");

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.data).toHaveLength(2);

    for (const book of body.data) {
      expect(book.author.toLowerCase()).toContain("test author");
    }
  });

  test("filters books by minimum price", async ({ request, sortingBooks }) => {
    const response = await request.get(
      "/api/books?category=Sorting%20Test&minPrice=20",
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.data).toHaveLength(2);

    for (const book of body.data) {
      expect(Number(book.price)).toBeGreaterThanOrEqual(20);
    }
  });

  test("filters books by maximum price", async ({ request, sortingBooks }) => {
    const response = await request.get(
      "/api/books?category=Sorting%20Test&maxPrice=20",
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.data).toHaveLength(2);

    for (const book of body.data) {
      expect(Number(book.price)).toBeLessThanOrEqual(20);
    }
  });

  test("filters books by price range", async ({ request, sortingBooks }) => {
    const response = await request.get(
      "/api/books?category=Sorting%20Test&minPrice=15&maxPrice=25",
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.data).toHaveLength(1);
    expect(Number(body.data[0].price)).toBe(20);
  });

  test("filters books that are in stock", async ({ request, sortingBooks }) => {
    const response = await request.get(
      "/api/books?category=Sorting%20Test&inStock=true",
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.data).toHaveLength(2);

    for (const book of body.data) {
      expect(book.stock).toBeGreaterThan(0);
    }
  });

  test("filters books that are out of stock", async ({
    request,
    sortingBooks,
  }) => {
    const response = await request.get(
      "/api/books?category=Sorting%20Test&inStock=false",
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.data).toHaveLength(1);
    expect(body.data[0].stock).toBe(0);
  });

  test("rejects a negative minimum price", async ({ request }) => {
    const response = await request.get("/api/books?minPrice=-1");

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.details).toContain("minPrice must be a non-negative number");
  });

  test("rejects an invalid maximum price", async ({ request }) => {
    const response = await request.get("/api/books?maxPrice=abc");

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.details).toContain("maxPrice must be a non-negative number");
  });

  test("rejects a price range where minimum is greater than maximum", async ({
    request,
  }) => {
    const response = await request.get("/api/books?minPrice=100&maxPrice=20");

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.details).toContain("minPrice cannot be greater than maxPrice");
  });

  test("rejects an invalid inStock value", async ({ request }) => {
    const response = await request.get("/api/books?inStock=yes");

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.details).toContain("inStock must be true or false");
  });

  test("sorts books by price descending", async ({ request }) => {
    const response = await request.get("/api/books?sort=price_desc");

    expect(response.status()).toBe(200);

    const body = await response.json();

    const prices = body.data.map((book) => Number(book.price));

    expect(prices).toEqual(
      [...prices].sort((firstPrice, secondPrice) => secondPrice - firstPrice),
    );
  });

  test("sorts books by createdAt ascending", async ({
    request,
    sortingBooks,
  }) => {
    const response = await request.get(
      "/api/books?category=Sorting%20Test&sort=createdAt_asc",
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    const createdAtValues = body.data.map((book) =>
      new Date(book.createdAt).getTime(),
    );

    expect(createdAtValues).toEqual(
      [...createdAtValues].sort(
        (firstDate, secondDate) => firstDate - secondDate,
      ),
    );
  });

  test("sorts books by createdAt descending", async ({
    request,
    sortingBooks,
  }) => {
    const response = await request.get(
      "/api/books?category=Sorting%20Test&sort=createdAt_desc",
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    const createdAtValues = body.data.map((book) =>
      new Date(book.createdAt).getTime(),
    );

    expect(createdAtValues).toEqual(
      [...createdAtValues].sort(
        (firstDate, secondDate) => secondDate - firstDate,
      ),
    );
  });
});
