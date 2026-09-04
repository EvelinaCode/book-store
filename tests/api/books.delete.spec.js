import { test, expect } from "../fixtures/bookFixture.js";

test.describe("DELETE /api/books/:id", () => {
  test("deletes an existing book", async ({ request, book }) => {
    const response = await request.delete(`/api/books/${book.id}`);

    expect(response.status()).toBe(204);

    const responseBody = await response.body();

    expect(responseBody.length).toBe(0);

    const getResponse = await request.get(`/api/books/${book.id}`);

    expect(getResponse.status()).toBe(404);

    const body = await getResponse.json();

    expect(body.error).toBe("Book not found");
  });

  test("returns 404 for non-existing book", async ({ request }) => {
    const response = await request.delete("/api/books/999999");

    expect(response.status()).toBe(404);

    const body = await response.json();

    expect(body.error).toBe("Book not found");
  });

  test("returns 400 for invalid id", async ({ request }) => {
    const response = await request.delete("/api/books/abc");

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe("Invalid book ID");
  });
});
