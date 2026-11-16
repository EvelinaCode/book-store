import { test, expect } from "../fixtures/bookFixture.js";

test.describe("DELETE /api/books/:id", () => {
  test("deletes an existing book", async ({ request, book, admin }) => {
    const headers = {
      Authorization: `Bearer ${admin.token}`,
    };

    const response = await request.delete(`/api/books/${book.id}`, {
      headers,
    });

    expect(response.status()).toBe(204);

    const responseBody = await response.body();

    expect(responseBody.length).toBe(0);

    // GET is public, so no authorization header is needed.
    const getResponse = await request.get(`/api/books/${book.id}`);

    expect(getResponse.status()).toBe(404);

    const body = await getResponse.json();

    expect(body.error).toBe("Book not found");
  });

  test("returns 404 for non-existing book", async ({ request, admin }) => {
    const response = await request.delete("/api/books/999999", {
      headers: {
        Authorization: `Bearer ${admin.token}`,
      },
    });

    expect(response.status()).toBe(404);

    const body = await response.json();

    expect(body.error).toBe("Book not found");
  });

  test("returns 400 for invalid id", async ({ request, admin }) => {
    const response = await request.delete("/api/books/abc", {
      headers: {
        Authorization: `Bearer ${admin.token}`,
      },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe("Invalid book ID");
  });
});
