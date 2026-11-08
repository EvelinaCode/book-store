import { test, expect } from "../fixtures/userFixture.js";
import {
  validRegistrationData,
  duplicateRegistrationData,
  shortPassword,
  invalidEmail,
} from "../data/authData.js";

test.describe("POST /api/auth/register", () => {
  test("registers a new user successfully", async ({
    request,
    cleanupUser,
  }) => {
    const email = `register-test-${Date.now()}@example.com`;

    const response = await request.post("/api/auth/register", {
      data: {
        ...validRegistrationData,
        email,
      },
    });

    await cleanupUser(email);

    expect(response.status()).toBe(201);

    const body = await response.json();

    expect(body.id).toBeTruthy();
    expect(body.name).toBe(validRegistrationData.name);
    expect(body.email).toBe(email);
    expect(body.password).toBeUndefined();
  });

  test("rejects registration with an existing email", async ({
    request,
    cleanupUser,
  }) => {
    const email = `register-duplicate-${Date.now()}@example.com`;

    const firstResponse = await request.post("/api/auth/register", {
      data: {
        name: duplicateRegistrationData.firstName,
        email,
        password: duplicateRegistrationData.password,
      },
    });

    await cleanupUser(email);

    expect(firstResponse.status()).toBe(201);

    const secondResponse = await request.post("/api/auth/register", {
      data: {
        name: duplicateRegistrationData.secondName,
        email,
        password: duplicateRegistrationData.password,
      },
    });

    expect(secondResponse.status()).toBe(409);

    const body = await secondResponse.json();
    expect(body.error).toBe("Email already registered");
  });

  test("rejects registration with a short password", async ({ request }) => {
    const response = await request.post("/api/auth/register", {
      data: {
        name: validRegistrationData.name,
        email: `short-password-${Date.now()}@example.com`,
        password: shortPassword,
      },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(JSON.stringify(body)).toContain(
      "Password must be at least 8 characters",
    );
  });

  test("rejects registration with an invalid email", async ({ request }) => {
    const response = await request.post("/api/auth/register", {
      data: {
        name: validRegistrationData.name,
        email: invalidEmail,
        password: validRegistrationData.password,
      },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(JSON.stringify(body)).toContain("Invalid email");
  });
});

test("creates a user with default role and active status", async ({
  request,
  db,
  cleanupUser,
}) => {
  const email = `default-user-${Date.now()}@example.com`;

  const response = await request.post("/api/auth/register", {
    data: {
      name: "Default User",
      email,
      password: validRegistrationData.password,
    },
  });

  await cleanupUser(email);

  expect(response.status()).toBe(201);

  const user = await db.user.findUnique({
    where: { email },
  });

  expect(user).not.toBeNull();
  expect(user.role).toBe("USER");
  expect(user.isActive).toBe(true);
});

test("does not allow public registration with ADMIN role", async ({
  request,
  db,
  cleanupUser,
}) => {
  const email = `admin-attempt-${Date.now()}@example.com`;

  const response = await request.post("/api/auth/register", {
    data: {
      name: "Admin Attempt",
      email,
      password: validRegistrationData.password,
      role: "ADMIN",
      isActive: false,
    },
  });

  await cleanupUser(email);

  expect(response.status()).toBe(201);

  const user = await db.user.findUnique({
    where: { email },
  });

  expect(user).not.toBeNull();
  expect(user.role).toBe("USER");
  expect(user.isActive).toBe(true);
});
