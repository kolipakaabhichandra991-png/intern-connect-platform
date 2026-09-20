const fs = require('fs');
let content = fs.readFileSync('src/app/api/auth/send-otp/route.ts', 'utf8');

if (!content.includes('user.role !== role')) {
  const roleCheck = `
    if (!user) {
      return NextResponse.json({ error: "Account does not exist" }, { status: 404 });
    }

    // Ensure the requested login role matches the user's actual role in the database
    if (!isRegister && role && user.role !== role) {
      return NextResponse.json({ error: \`Access Denied: This email belongs to an \${user.role} account. Please use the correct login portal.\` }, { status: 403 });
    }
  `;

  content = content.replace(
    'if (!user) {\n      return NextResponse.json({ error: "Account does not exist" }, { status: 404 });\n    }',
    roleCheck
  );

  fs.writeFileSync('src/app/api/auth/send-otp/route.ts', content, 'utf8');
  console.log('Patched send-otp to enforce role checking!');
} else {
  console.log('Already patched!');
}
