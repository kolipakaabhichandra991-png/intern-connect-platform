const fs = require('fs');
let content = fs.readFileSync('src/app/api/interns/[id]/route.ts', 'utf8');

if (!content.includes('getServerSession')) {
  content = content.replace(
    'import prisma from "@/lib/prisma";',
    'import prisma from "@/lib/prisma";\nimport { getServerSession } from "@/lib/session";'
  );

  const securityCheck = `
    const session = await getServerSession();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  `;

  content = content.replace(
    /export async function GET\(.*?\) \{\s*try \{/g,
    `export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {\n  try {${securityCheck}`
  );

  content = content.replace(
    /export async function PATCH\(.*?\) \{\s*try \{/g,
    `export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {\n  try {${securityCheck}`
  );

  content = content.replace(
    /export async function DELETE\(.*?\) \{\s*try \{/g,
    `export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {\n  try {${securityCheck}`
  );

  fs.writeFileSync('src/app/api/interns/[id]/route.ts', content, 'utf8');
  console.log('Patched intern ID API route!');
} else {
  console.log('Already patched!');
}
