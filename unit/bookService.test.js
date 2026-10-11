import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  book: {
    findMany: vi.fn(),
    count: vi.fn(),
  },
}));

vi.mock("../src/config/prisma.js", () => ({
  default: prismaMock,
}));

import { getBooks } from "../src/services/bookService.js";

describe("getBooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return paginated books", async () => {
    // Arrange
    const mockBooks = [
      {
        id: 1,
        title: "Book 1",
        author: "Author 1",
        price: 20,
        stock: 5,
      },
    ];

    prismaMock.book.findMany.mockResolvedValue(mockBooks);
    prismaMock.book.count.mockResolvedValue(1);

    // Act
    const result = await getBooks({
      page: 1,
      limit: 10,
    });

    // Assert - result
    expect(result).toEqual({
      data: mockBooks,
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    });

    // Assert - Prisma queries
    expect(prismaMock.book.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.book.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { id: "asc" },
      skip: 0,
      take: 10,
    });

    expect(prismaMock.book.count).toHaveBeenCalledTimes(1);
    expect(prismaMock.book.count).toHaveBeenCalledWith({
      where: {},
    });
  });
});
