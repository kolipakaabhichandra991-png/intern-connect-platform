const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const interns = await prisma.internProfile.findMany({
    include: { user: true }
  });
  console.log("Interns:");
  interns.forEach(i => console.log(`ID: ${i.id}, UserID: ${i.userId}, AdminID: ${i.adminId}, Name: ${i.name}`));
}
main().catch(console.error).finally(() => prisma.$disconnect());
