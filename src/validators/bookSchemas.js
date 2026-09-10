import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string({ error: "Title is required" }).min(1, "Title is required"),

  author: z
    .string({ error: "Author is required" })
    .min(1, "Author is required"),

  category: z
    .string({ error: "Category is required" })
    .min(1, "Category is required"),

  price: z
    .number({ error: "Price must be a non-negative number" })
    .nonnegative("Price must be a non-negative number"),

  stock: z
    .number({ error: "Stock must be a non-negative integer" })
    .int("Stock must be a non-negative integer")
    .nonnegative("Stock must be a non-negative integer"),

  description: z.string().optional(),

  isbn: z.string({ error: "ISBN is required" }).min(1, "ISBN is required"),
});

export const patchBookSchema = z
  .object({
    title: z
      .string({ error: "Title cannot be empty" })
      .min(1, "Title cannot be empty")
      .optional(),

    author: z
      .string({ error: "Author cannot be empty" })
      .min(1, "Author cannot be empty")
      .optional(),

    category: z
      .string({ error: "Category cannot be empty" })
      .min(1, "Category cannot be empty")
      .optional(),

    price: z
      .number({ error: "Price must be a non-negative number" })
      .nonnegative("Price must be a non-negative number")
      .optional(),

    stock: z
      .number({ error: "Stock must be a non-negative integer" })
      .int("Stock must be a non-negative integer")
      .nonnegative("Stock must be a non-negative integer")
      .optional(),

    isbn: z
      .string({ error: "ISBN cannot be empty" })
      .min(1, "ISBN cannot be empty")
      .optional(),

    description: z
      .string({ error: "Description cannot be empty" })
      .min(1, "Description cannot be empty")
      .optional(),
  })
  .strict();
