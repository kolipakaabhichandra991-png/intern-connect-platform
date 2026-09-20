const fs = require('fs');
let content = fs.readFileSync('src/app/reports/page.tsx', 'utf8');

const regex = /<RatingComponent internId=\{group\.internId\} reviewType=\"WORK_REPORT_EVALUATION\" \/>\s*\)\}/;
if (regex.test(content)) {
  content = content.replace(regex, '<RatingComponent internId={group.internId} reviewType="WORK_REPORT_EVALUATION" /></div>)}');
  fs.writeFileSync('src/app/reports/page.tsx', content, 'utf8');
  console.log('Fixed!');
}
