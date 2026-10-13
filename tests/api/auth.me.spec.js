import { test, expect } from "../fixtures/userFixture.js";

import jwt from "jsonwebtoken";

test.describe("GET /api/auth/me", () => {
  test("returns the authenticated user with a valid token", async ({
    request,
    testUser,
  }) => {
    const loginResponse = await request.post("/api/auth/login", {
      data: {
        email: testUser.email,
        password: testUser.password,
      },
    });

    expect(loginResponse.status()).toBe(200);

    const loginBody = await loginResponse.json();
    const token = loginBody.token;

    const response = await request.get("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.user.id).toBeTruthy();
    expect(body.user.role).toBe("USER");
  });
});

test("rejects a request without a token", async ({ request }) => {
  const response = await request.get("/api/auth/me");

  expect(response.status()).toBe(401);
});

test("rejects a request with an invalid token", async ({ request }) => {
  const response = await request.get("/api/auth/me", {
    headers: {
      Authorization: "Bearer invalid-token",
    },
  });

  expect(response.status()).toBe(401);
});

test("rejects an expired token", async ({ request }) => {
  const expiredToken = jwt.sign(
    { id: 1, role: "USER" },
    process.env.JWT_SECRET,
    { expiresIn: "-1s" },
  );

  const response = await request.get("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${expiredToken}`,
    },
  });

  expect(response.status()).toBe(401);
});
