const fs = require('fs');

let content = fs.readFileSync('src/app/api/interns/[id]/project/route.ts', 'utf8');

// 1. Fix the params promise signature
content = content.replace(
  'export async function PUT(req: Request, { params }: { params: { id: string } }) {',
  'export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {'
);

// 2. Await params.id properly
content = content.replace(
  'const { upcomingProjectTitle, upcomingProjectDesc, upcomingProjectDate } = await req.json();',
  `const { id } = await params;\n    const cleanId = id.startsWith("intern-") ? id.replace("intern-", "") : id;\n    const { upcomingProjectTitle, upcomingProjectDesc, upcomingProjectDate } = await req.json();`
);

// 3. Update the where: { userId: params.id }
content = content.replace(
  'where: { userId: params.id }',
  'where: { userId: cleanId }'
);

// 4. Update the ownership check I injected
content = content.replace(
  /typeof params\.id === "string" \? params\.id : \(typeof cleanId !== "undefined" \? cleanId : "notfound"\)/g,
  'cleanId'
);

fs.writeFileSync('src/app/api/interns/[id]/project/route.ts', content, 'utf8');
console.log('Fixed TS errors in project API!');
