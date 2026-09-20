const fs = require('fs');

// 1. Patch api/logs/route.ts
let logsContent = fs.readFileSync('src/app/api/logs/route.ts', 'utf8');
if (!logsContent.includes('adminId: session.user.id')) {
  logsContent = logsContent.replace(
    'const logs = await prisma.dailyReport.findMany({',
    `const logs = await prisma.dailyReport.findMany({
      where: {
        intern: {
          adminId: (session.user as any).id
        }
      },`
  );
  fs.writeFileSync('src/app/api/logs/route.ts', logsContent, 'utf8');
  console.log('Patched logs API!');
}

// 2. Patch api/reviews/route.ts
let reviewsContent = fs.readFileSync('src/app/api/reviews/route.ts', 'utf8');
if (!reviewsContent.includes('const session = await getServerSession()') || reviewsContent.indexOf('const session = await getServerSession()') === reviewsContent.lastIndexOf('const session = await getServerSession()')) {
  // It only has one session check (in POST), we need it in GET too
  reviewsContent = reviewsContent.replace(
    /export async function GET\(.*?\) \{\s*try \{/,
    `export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Determine the relevant adminId to filter by
    let relevantAdminId = (session.user as any).id;
    if ((session.user as any).role === "INTERN") {
      const myProfile = await prisma.internProfile.findUnique({
        where: { userId: (session.user as any).id }
      });
      if (myProfile && myProfile.adminId) {
        relevantAdminId = myProfile.adminId;
      }
    }
`
  );

  reviewsContent = reviewsContent.replace(
    'const reviews = await prisma.review.findMany({',
    `const reviews = await prisma.review.findMany({
      where: {
        intern: {
          adminId: relevantAdminId
        }
      },`
  );
  fs.writeFileSync('src/app/api/reviews/route.ts', reviewsContent, 'utf8');
  console.log('Patched reviews API!');
}
