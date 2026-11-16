import { test, expect } from "../fixtures/userFixture.js";

test.describe("Book authorization", () => {
  test("POST returns 401 when no token is provided", async ({ request }) => {
    const response = await request.post("/api/books", {
      data: {
        title: "Unauthorized Book",
        author: "Test Author",
        category: "Testing",
        price: 50,
        stock: 10,
        isbn: "978-0132350888",
        description: "Book created without authentication",
      },
    });

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.error).toBe("Authentication required");
  });

  test("POST returns 403 when USER tries to create a book", async ({
    request,
    testUser,
  }) => {
    const response = await request.post("/api/books", {
      data: {
        title: "USER Book",
        author: "Test Author",
        category: "Testing",
        price: 50,
        stock: 10,
        isbn: "978-0132350889",
        description: "Book created by regular user",
      },
      headers: {
        Authorization: `Bearer ${testUser.token}`,
      },
    });

    expect(response.status()).toBe(403);

    const body = await response.json();
    expect(body.error).toBe("Forbidden");
  });

  test("PUT returns 401 when no token is provided", async ({ request }) => {
    const response = await request.put("/api/books/999999");

    expect(response.status()).toBe(401);
  });

  test("PUT returns 403 when USER tries to update a book", async ({
    request,
    testUser,
  }) => {
    const response = await request.put("/api/books/999999", {
      headers: {
        Authorization: `Bearer ${testUser.token}`,
      },
    });

    expect(response.status()).toBe(403);
  });

  test("PATCH returns 401 when no token is provided", async ({ request }) => {
    const response = await request.patch("/api/books/999999");

    expect(response.status()).toBe(401);
  });

  test("PATCH returns 403 when USER tries to update a book", async ({
    request,
    testUser,
  }) => {
    const response = await request.patch("/api/books/999999", {
      headers: {
        Authorization: `Bearer ${testUser.token}`,
      },
    });

    expect(response.status()).toBe(403);
  });

  test("DELETE returns 401 when no token is provided", async ({ request }) => {
    const response = await request.delete("/api/books/999999");

    expect(response.status()).toBe(401);
  });

  test("DELETE returns 403 when USER tries to delete a book", async ({
    request,
    testUser,
  }) => {
    const response = await request.delete("/api/books/999999", {
      headers: {
        Authorization: `Bearer ${testUser.token}`,
      },
    });

    expect(response.status()).toBe(403);
  });
});
