const fs = require('fs');
let content = fs.readFileSync('src/app/api/interns/[id]/project/route.ts', 'utf8');

content = content.replace(
  '    const ownershipCheck = await prisma.internProfile.findUnique({ where: { userId: cleanId } });',
  `    const { id } = await params;
    const cleanId = id.startsWith("intern-") ? id.replace("intern-", "") : id;
    const ownershipCheck = await prisma.internProfile.findUnique({ where: { userId: cleanId } });`
);

content = content.replace(
  '    const { id } = await params;\n    const cleanId = id.startsWith("intern-") ? id.replace("intern-", "") : id;\n    const { upcomingProjectTitle, upcomingProjectDesc, upcomingProjectDate } = await req.json();',
  '    const { upcomingProjectTitle, upcomingProjectDesc, upcomingProjectDate } = await req.json();'
);

fs.writeFileSync('src/app/api/interns/[id]/project/route.ts', content, 'utf8');
console.log('Fixed execution order!');
