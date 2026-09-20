const fs = require('fs');
let content = fs.readFileSync('prisma/schema.prisma', 'utf8');

if (!content.includes('adminId')) {
  content = content.replace(
    '  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)',
    '  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  adminId           String?\n  admin             User?    @relation("AdminInterns", fields: [adminId], references: [id])'
  );

  content = content.replace(
    '  internProfile InternProfile?',
    '  internProfile InternProfile?\n  managedInterns InternProfile[] @relation("AdminInterns")'
  );

  fs.writeFileSync('prisma/schema.prisma', content, 'utf8');
  console.log('Patched schema!');
} else {
  console.log('Already patched!');
}
