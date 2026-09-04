const allowedSorts = ["price_asc", "price_desc", "title_asc", "title_desc"];

const isValidNonNegativeQueryNumber = (value) =>
  typeof value === "string" &&
  value.trim() !== "" &&
  Number.isFinite(Number(value)) &&
  Number(value) >= 0;

const validatePagination = ({ page, limit }) => {
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

  return errors;
};

const validateTextFilters = ({ search, category, author }) => {
  const errors = [];

  const filters = { search, category, author };

  for (const [name, value] of Object.entries(filters)) {
    if (
      value !== undefined &&
      (typeof value !== "string" || value.trim() === "")
    ) {
      errors.push(`${name} must be a non-empty string`);
    }
  }

  return errors;
};

const validatePriceRange = ({ minPrice, maxPrice }) => {
  const errors = [];

  if (minPrice !== undefined && !isValidNonNegativeQueryNumber(minPrice)) {
    errors.push("minPrice must be a non-negative number");
  }

  if (maxPrice !== undefined && !isValidNonNegativeQueryNumber(maxPrice)) {
    errors.push("maxPrice must be a non-negative number");
  }

  if (
    isValidNonNegativeQueryNumber(minPrice) &&
    isValidNonNegativeQueryNumber(maxPrice) &&
    Number(minPrice) > Number(maxPrice)
  ) {
    errors.push("minPrice cannot be greater than maxPrice");
  }

  return errors;
};

const validateInStock = ({ inStock }) => {
  if (inStock !== undefined && inStock !== "true" && inStock !== "false") {
    return ["inStock must be true or false"];
  }

  return [];
};

const validateSort = ({ sort }) => {
  if (sort !== undefined && !allowedSorts.includes(sort)) {
    return [`sort must be one of: ${allowedSorts.join(", ")}`];
  }

  return [];
};

const validateBookQuery = (query) => [
  ...validatePagination(query),
  ...validateTextFilters(query),
  ...validatePriceRange(query),
  ...validateInStock(query),
  ...validateSort(query),
];

export { validateBookQuery };
