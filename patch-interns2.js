const fs = require('fs');

let routeTs = fs.readFileSync('src/app/api/interns/route.ts', 'utf8');
routeTs = routeTs.replace(
  'project: true // Include project data so they can see team members properly',
  ''
);
fs.writeFileSync('src/app/api/interns/route.ts', routeTs, 'utf8');

let pageTsx = fs.readFileSync('src/app/intern-panel/page.tsx', 'utf8');
pageTsx = pageTsx.replace(
  /if \(meData\.projectId\) \{[\s\S]*?\}/,
  `if (meData.teamName) {
              others = others.filter(i => i.teamName === meData.teamName);
            }`
);
fs.writeFileSync('src/app/intern-panel/page.tsx', pageTsx, 'utf8');

console.log("Fixed relation error and updated filter!");
