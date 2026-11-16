import { test as base } from "@playwright/test";
import prisma from "../../src/config/prisma.js";

export const test = base.extend({
  db: async ({}, use) => {
    await use(prisma);
  },

  testUser: async ({ request }, use) => {
    const email = `test-user-${Date.now()}@example.com`;
    const password = "CorrectPassword123";

    const registerResponse = await request.post("/api/auth/register", {
      data: {
        name: "Test User",
        email,
        password,
      },
    });

    if (registerResponse.status() !== 201) {
      throw new Error("Failed to create test user");
    }

    try {
      const loginResponse = await request.post("/api/auth/login", {
        data: {
          email,
          password,
        },
      });

      if (loginResponse.status() !== 200) {
        throw new Error("Failed to login as test user");
      }

      const { token } = await loginResponse.json();

      await use({ email, password, token });
    } finally {
      await prisma.user.deleteMany({
        where: { email },
      });
    }
  },

  cleanupUser: async ({}, use) => {
    const emailsToClean = [];

    await use(async (email) => {
      emailsToClean.push(email);
    });

    await prisma.user.deleteMany({
      where: {
        email: { in: emailsToClean },
      },
    });
  },
});

export { expect } from "@playwright/test";
