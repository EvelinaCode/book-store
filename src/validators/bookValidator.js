const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim() !== "";

const isNonNegativeNumber = (value) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

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

  if (!isNonEmptyString(book.isbn)) {
    errors.push("ISBN is required");
  }

  if (book.description !== undefined && !isNonEmptyString(book.description)) {
    errors.push("Description cannot be empty");
  }

  if (book.price === undefined || book.price === null) {
    errors.push("Price is required");
  } else if (!isNonNegativeNumber(book.price)) {
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

  const allowedFields = [
    "title",
    "author",
    "category",
    "price",
    "stock",
    "isbn",
    "description",
  ];

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

  if (book.title !== undefined && !isNonEmptyString(book.title)) {
    errors.push("Title cannot be empty");
  }

  if (book.author !== undefined && !isNonEmptyString(book.author)) {
    errors.push("Author cannot be empty");
  }

  if (book.category !== undefined && !isNonEmptyString(book.category)) {
    errors.push("Category cannot be empty");
  }

  if (book.isbn !== undefined && !isNonEmptyString(book.isbn)) {
    errors.push("ISBN cannot be empty");
  }

  if (book.description !== undefined && !isNonEmptyString(book.description)) {
    errors.push("Description cannot be empty");
  }

  if (book.price !== undefined && !isNonNegativeNumber(book.price)) {
    errors.push("Price must be a non-negative number");
  }

  if (
    book.stock !== undefined &&
    (!Number.isInteger(book.stock) || book.stock < 0)
  ) {
    errors.push("Stock must be a non-negative integer");
  }

  return errors;
};

export { validateCreateBook, validatePatchBook };
