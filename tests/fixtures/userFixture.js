import { test as base } from "@playwright/test";
import prisma from "../../src/config/prisma.js";

export const test = base.extend({
  testUser: async ({ request }, use) => {
    const email = `test-user-${Date.now()}@example.com`;
    const password = "CorrectPassword123";

    const response = await request.post("/api/auth/register", {
      data: {
        name: "Test User",
        email,
        password,
      },
    });

    if (response.status() !== 201) {
      throw new Error("Failed to create test user");
    }

    try {
      await use({ email, password });
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
