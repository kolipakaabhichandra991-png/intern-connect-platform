const fs = require('fs');
let content = fs.readFileSync('src/app/api/interns/[id]/project/route.ts', 'utf8');

content = content.replace(
  `    const ownershipCheck = await prisma.internProfile.findUnique({ where: { userId: cleanId } });
    if (!ownershipCheck || ownershipCheck.adminId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: Intern does not belong to you" }, { status: 403 });
    }`,
  `    const ownershipCheck = await prisma.internProfile.findUnique({ where: { userId: cleanId } });
    if (!ownershipCheck) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }`
);

fs.writeFileSync('src/app/api/interns/[id]/project/route.ts', content, 'utf8');
console.log("Patched assignment API!");
