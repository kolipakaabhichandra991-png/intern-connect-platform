const fs = require('fs');

function exposeError(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    /return NextResponse\.json\(\{ error: "Internal Server Error" \}, \{ status: 500 \}\);/gi,
    'return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });'
  );
  content = content.replace(
    /return NextResponse\.json\(\{ error: "Internal server error" \}, \{ status: 500 \}\);/gi,
    'return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });'
  );
  fs.writeFileSync(filePath, content, 'utf8');
}

exposeError('src/app/api/auth/register/route.ts');
exposeError('src/app/api/auth/verify-otp/route.ts');
console.log("Patched other debug messages!");
