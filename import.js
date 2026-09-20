const fs = require('fs');
let content = fs.readFileSync('src/app/reports/page.tsx', 'utf8');

if (!content.includes('import RatingComponent')) {
  content = 'import RatingComponent from "@/components/reviews/RatingComponent";\n' + content;
  fs.writeFileSync('src/app/reports/page.tsx', content, 'utf8');
  console.log('Added import!');
}
