const fs = require('fs');
let content = fs.readFileSync('src/app/api/auth/register/route.ts', 'utf8');

if (!content.includes('getServerSession')) {
  content = content.replace(
    'import prisma from "@/lib/prisma";',
    'import prisma from "@/lib/prisma";\nimport { getServerSession } from "@/lib/session";'
  );

  content = content.replace(
    'const { name, email, password, role, department, photoUrl } = await req.json();',
    `const { name, email, password, role, department, photoUrl } = await req.json();
    
    // Find the current admin if they are logged in
    const session = await getServerSession();
    let currentAdminId = null;
    if (session && session.user && session.user.role === "ADMIN") {
      currentAdminId = session.user.id;
    }`
  );

  content = content.replace(
    /update: \{\s*name,\s*department,\s*photoUrl: photoUrl \|\| `https:\/\/ui-avatars\.com\/api\/\?name=\$\{encodeURIComponent\(name\)\}`\s*\}/,
    `update: {
          name,
          department,
          photoUrl: photoUrl || \`https://ui-avatars.com/api/?name=\${encodeURIComponent(name)}\`,
          ...(currentAdminId ? { adminId: currentAdminId } : {})
        }`
  );

  content = content.replace(
    /create: \{\s*userId,\s*name,\s*department: department \|\| "Engineering",\s*photoUrl: photoUrl \|\| `https:\/\/ui-avatars\.com\/api\/\?name=\$\{encodeURIComponent\(name\)\}`,\s*designation: "Intern",\s*xp: 0,\s*dob: new Date\(\),\s*teamName: "New Joiners",\s*idCardNumber: "BEL-" \+ Math\.floor\(Math\.random\(\) \* 10000\)\.toString\(\)\s*\}/,
    `create: {
          userId,
          name,
          department: department || "Engineering",
          photoUrl: photoUrl || \`https://ui-avatars.com/api/?name=\${encodeURIComponent(name)}\`,
          designation: "Intern",
          xp: 0,
          dob: new Date(),
          teamName: "New Joiners",
          idCardNumber: "BEL-" + Math.floor(Math.random() * 10000).toString(),
          ...(currentAdminId ? { adminId: currentAdminId } : {})
        }`
  );

  fs.writeFileSync('src/app/api/auth/register/route.ts', content, 'utf8');
  console.log('Patched register API route!');
} else {
  console.log('Already patched!');
}
