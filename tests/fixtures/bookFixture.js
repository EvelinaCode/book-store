import { test as base } from "@playwright/test";
import { validBook } from "../data/bookData.js";

export const test = base.extend({
  book: async ({ request }, use) => {
    const response = await request.post("/api/books", {
      data: validBook,
    });

    if (response.status() !== 201) {
      throw new Error("Failed to create test book");
    }

    const book = await response.json();

    await use(book);

    await request.delete(`/api/books/${book.id}`);
  },
});

export { expect } from "@playwright/test";
