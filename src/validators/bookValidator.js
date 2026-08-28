const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim() !== "";

const validateCreateBook = (book) => {
  const errors = [];

  if (!book || typeof book !== "object" || Array.isArray(book)) {
    return ["Book must be a JSON object"];
  }

  if (!isNonEmptyString(book.title)) {
    errors.push("Title is required");
  }

  if (!isNonEmptyString(book.author)) {
    errors.push("Author is required");
  }

  if (!isNonEmptyString(book.category)) {
    errors.push("Category is required");
  }

  if (book.price === undefined || book.price === null) {
    errors.push("Price is required");
  } else if (typeof book.price !== "number" || book.price < 0) {
    errors.push("Price must be a non-negative number");
  }

  if (book.stock === undefined || book.stock === null) {
    errors.push("Stock is required");
  } else if (!Number.isInteger(book.stock) || book.stock < 0) {
    errors.push("Stock must be a non-negative integer");
  }

  return errors;
};

const validatePatchBook = (book) => {
  const errors = [];
  const allowedFields = ["title", "author", "category", "price", "stock"];

  if (!book || typeof book !== "object" || Array.isArray(book)) {
    return ["Book must be a JSON object"];
  }

  const fields = Object.keys(book);

  if (fields.length === 0) {
    errors.push("Provide at least one field to update");
  }

  for (const field of fields) {
    if (!allowedFields.includes(field)) {
      errors.push(`Unknown field: ${field}`);
    }
  }

  if (
    book.price !== undefined &&
    (typeof book.price !== "number" || book.price < 0)
  ) {
    errors.push("Price must be a non-negative number");
  }

  if (
    book.stock !== undefined &&
    (!Number.isInteger(book.stock) || book.stock < 0)
  ) {
    errors.push("Stock must be a non-negative integer");
  }

  if (book.title !== undefined && !isNonEmptyString(book.title)) {
    errors.push("Title cannot be empty");
  }

  if (book.author !== undefined && !isNonEmptyString(book.author)) {
    errors.push("Author cannot be empty");
  }

  if (book.category !== undefined && !isNonEmptyString(book.category)) {
    errors.push("Category cannot be empty");
  }

  return errors;
};

const validateBookQuery = ({ page, limit, category, search, sort }) => {
  const errors = [];

  if (page !== undefined) {
    const pageNumber = Number(page);

    if (!Number.isInteger(pageNumber) || pageNumber < 1) {
      errors.push("page must be a positive integer");
    }
  }

  if (limit !== undefined) {
    const limitNumber = Number(limit);

    if (
      !Number.isInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 100
    ) {
      errors.push("limit must be an integer between 1 and 100");
    }
  }

  if (category !== undefined && typeof category !== "string") {
    errors.push("category must be a string");
  }

  if (search !== undefined && typeof search !== "string") {
    errors.push("search must be a string");
  }

  if (
    sort !== undefined &&
    sort !== "price_asc" &&
    sort !== "price_desc"
  ) {
    errors.push("sort must be price_asc or price_desc");
  }

  return errors;
};

export { validateCreateBook, validatePatchBook, validateBookQuery };
