const fs = require('fs');
let content = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

if (!content.includes('useRouter')) {
  content = content.replace(
    'import { signOut, useSession } from \'@/lib/supabase/useSession\';',
    `import { signOut, useSession } from '@/lib/supabase/useSession';
import { useRouter } from 'next/navigation';`
  );
}

const componentStart = 'export default function AdminDashboard() {';
const redirectCode = `
  const router = useRouter();
  useEffect(() => {
    if (session?.user && (session.user as any).role === "INTERN") {
      router.push("/intern-panel");
    }
  }, [session, router]);
`;

content = content.replace(
  /export default function AdminDashboard\(\) \{\s*const \{ data: session, status \} = useSession\(\);/,
  `export default function AdminDashboard() {\n  const { data: session, status } = useSession();\n${redirectCode}`
);
fs.writeFileSync('src/app/dashboard/page.tsx', content, 'utf8');
console.log('Protected dashboard!');
