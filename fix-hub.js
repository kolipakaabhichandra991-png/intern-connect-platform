const fs = require('fs');
let content = fs.readFileSync('src/app/resources/page.tsx', 'utf8');

const regex = /<h1 className=\"text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-2\">Resource Hub [^<]+<\/h1>/;
if (regex.test(content)) {
  content = content.replace(regex, '<h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-2">Resource Hub ??</h1>');
  fs.writeFileSync('src/app/resources/page.tsx', content, 'utf8');
  console.log('Fixed Resource Hub title emoji using regex!');
} else {
  console.log('Regex did not match.');
}
