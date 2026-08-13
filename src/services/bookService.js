import {
  findBooks,
  findBookById,
  createBook as createBookRepository,
  updateBook as updateBookRepository,
  patchBook as patchBookRepository,
  deleteBook as deleteBookRepository,
} from "../repositories/bookRepository.js";

const getBooks = async (query) => {
  return await findBooks(query);
};

const getBookById = async (id) => {
  return await findBookById(id);
};

const createBook = async (bookData) => {
  return await createBookRepository(bookData);
};

const updateBook = async (id, bookData) => {
  return await updateBookRepository(id, bookData);
};

const patchBook = async (id, bookData) => {
  return await patchBookRepository(id, bookData);
};

const deleteBook = async (id) => {
  return await deleteBookRepository(id);
};

export { getBookById, createBook, updateBook, patchBook, deleteBook, getBooks };
