import { test, expect } from "../fixtures/bookFixture.js";
import { validBook } from "../data/bookData.js";

test.describe("PUT /api/books/:id", () => {
  test("updates an existing book", async ({ request, book }) => {
    const updatedBook = {
      ...validBook,
      title: "Updated Test Book",
      author: "Updated Author",
      category: "Updated Category",
      price: 50,
      stock: 20,
      isbn: "978-0132350999",
      description: "Updated book description",
    };

    const response = await request.put(`/api/books/${book.id}`, {
      data: updatedBook,
    });

    expect(response.status()).toBe(200);

    const updatedBookResponse = await response.json();

    expect(updatedBookResponse.id).toBe(book.id);
    expect(updatedBookResponse.title).toBe(updatedBook.title);
    expect(updatedBookResponse.author).toBe(updatedBook.author);
    expect(updatedBookResponse.category).toBe(updatedBook.category);
    expect(Number(updatedBookResponse.price)).toBe(updatedBook.price);
    expect(updatedBookResponse.stock).toBe(updatedBook.stock);
    expect(updatedBookResponse.isbn).toBe(updatedBook.isbn);
    expect(updatedBookResponse.description).toBe(updatedBook.description);

    expect(updatedBookResponse.createdAt).toBeTruthy();
    expect(updatedBookResponse.updatedAt).toBeTruthy();
  });

  test("returns 404 for non-existing book", async ({ request }) => {
    const response = await request.put("/api/books/999999", {
      data: validBook,
    });

    expect(response.status()).toBe(404);

    const body = await response.json();

    expect(body.error).toBe("Book not found");
  });

  test("returns 400 for invalid id", async ({ request }) => {
    const response = await request.put("/api/books/abc", {
      data: validBook,
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe("Invalid book ID");
  });

  test("returns 400 when required field is missing", async ({
    request,
    book,
  }) => {
    const { isbn, ...bookWithoutIsbn } = validBook;

    const response = await request.put(`/api/books/${book.id}`, {
      data: bookWithoutIsbn,
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe("Validation failed");
    expect(body.details).toContain("ISBN is required");
  });

  test("returns 409 when ISBN already exists", async ({ request, book }) => {
    let secondBookId;

    try {
      const secondBookResponse = await request.post("/api/books", {
        data: {
          ...validBook,
          title: "Second Test Book",
          isbn: "978-0132350998",
        },
      });

      expect(secondBookResponse.status()).toBe(201);

      const secondBook = await secondBookResponse.json();
      secondBookId = secondBook.id;

      const response = await request.put(`/api/books/${book.id}`, {
        data: {
          ...validBook,
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
});
