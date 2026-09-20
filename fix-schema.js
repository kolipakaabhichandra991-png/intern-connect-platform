const fs = require('fs');
let content = fs.readFileSync('prisma/schema.prisma', 'utf8');

// Strip BOM if present
if (content.charCodeAt(0) === 0xFEFF) {
  content = content.slice(1);
}

fs.writeFileSync('prisma/schema.prisma', content, 'utf8');
console.log('Stripped BOM');
