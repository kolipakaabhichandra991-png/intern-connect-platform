const fs = require('fs');
let content = fs.readFileSync('src/app/api/auth/send-otp/route.ts', 'utf8');

content = content.replace(
  'return NextResponse.json({ error: `Access Denied: This email belongs to an ${user.role} account. Please use the correct login portal.` }, { status: 403 });',
  'return NextResponse.json({ error: "Incorrect email" }, { status: 403 });'
);

// Also let's standardize the generic "Account does not exist" error to "Incorrect email" as well to completely prevent user enumeration!
content = content.replace(
  'return NextResponse.json({ error: "Account does not exist" }, { status: 404 });',
  'return NextResponse.json({ error: "Incorrect email" }, { status: 404 });'
);

fs.writeFileSync('src/app/api/auth/send-otp/route.ts', content, 'utf8');
console.log('Patched error message for security!');
