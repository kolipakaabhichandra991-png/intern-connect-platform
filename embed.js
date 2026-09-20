const fs = require('fs');
let content = fs.readFileSync('src/app/reports/page.tsx', 'utf8');

if (!content.includes('RatingComponent')) {
  content = content.replace(
    'import { signOut, useSession } from "@/lib/supabase/useSession";',
    'import { signOut, useSession } from "@/lib/supabase/useSession";\nimport RatingComponent from "@/components/reviews/RatingComponent";'
  );
}

const inputRegex = /<div className=\"text-sm uppercase font-bold text-slate-400 mb-3\">Provide Feedback<\/div>[\s\S]*?<\/div>/;
if (inputRegex.test(content)) {
  content = content.replace(inputRegex, '<RatingComponent internId={group.internId} reviewType="WORK_REPORT_EVALUATION" />');
  fs.writeFileSync('src/app/reports/page.tsx', content, 'utf8');
  console.log('Successfully embedded RatingComponent!');
} else {
  console.log('Regex did not match the Provide Feedback block.');
}
