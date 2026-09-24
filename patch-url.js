const fs = require('fs');

function patchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    /process\.env\.NEXT_PUBLIC_SITE_URL \|\| 'http:\/\/localhost:3000'/g,
    "process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'))"
  );
  fs.writeFileSync(filePath, content, 'utf8');
}

patchFile('src/app/api/auth/verify-otp/route.ts');
patchFile('src/app/api/auth/register/route.ts');

console.log("Patched URLs!");
