const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    // 1. Find the main admin account
    let admin = await prisma.user.findFirst({
      where: { email: 'abhichandra.belvo@gmail.com' }
    });

    if (!admin) {
      // Fallback to the first admin if the main one isn't found
      admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
      });
    }

    if (!admin) {
      console.log('No admins found in the database. Exiting.');
      process.exit(0);
    }

    console.log(`Assigning legacy interns to admin: ${admin.email} (ID: ${admin.id})`);

    // 2. Reassign all interns where adminId is null
    const result = await prisma.internProfile.updateMany({
      where: {
        adminId: null
      },
      data: {
        adminId: admin.id
      }
    });

    console.log(`Successfully reassigned ${result.count} legacy interns!`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
