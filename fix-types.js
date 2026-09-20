const fs = require('fs');
let content = fs.readFileSync('src/app/[internId]/page.tsx', 'utf8');
content = content.replace('map((proj, i) =>', 'map((proj: string, i: number) =>');
fs.writeFileSync('src/app/[internId]/page.tsx', content, 'utf8');
console.log('Fixed types!');
