import prisma from "../config/prisma.js";

const findBooks = async ({ category, search, sort, page, limit }) => {
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

  let orderBy;

  if (sort === "price_asc") {
    orderBy = {
      price: "asc",
    };
  }

  if (sort === "price_desc") {
    orderBy = {
      price: "desc",
    };
  }

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

const createBook = async ({ title, author, category, price, stock }) => {
  return prisma.book.create({
    data: {
      title,
      author,
      category,
      price,
      stock,
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

const updateBook = async (id, { title, author, category, price, stock }) => {
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
  const allowedFields = ["title", "author", "category", "price", "stock"];

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
  findBooks,
  createBook,
  findBookById,
  updateBook,
  patchBook,
  deleteBook,
};
