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

async function sync() {
  const { data } = await supabase.auth.admin.listUsers();
  const adminId = data.users.find(u => u.email === 'admin@belvo.com')?.id;
  const internId = data.users.find(u => u.email === 'intern@belvo.com')?.id;
  
  if (adminId) {
    console.log("Upserting admin in Prisma:", adminId);
    await prisma.user.upsert({
      where: { id: adminId },
      update: { role: 'ADMIN' },
      create: { id: adminId, email: 'admin@belvo.com', role: 'ADMIN' }
    });
  }

  if (internId) {
    console.log("Upserting intern in Prisma:", internId);
    await prisma.user.upsert({
      where: { id: internId },
      update: { role: 'INTERN' },
      create: { id: internId, email: 'intern@belvo.com', role: 'INTERN' }
    });

    await prisma.internProfile.upsert({
      where: { userId: internId },
      update: {},
      create: {
        userId: internId,
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
}
sync().catch(console.error).finally(() => prisma.$disconnect());
