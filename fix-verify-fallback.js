const fs = require('fs');
let content = fs.readFileSync('src/app/auth/verify-session/page.tsx', 'utf8');

const regex = /else \{\s*if \(mounted\) router\.push\("\/dashboard"\);\s*\}/g;
const replacement = `else {
            if (mounted) {
              if (session?.user?.email === "abhichandra.belvo@gmail.com") {
                router.push("/dashboard");
              } else {
                router.push("/intern-panel");
              }
            }
          }`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/app/auth/verify-session/page.tsx', content, 'utf8');
console.log('Fixed verify-session fallback!');
