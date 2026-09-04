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

    try {
      await use(book);
    } finally {
      await request.delete(`/api/books/${book.id}`);
    }
  },

  sortingBooks: async ({ request }, use) => {
    const booksToCreate = [
      {
        title: "Alpha Sorting Book",
        author: "Test Author",
        category: "Sorting Test",
        price: 10,
        stock: 1,
      },
      {
        title: "Bravo Sorting Book",
        author: "Another Author",
        category: "Sorting Test",
        price: 20,
        stock: 1,
      },
      {
        title: "Charlie Sorting Book",
        author: "Test Author",
        category: "Sorting Test",
        price: 30,
        stock: 0,
      },
    ];

    const createdBooks = [];

    try {
      for (const bookData of booksToCreate) {
        const response = await request.post("/api/books", {
          data: bookData,
        });

        if (response.status() !== 201) {
          throw new Error("Failed to create sorting test book");
        }

        createdBooks.push(await response.json());
      }

      await use(createdBooks);
    } finally {
      await Promise.all(
        createdBooks.map((book) => request.delete(`/api/books/${book.id}`)),
      );
    }
  },
});

export { expect } from "@playwright/test";
