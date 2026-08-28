import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const books = [
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    price: 45.99,
    stock: 10,
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    category: "Programming",
    price: 39.99,
    stock: 8,
  },
  {
    title: "JavaScript: The Good Parts",
    author: "Douglas Crockford",
    category: "Programming",
    price: 29.99,
    stock: 15,
  },
];

async function main() {
  await prisma.book.createMany({
    data: books,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
