import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";

import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  patchBook,
  deleteBook,
} from "../controllers/bookController.js";
const router = express.Router();

router.get("/", asyncHandler(getAllBooks));
router.get("/:id", asyncHandler(getBookById));

router.post("/", asyncHandler(createBook));

router.put("/:id", asyncHandler(updateBook));
router.patch("/:id", asyncHandler(patchBook));
router.delete("/:id", asyncHandler(deleteBook));

export default router;
