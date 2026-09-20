const fs = require('fs');
let content = fs.readFileSync('src/app/api/interns/[id]/project/route.ts', 'utf8');

if (!content.includes('getServerSession')) {
  content = content.replace(
    'import prisma from \'@/lib/prisma\';',
    'import prisma from \'@/lib/prisma\';\nimport { getServerSession } from \'@/lib/session\';'
  );

  content = content.replace(
    'try {',
    `try {
    const session = await getServerSession();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }`
  );

  fs.writeFileSync('src/app/api/interns/[id]/project/route.ts', content, 'utf8');
  console.log('Patched project API route!');
}
