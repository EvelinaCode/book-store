import { z } from "zod";

const allowedSorts = [
  "price_asc",
  "price_desc",
  "title_asc",
  "title_desc",
  "createdAt_asc",
  "createdAt_desc",
];

export const bookQuerySchema = z
  .object({
    page: z
      .string()
      .regex(/^\d+$/, "page must be a positive integer")
      .transform(Number)
      .refine((value) => value >= 1, {
        message: "page must be a positive integer",
      })
      .optional(),

    limit: z
      .string()
      .regex(/^\d+$/, "limit must be an integer between 1 and 100")
      .transform(Number)
      .refine((value) => value >= 1 && value <= 100, {
        message: "limit must be an integer between 1 and 100",
      })
      .optional(),

    search: z.string().min(1, "search must be a non-empty string").optional(),

    category: z
      .string()
      .min(1, "category must be a non-empty string")
      .optional(),

    author: z.string().min(1, "author must be a non-empty string").optional(),

    minPrice: z
      .string()
      .regex(/^\d+(\.\d+)?$/, "minPrice must be a non-negative number")
      .transform(Number)
      .optional(),

    maxPrice: z
      .string()
      .regex(/^\d+(\.\d+)?$/, "maxPrice must be a non-negative number")
      .transform(Number)
      .optional(),

    inStock: z
      .enum(["true", "false"], {
        error: "inStock must be true or false",
      })
      .optional(),

    sort: z
      .enum(allowedSorts, {
        error: `sort must be one of: ${allowedSorts.join(", ")}`,
      })
      .optional(),
  })
  .strict()
  .superRefine((query, ctx) => {
    if (
      query.minPrice !== undefined &&
      query.maxPrice !== undefined &&
      query.minPrice > query.maxPrice
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["minPrice"],
        message: "minPrice cannot be greater than maxPrice",
      });
    }
  });
