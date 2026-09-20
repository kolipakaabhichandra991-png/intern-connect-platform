const fs = require('fs');
const filePath = 'src/app/api/interns/[id]/route.ts';
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('ownershipCheck')) {
  content = content.replace(
    'const intern = await prisma.internProfile.findUnique({',
    `const ownershipCheck = await prisma.internProfile.findUnique({ where: { id: cleanId } });
    if (!ownershipCheck || ownershipCheck.adminId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: Intern does not belong to you" }, { status: 403 });
    }
    const intern = await prisma.internProfile.findUnique({`
  );
  
  content = content.replace(
    /const intern = await prisma\.internProfile\.update\(\{/g,
    `const ownershipCheckUpdate = await prisma.internProfile.findUnique({ where: { id: cleanId } });
    if (!ownershipCheckUpdate || ownershipCheckUpdate.adminId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: Intern does not belong to you" }, { status: 403 });
    }
    const intern = await prisma.internProfile.update({`
  );

  content = content.replace(
    /const intern = await prisma\.internProfile\.findUnique\(\{\s*where: \{ id: cleanId \}\s*\}\);/g,
    `const intern = await prisma.internProfile.findUnique({ where: { id: cleanId } });
    if (intern && intern.adminId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: Intern does not belong to you" }, { status: 403 });
    }`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Patched ownership in [id] route!');
}
