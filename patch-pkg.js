const fs = require('fs');

let content = fs.readFileSync('package.json', 'utf8');
const pkg = JSON.parse(content);

if (!pkg.scripts.postinstall) {
  pkg.scripts.postinstall = "prisma generate";
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf8');
  console.log('Added postinstall script to package.json');
} else {
  console.log('postinstall script already exists');
}
