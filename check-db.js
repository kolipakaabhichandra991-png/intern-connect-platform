const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const reviews = await prisma.review.findMany({
    include: { intern: true }
  });
  console.log("Total Reviews:", reviews.length);
  if (reviews.length > 0) {
    console.log("First Review Intern ID:", reviews[0].internId);
    console.log("First Review Intern Name:", reviews[0].intern?.name);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
