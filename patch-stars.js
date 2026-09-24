const fs = require('fs');

let content = fs.readFileSync('src/app/intern-panel/page.tsx', 'utf8');

if (!content.includes("import { Star }")) {
  content = content.replace('import Link from "next/link";', 'import Link from "next/link";\nimport { Star } from "lucide-react";');
}

content = content.replace(
  /<span key=\{i\} className=\{i < review.rating \? "text-\[#8A2BE2\] text-lg" : "text-slate-200 text-lg"\}>?<\/span>/g,
  '<Star key={i} className={`w-5 h-5 ${i < review.rating ? "text-[#8A2BE2] fill-[#8A2BE2]" : "text-slate-300"}`} />'
);

fs.writeFileSync('src/app/intern-panel/page.tsx', content, 'utf8');
console.log("Patched stars!");
