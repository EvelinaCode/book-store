import pool from "../db/db.js";

const findBooks = async ({ category, search, sort, page, limit }) => {
  let query = "SELECT * FROM books";

  const values = [];
  const conditions = [];

  if (category) {
    conditions.push(`category = $${values.length + 1}`);

    values.push(category);
  }

  if (search) {
    conditions.push(`title ILIKE $${values.length + 1}`);

    values.push(`%${search}%`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const countQuery = `
        SELECT COUNT(*)
        FROM books
        ${conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : ""}
    `;

  const countValues = [...values];

  const countResult = await pool.query(countQuery, countValues);

  const total = Number(countResult.rows[0].count);

  const totalPages = Math.ceil(total / limit);

  if (sort === "price_asc") {
    query += " ORDER BY price ASC";
  }

  if (sort === "price_desc") {
    query += " ORDER BY price DESC";
  }

  const offset = (page - 1) * limit;

  query += ` LIMIT $${values.length + 1}`;
  values.push(limit);

  query += ` OFFSET $${values.length + 1}`;
  values.push(offset);

  const result = await pool.query(query, values);

  return {
    data: result.rows,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

const createBook = async ({ title, author, category, price, stock }) => {
  const query = `
        INSERT INTO books
            (title, author, category, price, stock)
        VALUES
            ($1, $2, $3, $4, $5)
        RETURNING *
    `;

  const values = [title, author, category, price, stock];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const findBookById = async (id) => {
  const query = `
        SELECT *
        FROM books
        WHERE id = $1
    `;

  const result = await pool.query(query, [id]);

  return result.rows[0] || null;
};

const updateBook = async (id, { title, author, category, price, stock }) => {
  const query = `
        UPDATE books
        SET
            title = $1,
            author = $2,
            category = $3,
            price = $4,
            stock = $5
        WHERE id = $6
        RETURNING *
    `;

  const values = [title, author, category, price, stock, id];

  const result = await pool.query(query, values);

  return result.rows[0] || null;
};

const patchBook = async (id, bookData) => {
  const allowedFields = ["title", "author", "category", "price", "stock"];

  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(bookData)) {
    if (!allowedFields.includes(key)) {
      continue;
    }

    fields.push(`${key} = $${values.length + 1}`);
    values.push(value);
  }

  if (fields.length === 0) {
    return null;
  }

  values.push(id);

  const query = `
        UPDATE books
        SET ${fields.join(", ")}
        WHERE id = $${values.length}
        RETURNING *
    `;

  const result = await pool.query(query, values);

  return result.rows[0] || null;
};

const deleteBook = async (id) => {
  const query = `
        DELETE FROM books
        WHERE id = $1
        RETURNING *
    `;

  const result = await pool.query(query, [id]);

  return result.rows[0] || null;
};

export {
  findBooks,
  createBook,
  findBookById,
  updateBook,
  patchBook,
  deleteBook,
};
