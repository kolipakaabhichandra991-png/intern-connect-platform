const fs = require('fs');

const files = [
  { path: 'src/app/dashboard/page.tsx', defaultText: "Loading Dashboard..." },
  { path: 'src/app/intern-panel/page.tsx', defaultText: "Loading Panel..." },
  { path: 'src/app/login/page.tsx', defaultText: "Loading Login..." },
  { path: 'src/app/reports/page.tsx', defaultText: "Loading Reports..." },
  { path: 'src/app/resources/page.tsx', defaultText: "Loading Resources..." },
  { path: 'src/app/[internId]/page.tsx', defaultText: "Loading Dossier..." }
];

files.forEach(file => {
  if (fs.existsSync(file.path)) {
    let content = fs.readFileSync(file.path, 'utf8');

    // Add import if not present
    if (!content.includes('import Loader')) {
      content = content.replace(
        /import React, \{.*\} from 'react';/,
        `$& \nimport Loader from '@/components/Loader';`
      );
      if (!content.includes('import Loader')) {
         content = content.replace(
           /import React from 'react';/,
           `$& \nimport Loader from '@/components/Loader';`
         );
      }
      if (!content.includes('import Loader')) {
         content = `import Loader from '@/components/Loader';\n` + content;
      }
    }

    // Replace Dashboard Loader
    content = content.replace(
      /return <div className="min-h-screen bg-\[#e0e5ec\] flex items-center justify-center font-bold text-xl">Loading\.\.\.<\/div>;/g,
      `return <Loader text="${file.defaultText}" />;`
    );

    // Replace Intern Panel Loader
    content = content.replace(
      /return <div className="min-h-screen bg-\[#e0e5ec\] flex items-center justify-center font-bold text-xl">Loading Dashboard\.\.\.<\/div>;/g,
      `return <Loader text="${file.defaultText}" />;`
    );

    // Replace Login Loader
    content = content.replace(
      /<Suspense fallback={<div className="min-h-screen bg-\[#e0e5ec\] flex items-center justify-center">Loading\.\.\.<\/div>}>/g,
      `<Suspense fallback={<Loader text="Preparing Portal..." />}>`
    );

    // Replace Reports/Resources Loader
    content = content.replace(
      /return <div className="min-h-screen bg-\[#e0e5ec\] flex items-center justify-center font-bold">Loading\.\.\.<\/div>;/g,
      `return <Loader text="${file.defaultText}" />;`
    );

    // Replace InternId Dossier Loader
    content = content.replace(
      /return <div className="min-h-screen bg-\[#e0e5ec\] flex items-center justify-center text-xl font-bold">Loading Dossier\.\.\.<\/div>;/g,
      `return <Loader text="${file.defaultText}" />;`
    );

    fs.writeFileSync(file.path, content, 'utf8');
    console.log(`Patched ${file.path}`);
  }
});
