const fs = require('fs');
let content = fs.readFileSync('prisma/schema.prisma', 'utf8');
content = content.replace('city              String?', 'city              String?\n  phone             String?\n  address           String?');
fs.writeFileSync('prisma/schema.prisma', content, 'utf8');
console.log("Patched schema!");
