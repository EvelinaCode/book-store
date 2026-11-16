import { test, expect } from "../fixtures/adminFixture.js";

test("creates an admin and logs in successfully", async ({ admin }) => {
  expect(admin.email).toContain("test-admin-");
  expect(admin.token).toBeTruthy();
  expect(typeof admin.token).toBe("string");
});
