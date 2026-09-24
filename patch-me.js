const fs = require('fs');
let content = fs.readFileSync('src/app/api/interns/me/route.ts', 'utf8');
content = content.replace(
  'dailyReports: true,',
  'dailyReports: true, reviews: { orderBy: { timestamp: "desc" } },'
);
fs.writeFileSync('src/app/api/interns/me/route.ts', content, 'utf8');
console.log("Patched me route!");
