import prisma from "../config/prisma.js";

const findBooks = async ({
  category,
  search,
  author,
  minPrice,
  maxPrice,
  inStock,
  sort,
  page,
  limit,
}) => {
  const where = {};

  if (category) {
    where.category = category;
  }

  if (search) {
    where.title = {
      contains: search,
      mode: "insensitive",
    };
  }

  if (author) {
    where.author = {
      contains: author,
      mode: "insensitive",
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};

    if (minPrice !== undefined) {
      where.price.gte = minPrice;
    }

    if (maxPrice !== undefined) {
      where.price.lte = maxPrice;
    }
  }

  if (inStock === true) {
    where.stock = {
      gt: 0,
    };
  }

  if (inStock === false) {
    where.stock = {
      equals: 0,
    };
  }

  const sortOptions = {
    price_asc: { price: "asc" },
    price_desc: { price: "desc" },
    title_asc: { title: "asc" },
    title_desc: { title: "desc" },
    createdAt_asc: { createdAt: "asc" },
    createdAt_desc: { createdAt: "desc" },
  };

  const orderBy = sortOptions[sort] ?? { id: "asc" };

  const offset = (page - 1) * limit;

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
    }),

    prisma.book.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: books,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

const createBook = async ({
  title,
  author,
  category,
  price,
  stock,
  isbn,
  description,
}) => {
  return prisma.book.create({
    data: {
      title,
      author,
      category,
      price,
      stock,
      isbn,
      description,
    },
  });
};

const findBookById = async (id) => {
  return prisma.book.findUnique({
    where: {
      id: Number(id),
    },
  });
};

const updateBook = async (
  id,
  { title, author, category, price, stock, isbn, description },
) => {
  try {
    return await prisma.book.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        author,
        category,
        price,
        stock,
        isbn,
        description,
      },
    });
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }

    throw error;
  }
};

const patchBook = async (id, bookData) => {
  const allowedFields = [
    "title",
    "author",
    "category",
    "price",
    "stock",
    "isbn",
    "description",
  ];

  const data = {};

  for (const [key, value] of Object.entries(bookData)) {
    if (allowedFields.includes(key)) {
      data[key] = value;
    }
  }

  if (Object.keys(data).length === 0) {
    return null;
  }

  try {
    return await prisma.book.update({
      where: {
        id: Number(id),
      },
      data,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }

    throw error;
  }
};

const deleteBook = async (id) => {
  try {
    return await prisma.book.delete({
      where: {
        id: Number(id),
      },
    });
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }

    throw error;
  }
};

export {
  findBooks as getBooks,
  createBook,
  findBookById as getBookById,
  updateBook,
  patchBook,
  deleteBook,
};
