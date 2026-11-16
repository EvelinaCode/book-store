import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import {
  createBookSchema,
  patchBookSchema,
} from "../validators/bookSchemas.js";
import { bookQuerySchema } from "../validators/bookQuerySchema.js";
import { validate } from "../middleware/validate.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/authorizeRole.js";

import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  patchBook,
  deleteBook,
} from "../controllers/bookController.js";

const router = express.Router();

// Public routes
router.get("/", validate(bookQuerySchema, "query"), asyncHandler(getAllBooks));
router.get("/:id", asyncHandler(getBookById));

// Admin-only routes
router.post(
  "/",
  authenticateToken,
  authorizeRole("ADMIN"),
  validate(createBookSchema),
  asyncHandler(createBook),
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRole("ADMIN"),
  validate(createBookSchema),
  asyncHandler(updateBook),
);

router.patch(
  "/:id",
  authenticateToken,
  authorizeRole("ADMIN"),
  validate(patchBookSchema),
  asyncHandler(patchBook),
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("ADMIN"),
  asyncHandler(deleteBook),
);

export default router;
