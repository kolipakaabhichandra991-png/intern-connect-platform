const fs = require('fs');
let content = fs.readFileSync('src/app/api/interns/route.ts', 'utf8');

if (!content.includes('getServerSession')) {
  content = content.replace(
    'import prisma from "@/lib/prisma";',
    'import prisma from "@/lib/prisma";\nimport { getServerSession } from "@/lib/session";'
  );

  content = content.replace(
    'const interns = await prisma.internProfile.findMany({',
    `const session = await getServerSession();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const interns = await prisma.internProfile.findMany({
      where: {
        adminId: session.user.id
      },`
  );

  fs.writeFileSync('src/app/api/interns/route.ts', content, 'utf8');
  console.log('Patched interns API route!');
} else {
  console.log('Already patched!');
}
