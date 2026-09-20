const fs = require('fs');
let content = fs.readFileSync('src/app/[internId]/page.tsx', 'utf8');

// Add a local state for the role to bypass any useSession bugs
const regex = /const isAdmin = session\?\.user && \(session\.user as any\)\.role === "ADMIN";/;
const replacement = `
  const [localRole, setLocalRole] = useState<string | null>(null);
  useEffect(() => {
    fetch('/api/me').then(res => res.json()).then(data => setLocalRole(data.role)).catch(() => {});
  }, []);
  const isAdmin = (session?.user && (session.user as any).role === "ADMIN") || localRole === "ADMIN";
`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/app/[internId]/page.tsx', content, 'utf8');
console.log('Injected local role fetch!');
