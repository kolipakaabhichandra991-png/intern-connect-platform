const fs = require('fs');
let content = fs.readFileSync('src/app/[internId]/page.tsx', 'utf8');

// Add debug info to the header
content = content.replace(
  '<span className="text-slate-900">BEL</span><span className="text-[#8A2BE2]">VO</span>',
  '<span className="text-slate-900">BEL</span><span className="text-[#8A2BE2]">VO</span> <span className="text-xs text-red-500">[{session?.user ? (session.user as any).role : "NO_SESSION"}]</span>'
);

fs.writeFileSync('src/app/[internId]/page.tsx', content, 'utf8');
console.log('Added debug role!');
