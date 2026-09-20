const fs = require('fs');
let content = fs.readFileSync('src/app/intern-panel/page.tsx', 'utf8');

// Replace the hardcoded upcomingProject
const oldCode = `  const upcomingProject = {
    title: "Implement Real-time WebSocket Feed",
    deadline: "Friday, 5:00 PM",
    description: "Build out the WebSocket integration for the new analytics dashboard live feed feature."
  };`;

const newCode = `  const upcomingProject = {
    title: intern.upcomingProjectTitle || "No Upcoming Project",
    deadline: intern.upcomingProjectDate || "N/A",
    description: intern.upcomingProjectDesc || "No upcoming project assigned yet."
  };`;

content = content.replace(oldCode, newCode);
fs.writeFileSync('src/app/intern-panel/page.tsx', content, 'utf8');
console.log('Updated intern-panel');
