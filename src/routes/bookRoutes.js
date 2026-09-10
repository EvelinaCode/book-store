import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import {
  createBookSchema,
  patchBookSchema,
} from "../validators/bookSchemas.js";
import { bookQuerySchema } from "../validators/bookQuerySchema.js";
import { validate } from "../middleware/validate.js";

import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  patchBook,
  deleteBook,
} from "../controllers/bookController.js";
const router = express.Router();

router.get("/", validate(bookQuerySchema, "query"), asyncHandler(getAllBooks));
router.get("/:id", asyncHandler(getBookById));

router.post("/", validate(createBookSchema), asyncHandler(createBook));

router.put("/:id", validate(createBookSchema), asyncHandler(updateBook));
router.patch("/:id", validate(patchBookSchema), asyncHandler(patchBook));
router.delete("/:id", asyncHandler(deleteBook));

export default router;
