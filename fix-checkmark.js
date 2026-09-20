const fs = require('fs');
let content = fs.readFileSync('src/app/[internId]/page.tsx', 'utf8');
content = content.replace('<span className="text-[#8A2BE2]">??</span>', '<span className="text-[#8A2BE2]">&#10004;</span>');
fs.writeFileSync('src/app/[internId]/page.tsx', content, 'utf8');
console.log('Fixed checkmark!');
