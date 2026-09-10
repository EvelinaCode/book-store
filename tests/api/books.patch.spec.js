import { test, expect } from "../fixtures/bookFixture.js";

test.describe("PATCH /api/books/:id", () => {
  test("updates only the provided field", async ({ request, book }) => {
    const response = await request.patch(`/api/books/${book.id}`, {
      data: {
        price: 99.99,
      },
    });

    expect(response.status()).toBe(200);

    const updatedBook = await response.json();

    expect(Number(updatedBook.price)).toBe(99.99);
    expect(updatedBook.title).toBe(book.title);
    expect(updatedBook.author).toBe(book.author);
    expect(updatedBook.category).toBe(book.category);
    expect(updatedBook.stock).toBe(book.stock);
    expect(updatedBook.isbn).toBe(book.isbn);
    expect(updatedBook.description).toBe(book.description);
  });

  test("updates ISBN", async ({ request, book }) => {
    const newIsbn = "978-0132350997";

    const response = await request.patch(`/api/books/${book.id}`, {
      data: {
        isbn: newIsbn,
      },
    });

    expect(response.status()).toBe(200);

    const updatedBook = await response.json();

    expect(updatedBook.isbn).toBe(newIsbn);
    expect(updatedBook.title).toBe(book.title);
    expect(updatedBook.price).toBe(book.price);
  });

  test("updates description", async ({ request, book }) => {
    const newDescription = "Updated book description";

    const response = await request.patch(`/api/books/${book.id}`, {
      data: {
        description: newDescription,
      },
    });

    expect(response.status()).toBe(200);

    const updatedBook = await response.json();

    expect(updatedBook.description).toBe(newDescription);
    expect(updatedBook.title).toBe(book.title);
    expect(updatedBook.isbn).toBe(book.isbn);
  });

  test("updates multiple fields", async ({ request, book }) => {
    const response = await request.patch(`/api/books/${book.id}`, {
      data: {
        title: "Updated Title",
        price: 49.99,
        stock: 25,
        description: "Updated description",
      },
    });

    expect(response.status()).toBe(200);

    const updatedBook = await response.json();

    expect(updatedBook.title).toBe("Updated Title");
    expect(Number(updatedBook.price)).toBe(49.99);
    expect(updatedBook.stock).toBe(25);
    expect(updatedBook.description).toBe("Updated description");

    expect(updatedBook.author).toBe(book.author);
    expect(updatedBook.category).toBe(book.category);
    expect(updatedBook.isbn).toBe(book.isbn);
  });

  test("returns 400 for negative price", async ({ request, book }) => {
    const response = await request.patch(`/api/books/${book.id}`, {
      data: {
        price: -5,
      },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe("Validation failed");
    expect(body.details).toContain("Price must be a non-negative number");
  });

  test("returns 400 when no fields are provided", async ({ request, book }) => {
    const response = await request.patch(`/api/books/${book.id}`, {
      data: {},
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe("Validation failed");
    expect(body.details).toContain("Provide at least one field to update");
  });

  test("returns 400 when unknown field is provided", async ({
    request,
    book,
  }) => {
    const response = await request.patch(`/api/books/${book.id}`, {
      data: {
        rating: 5,
      },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe("Validation failed");
    expect(body.details).toContain('Unrecognized key: "rating"');
  });

  test("returns 400 when ISBN is empty", async ({ request, book }) => {
    const response = await request.patch(`/api/books/${book.id}`, {
      data: {
        isbn: "",
      },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe("Validation failed");
    expect(body.details).toContain("ISBN cannot be empty");
  });

  test("returns 400 when description is empty", async ({ request, book }) => {
    const response = await request.patch(`/api/books/${book.id}`, {
      data: {
        description: "",
      },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe("Validation failed");
    expect(body.details).toContain("Description cannot be empty");
  });

  test("returns 409 when ISBN already exists", async ({ request, book }) => {
    let secondBookId;

    try {
      const createResponse = await request.post("/api/books", {
        data: {
          ...book,
          id: undefined,
          title: "Second Test Book",
          isbn: "978-0132350998",
        },
      });

      expect(createResponse.status()).toBe(201);

      const secondBook = await createResponse.json();
      secondBookId = secondBook.id;

      const response = await request.patch(`/api/books/${book.id}`, {
        data: {
          isbn: secondBook.isbn,
        },
      });

      expect(response.status()).toBe(409);

      const body = await response.json();

      expect(body.error).toBe("A book with this ISBN already exists");
    } finally {
      if (secondBookId) {
        await request.delete(`/api/books/${secondBookId}`);
      }
    }
  });

  test("returns 404 for non-existing book", async ({ request }) => {
    const response = await request.patch("/api/books/999999", {
      data: {
        price: 50,
      },
    });

    expect(response.status()).toBe(404);

    const body = await response.json();

    expect(body.error).toBe("Book not found");
  });
});
