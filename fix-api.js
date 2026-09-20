const fs = require('fs');
let content = fs.readFileSync('src/app/api/interns/[id]/project/route.ts', 'utf8');
content = content.replace('{ internId: string }', '{ id: string }');
content = content.replace('params.internId', 'params.id');
fs.writeFileSync('src/app/api/interns/[id]/project/route.ts', content, 'utf8');
console.log('Fixed API route param!');
