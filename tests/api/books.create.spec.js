import { test, expect } from "../fixtures/bookFixture.js";
import { validBook } from "../data/bookData.js";

test.describe("POST /api/books", () => {
  test("creates a new book", async ({ request }) => {
    let bookId;

    try {
      const response = await request.post("/api/books", {
        data: validBook,
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
        await request.delete(`/api/books/${bookId}`);
      }
    }
  });

  test("returns 400 when title is missing", async ({ request }) => {
    const { title, ...bookWithoutTitle } = validBook;

    const response = await request.post("/api/books", {
      data: bookWithoutTitle,
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe("Validation failed");
    expect(body.details).toContain("Title is required");
  });

  test("returns 400 when title is not a string", async ({ request }) => {
    const response = await request.post("/api/books", {
      data: {
        ...validBook,
        title: 123,
      },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe("Validation failed");
    expect(body.details).toContain("Title is required");
  });

  test("returns 400 when ISBN is missing", async ({ request }) => {
    const { isbn, ...bookWithoutIsbn } = validBook;

    const response = await request.post("/api/books", {
      data: bookWithoutIsbn,
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe("Validation failed");
    expect(body.details).toContain("ISBN is required");
  });

  test("returns 400 when ISBN is not a string", async ({ request }) => {
    const response = await request.post("/api/books", {
      data: {
        ...validBook,
        isbn: 123456,
      },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe("Validation failed");
    expect(body.details).toContain("ISBN is required");
  });

  test("returns 400 when price is negative", async ({ request }) => {
    const response = await request.post("/api/books", {
      data: {
        ...validBook,
        price: -10,
      },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe("Validation failed");
    expect(body.details).toContain("Price must be a non-negative number");
  });

  test("returns 400 when stock is negative", async ({ request }) => {
    const response = await request.post("/api/books", {
      data: {
        ...validBook,
        stock: -1,
      },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe("Validation failed");
    expect(body.details).toContain("Stock must be a non-negative integer");
  });

  test("returns 409 when ISBN already exists", async ({ request }) => {
    let bookId;

    try {
      const firstResponse = await request.post("/api/books", {
        data: validBook,
      });

      expect(firstResponse.status()).toBe(201);

      const firstBook = await firstResponse.json();

      bookId = firstBook.id;

      const secondResponse = await request.post("/api/books", {
        data: {
          ...validBook,
          title: "Another Book",
        },
      });

      expect(secondResponse.status()).toBe(409);

      const body = await secondResponse.json();

      expect(body.error).toBe("A book with this ISBN already exists");
    } finally {
      if (bookId) {
        await request.delete(`/api/books/${bookId}`);
      }
    }
  });
});
