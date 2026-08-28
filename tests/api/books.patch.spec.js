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

    expect(updatedBook.price).toBe(99.99);
    expect(updatedBook.title).toBe(book.title);
    expect(updatedBook.author).toBe(book.author);
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

  test("returns 400 when no valid fields are provided", async ({ request, book }) => {
    const response = await request.patch(`/api/books/${book.id}`, {
      data: {},
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.details).toContain("Provide at least one field to update");
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
