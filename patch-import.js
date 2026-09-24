const fs = require('fs');
let content = fs.readFileSync('src/app/intern-panel/page.tsx', 'utf8');

if (!content.includes("import { Star }")) {
  content = content.replace('"use client";', '"use client";\nimport { Star } from "lucide-react";');
  fs.writeFileSync('src/app/intern-panel/page.tsx', content, 'utf8');
  console.log("Patched import!");
} else {
  console.log("Already imported");
}
