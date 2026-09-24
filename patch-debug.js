const fs = require('fs');
let content = fs.readFileSync('src/app/api/auth/send-otp/route.ts', 'utf8');

content = content.replace(
  'return NextResponse.json({ error: "Internal server error" }, { status: 500 });',
  'return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });'
);

fs.writeFileSync('src/app/api/auth/send-otp/route.ts', content, 'utf8');
console.log("Patched debug error message!");
