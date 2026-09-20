const fs = require('fs');
let content = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const regex = /<div className=\"absolute right-5 top-1\/2 -translate-y-1\/2 pointer-events-none text-\[\#8A2BE2\] group-hover:translate-y-\[2px\] transition-transform\">\s*.*?\s*<\/div>/;
if (regex.test(content)) {
  content = content.replace(regex, '<div className=\"absolute right-5 top-1\/2 -translate-y-1\/2 pointer-events-none text-[#8A2BE2] group-hover:translate-y-[2px] transition-transform\">&#9660;</div>');
  fs.writeFileSync('src/app/dashboard/page.tsx', content, 'utf8');
  console.log('Fixed dropdown caret!');
} else {
  console.log('Regex did not match!');
}
