import { invalidLoginData } from "../data/authData.js";
import { test, expect } from "../fixtures/userFixture.js";

test.describe("POST /api/auth/login", () => {
  test("rejects login with a non-existing email", async ({ request }) => {
    const response = await request.post("/api/auth/login", {
      data: invalidLoginData,
    });

    expect(response.status()).toBe(401);

    const body = await response.json();

    expect(body.error).toBe("Invalid email or password");
  });
});

test("rejects login with an incorrect password for an existing user", async ({
  request,
  testUser,
}) => {
  const response = await request.post("/api/auth/login", {
    data: {
      email: testUser.email,
      password: "WrongPassword123",
    },
  });

  expect(response.status()).toBe(401);

  const body = await response.json();
  expect(body.error).toBe("Invalid email or password");
});

test("logs in successfully with valid credentials", async ({
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

  const body = await loginResponse.json();

  expect(body.token).toBeTruthy();
  expect(typeof body.token).toBe("string");
});
