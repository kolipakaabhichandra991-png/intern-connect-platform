const fs = require('fs');
let content = fs.readFileSync('src/app/[internId]/page.tsx', 'utf8');

// Update the tabs array to conditionally include 'ACTIVITY'
content = content.replace(
  /\{\['ABOUT', 'PROJECTS', 'ACTIVITY'\]\.map\(\(tab\) => \(/,
  `{['ABOUT', 'PROJECTS', ...(isAdmin ? ['ACTIVITY'] : [])].map((tab) => (`
);

fs.writeFileSync('src/app/[internId]/page.tsx', content, 'utf8');
console.log("Patched tabs!");
