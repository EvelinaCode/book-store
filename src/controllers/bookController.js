import {
  getBooks as getBooksService,
  getBookById as getBookByIdService,
  createBook as createBookService,
  updateBook as updateBookService,
  patchBook as patchBookService,
  deleteBook as deleteBookService,
} from "../services/bookService.js";

import {
  validateCreateBook,
  validatePatchBook,
} from "../validators/bookValidator.js";

import { validateBookQuery } from "../validators/bookQueryValidator.js";

import AppError from "../errors/AppError.js";

const getAllBooks = async (req, res) => {
  const errors = validateBookQuery(req.query);

  if (errors.length > 0) {
    throw new AppError("Validation failed", 400, errors);
  }

  const {
    page,
    limit,
    search,
    category,
    author,
    minPrice,
    maxPrice,
    inStock,
    sort,
  } = req.query;

  const query = {
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    search,
    category,
    author,
    minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
    maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
    inStock: inStock !== undefined ? inStock === "true" : undefined,
    sort,
  };

  const books = await getBooksService(query);

  res.json(books);
};

const getBookById = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("Invalid book ID", 400);
  }

  const book = await getBookByIdService(id);

  if (!book) {
    throw new AppError("Book not found", 404);
  }

  res.json(book);
};

const createBook = async (req, res) => {
  const errors = validateCreateBook(req.body);

  if (errors.length > 0) {
    throw new AppError("Validation failed", 400, errors);
  }

  const newBook = await createBookService(req.body);

  res.status(201).json(newBook);
};

const updateBook = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("Invalid book ID", 400);
  }

  const errors = validateCreateBook(req.body);

  if (errors.length > 0) {
    throw new AppError("Validation failed", 400, errors);
  }

  const updatedBook = await updateBookService(id, req.body);

  if (!updatedBook) {
    throw new AppError("Book not found", 404);
  }

  res.json(updatedBook);
};

const patchBook = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("Invalid book ID", 400);
  }

  const errors = validatePatchBook(req.body);

  if (errors.length > 0) {
    throw new AppError("Validation failed", 400, errors);
  }

  const updatedBook = await patchBookService(id, req.body);

  if (!updatedBook) {
    throw new AppError("Book not found", 404);
  }

  res.json(updatedBook);
};

const deleteBook = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("Invalid book ID", 400);
  }

  const deletedBook = await deleteBookService(id);

  if (!deletedBook) {
    throw new AppError("Book not found", 404);
  }

  res.status(204).send();
};

export {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  patchBook,
  deleteBook,
};
