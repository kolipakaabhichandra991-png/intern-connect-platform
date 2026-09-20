const fs = require('fs');

const files = [
  'src/app/dashboard/page.tsx',
  'src/app/intern-panel/page.tsx',
  'src/app/login/page.tsx',
  'src/app/reports/page.tsx',
  'src/app/resources/page.tsx',
  'src/app/[internId]/page.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // If import Loader is before "use client" or 'use client'
    if (content.startsWith("import Loader from '@/components/Loader';\n\"use client\";") || 
        content.startsWith("import Loader from '@/components/Loader';\n'use client';")) {
        
        content = content.replace("import Loader from '@/components/Loader';\n\"use client\";", "\"use client\";\nimport Loader from '@/components/Loader';");
        content = content.replace("import Loader from '@/components/Loader';\n'use client';", "'use client';\nimport Loader from '@/components/Loader';");
    } else {
        // More robust check just in case
        const useClientMatch = content.match(/^.*use client['"];?\s*/m);
        if (useClientMatch && content.indexOf("import Loader") < content.indexOf(useClientMatch[0])) {
            content = content.replace("import Loader from '@/components/Loader';\n", "");
            content = content.replace(useClientMatch[0], `${useClientMatch[0]}\nimport Loader from '@/components/Loader';\n`);
        }
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed use client in ${file}`);
  }
});
