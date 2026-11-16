import { test, expect } from "../fixtures/bookFixture.js";
import { validBook } from "../data/bookData.js";

test.describe("POST /api/books", () => {
  test("creates a new book", async ({ request, admin }) => {
    let bookId;

    const headers = {
      Authorization: `Bearer ${admin.token}`,
    };

    try {
      const response = await request.post("/api/books", {
        data: validBook,
        headers,
      });

      expect(response.status()).toBe(201);

      const book = await response.json();

      bookId = book.id;

      expect(book.id).toBeTruthy();
      expect(book.title).toBe(validBook.title);
      expect(book.author).toBe(validBook.author);
      expect(book.category).toBe(validBook.category);
      expect(book.price).toBe(validBook.price);
      expect(book.stock).toBe(validBook.stock);
      expect(book.isbn).toBe(validBook.isbn);
      expect(book.description).toBe(validBook.description);

      expect(book.createdAt).toBeTruthy();
      expect(book.updatedAt).toBeTruthy();
    } finally {
      if (bookId) {
        await request.delete(`/api/books/${bookId}`, { headers });
      }
    }
  });

  test("returns 400 when title is missing", async ({ request, admin }) => {
    const { title, ...bookWithoutTitle } = validBook;

    const response = await request.post("/api/books", {
      data: bookWithoutTitle,
      headers: { Authorization: `Bearer ${admin.token}` },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe("Validation failed");
    expect(body.details).toContain("Title is required");
  });

  test("returns 400 when title is not a string", async ({ request, admin }) => {
    const response = await request.post("/api/books", {
      data: {
        ...validBook,
        title: 123,
      },
      headers: { Authorization: `Bearer ${admin.token}` },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe("Validation failed");
    expect(body.details).toContain("Title is required");
  });

  test("returns 400 when ISBN is missing", async ({ request, admin }) => {
    const { isbn, ...bookWithoutIsbn } = validBook;

    const response = await request.post("/api/books", {
      data: bookWithoutIsbn,
      headers: { Authorization: `Bearer ${admin.token}` },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe("Validation failed");
    expect(body.details).toContain("ISBN is required");
  });

  test("returns 400 when ISBN is not a string", async ({ request, admin }) => {
    const response = await request.post("/api/books", {
      data: {
        ...validBook,
        isbn: 123456,
      },
      headers: { Authorization: `Bearer ${admin.token}` },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe("Validation failed");
    expect(body.details).toContain("ISBN is required");
  });

  test("returns 400 when price is negative", async ({ request, admin }) => {
    const response = await request.post("/api/books", {
      data: {
        ...validBook,
        price: -10,
      },
      headers: { Authorization: `Bearer ${admin.token}` },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe("Validation failed");
    expect(body.details).toContain("Price must be a non-negative number");
  });

  test("returns 400 when stock is negative", async ({ request, admin }) => {
    const response = await request.post("/api/books", {
      data: {
        ...validBook,
        stock: -1,
      },
      headers: { Authorization: `Bearer ${admin.token}` },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe("Validation failed");
    expect(body.details).toContain("Stock must be a non-negative integer");
  });

  test("returns 409 when ISBN already exists", async ({ request, admin }) => {
    let bookId;

    const headers = {
      Authorization: `Bearer ${admin.token}`,
    };

    try {
      const firstResponse = await request.post("/api/books", {
        data: validBook,
        headers,
      });

      expect(firstResponse.status()).toBe(201);

      const firstBook = await firstResponse.json();

      bookId = firstBook.id;

      const secondResponse = await request.post("/api/books", {
        data: {
          ...validBook,
          title: "Another Book",
        },
        headers,
      });

      expect(secondResponse.status()).toBe(409);

      const body = await secondResponse.json();

      expect(body.error).toBe("A book with this ISBN already exists");
    } finally {
      if (bookId) {
        await request.delete(`/api/books/${bookId}`, { headers });
      }
    }
  });
});
