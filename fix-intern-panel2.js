const fs = require('fs');
let content = fs.readFileSync('src/app/intern-panel/page.tsx', 'utf8');

const regex = /const upcomingProject = \{[\s\S]*?\};/;
const newCode = `const upcomingProject = {
    title: intern.upcomingProjectTitle || "No Upcoming Project",
    deadline: intern.upcomingProjectDate || "N/A",
    description: intern.upcomingProjectDesc || "No upcoming project assigned yet."
  };`;

if (regex.test(content)) {
  content = content.replace(regex, newCode);
  fs.writeFileSync('src/app/intern-panel/page.tsx', content, 'utf8');
  console.log('Fixed intern-panel!');
} else {
  console.log('Regex did not match!');
}
