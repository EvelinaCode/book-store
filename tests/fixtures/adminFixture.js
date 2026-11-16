import { test as base, expect } from "@playwright/test";
import bcrypt from "bcrypt";
import prisma from "../../src/config/prisma.js";

export const test = base.extend({
  admin: async ({ request }, use) => {
    const email = `test-admin-${Date.now()}@example.com`;
    const password = "AdminPassword123";

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name: "Test Admin",
        email,
        password: hashedPassword,
        role: "ADMIN",
        isActive: true,
      },
    });

    try {
      const response = await request.post("/api/auth/login", {
        data: { email, password },
      });

      if (response.status() !== 200) {
        throw new Error("Failed to login as admin");
      }

      const { token } = await response.json();

      await use({ email, password, token });
    } finally {
      await prisma.user.deleteMany({
        where: { email },
      });
    }
  },
});

export { expect };
