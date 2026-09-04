import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const books = [
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    price: 45.99,
    stock: 10,
    description: "A handbook of agile software craftsmanship.",
    isbn: "9780132350884",
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    category: "Programming",
    price: 39.99,
    stock: 8,
    description: "A practical guide to becoming a better programmer.",
    isbn: "9780135957059",
  },
  {
    title: "JavaScript: The Good Parts",
    author: "Douglas Crockford",
    category: "Programming",
    price: 29.99,
    stock: 15,
    description: "An introduction to the good features of JavaScript.",
    isbn: "9780596517748",
  },
  {
    title: "Design Patterns",
    author: "Erich Gamma",
    category: "Programming",
    price: 49.99,
    stock: 6,
    description: "Reusable solutions to common software design problems.",
    isbn: "9780201633610",
  },
  {
    title: "Refactoring",
    author: "Martin Fowler",
    category: "Programming",
    price: 54.99,
    stock: 7,
    description: "Improving the design of existing code.",
    isbn: "9780134757599",
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    price: 24.99,
    stock: 12,
    description: "Bilbo Baggins goes on an unexpected adventure.",
    isbn: "9780261102217",
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    category: "Science Fiction",
    price: 32.99,
    stock: 9,
    description: "A science fiction epic set on the desert planet Arrakis.",
    isbn: "9780441172719",
  },
  {
    title: "1984",
    author: "George Orwell",
    category: "Dystopian",
    price: 19.99,
    stock: 20,
    description: "A dystopian novel about surveillance and totalitarianism.",
    isbn: "9780451524935",
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Classic",
    price: 18.99,
    stock: 11,
    description: "A classic novel set in the Jazz Age.",
    isbn: "9780743273565",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Romance",
    price: 17.99,
    stock: 14,
    description: "A classic story of love, family, and social expectations.",
    isbn: "9780141439518",
  },
];

async function main() {
  const count = await prisma.book.count();

  if (count > 0) {
    console.log("Books already exist. Skipping seed.");
    return;
  }

  await prisma.book.createMany({
    data: books,
  });

  console.log("10 books created successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
