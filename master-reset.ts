import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const prisma = new PrismaClient();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function resetAll() {
  console.log("1. Wiping Prisma Database...");
  await prisma.kudo.deleteMany({});
  await prisma.dailyReport.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.internProfile.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("2. Wiping Supabase Auth...");
  const { data: users } = await supabase.auth.admin.listUsers();
  for (const user of users?.users || []) {
    await supabase.auth.admin.deleteUser(user.id);
  }

  console.log("3. Recreating Admin User...");
  const adminRes = await supabase.auth.admin.createUser({
    email: 'admin@belvo.com',
    password: 'password',
    email_confirm: true
  });

  console.log("4. Recreating Intern User...");
  const internRes = await supabase.auth.admin.createUser({
    email: 'intern@belvo.com',
    password: 'password',
    email_confirm: true
  });

  console.log("5. Seeding Prisma Profiles...");
  if (adminRes.data?.user) {
    await prisma.user.upsert({
      where: { id: adminRes.data.user.id },
      update: { role: 'ADMIN' },
      create: { id: adminRes.data.user.id, email: 'admin@belvo.com', role: 'ADMIN' }
    });
  }

  if (internRes.data?.user) {
    await prisma.user.upsert({
      where: { id: internRes.data.user.id },
      update: { role: 'INTERN' },
      create: { id: internRes.data.user.id, email: 'intern@belvo.com', role: 'INTERN' }
    });

    await prisma.internProfile.upsert({
      where: { userId: internRes.data.user.id },
      update: {},
      create: {
        userId: internRes.data.user.id,
        name: "Alex Fielding",
        dob: new Date("2003-05-15"),
        designation: "Software Engineering Intern",
        department: "Engineering",
        teamName: "Nexus WebGL Core",
        xp: 330,
        photoUrl: "https://i.pravatar.cc/300?img=12",
        bio: "Passionate about 3D graphics and clean code.",
        githubId: "https://github.com",
        linkedInId: "https://linkedin.com",
        instagramId: "https://instagram.com",
        idCardNumber: "EMP-1234"
      }
    });
  }
  console.log("Done! Clean slate achieved.");
}

resetAll().catch(console.error).finally(() => prisma.$disconnect());
