const fs = require('fs');
let content = fs.readFileSync('src/app/auth/verify-session/page.tsx', 'utf8');

// Replace /api/interns/me with /api/me
content = content.replace('fetch("/api/interns/me")', 'fetch("/api/me")');

fs.writeFileSync('src/app/auth/verify-session/page.tsx', content, 'utf8');
console.log('Fixed verify-session to use /api/me!');
