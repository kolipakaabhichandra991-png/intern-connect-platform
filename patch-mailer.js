const fs = require('fs');
let content = fs.readFileSync('src/lib/mailer.ts', 'utf8');

content = content.replace(
  'return false;',
  'throw error;'
);

fs.writeFileSync('src/lib/mailer.ts', content, 'utf8');

let routeContent = fs.readFileSync('src/app/api/auth/send-otp/route.ts', 'utf8');
routeContent = routeContent.replace(
  'const emailSent = await sendOTP(email, otp);',
  'await sendOTP(email, otp); const emailSent = true;'
);
fs.writeFileSync('src/app/api/auth/send-otp/route.ts', routeContent, 'utf8');
console.log("Patched mailer to throw actual error!");
