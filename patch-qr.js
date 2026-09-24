const fs = require('fs');
let content = fs.readFileSync('src/components/qrcode/QRCodeGenerator.tsx', 'utf8');
content = content.replace('NEXT_PUBLIC_BASE_URL', 'NEXT_PUBLIC_SITE_URL');
fs.writeFileSync('src/components/qrcode/QRCodeGenerator.tsx', content, 'utf8');
console.log("Patched QR code base url!");
