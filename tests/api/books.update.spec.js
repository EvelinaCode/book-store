import { test, expect } from "../fixtures/bookFixture.js";
import { validBook } from "../data/bookData.js";

test.describe("PUT /api/books/:id", () => {
  test("updates an existing book", async ({ request, book }) => {
    const updatedBook = {
      ...validBook,
      title: "Updated Test Book",
      price: 50,
      stock: 20,
    };

    const response = await request.put(`/api/books/${book.id}`, {
      data: updatedBook,
    });

    expect(response.status()).toBe(200);

    const updatedBookResponse = await response.json();

    expect(updatedBookResponse.id).toBe(book.id);
    expect(updatedBookResponse.title).toBe("Updated Test Book");
    expect(updatedBookResponse.price).toBe(50);
    expect(updatedBookResponse.stock).toBe(20);
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
});
