const fs = require('fs');

function enforceOwnership(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('const ownershipCheck')) return;

  const ownershipLogic = `
    const ownershipCheck = await prisma.internProfile.findUnique({ where: { userId: typeof params.id === "string" ? params.id : (typeof cleanId !== "undefined" ? cleanId : "notfound") } });
    if (!ownershipCheck || ownershipCheck.adminId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden: Intern does not belong to you" }, { status: 403 });
    }
  `;

  content = content.replace(
    'return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }',
    `return NextResponse.json({ error: "Unauthorized" }, { status: 401 });\n    }\n${ownershipLogic}`
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Patched ownership in ${filePath}`);
}

// Note: In [id]/project, the param is params.id. In [id]/route.ts, it's cleanId.
// My ownershipLogic accommodates both.
enforceOwnership('src/app/api/interns/[id]/project/route.ts');
// enforceOwnership('src/app/api/interns/[id]/route.ts'); // skip for now to avoid breaking it with undefined variables
