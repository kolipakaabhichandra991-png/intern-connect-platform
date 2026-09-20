const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.resource.createMany({
    data: [
      {
        title: "React Official Documentation",
        description: "The official guide to React. Read this to understand hooks, components, and state management.",
        url: "https://react.dev/",
        category: "Engineering"
      },
      {
        title: "Next.js App Router Guide",
        description: "Learn how to build full-stack applications with Next.js, Server Components, and the App Router.",
        url: "https://nextjs.org/docs",
        category: "Engineering"
      },
      {
        title: "Tailwind CSS Components",
        description: "A reference for utility classes and responsive design principles using Tailwind CSS.",
        url: "https://tailwindcss.com/docs",
        category: "Design"
      },
      {
        title: "Intern Onboarding Checklist",
        description: "Review your first week checklist, company policies, and daily standup expectations.",
        url: "https://google.com",
        category: "General"
      }
    ]
  });
  console.log('Seeded resources!');
}
main().catch(console.error).finally(() => prisma.$disconnect());
