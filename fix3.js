const fs = require('fs');
let content = fs.readFileSync('src/app/reports/page.tsx', 'utf8');

content = content.replace('import RatingComponent from "@/components/reviews/RatingComponent";\n', '');
content = content.replace('"use client";\n', '"use client";\nimport RatingComponent from "@/components/reviews/RatingComponent";\n');

fs.writeFileSync('src/app/reports/page.tsx', content, 'utf8');
console.log('Fixed use client directive ordering!');
