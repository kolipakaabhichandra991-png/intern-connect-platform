const fs = require('fs');
let content = fs.readFileSync('src/app/[internId]/page.tsx', 'utf8');

content = content.replace(
  `                      if (res.ok) {
                        toast.success('Project updated!');
                      } else {`,
  `                      if (res.ok) {
                        const updatedIntern = await res.json();
                        setIntern(updatedIntern);
                        toast.success('Project updated!');
                      } else {`
);

fs.writeFileSync('src/app/[internId]/page.tsx', content, 'utf8');
console.log("Patched assignment UI!");
