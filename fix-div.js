const fs = require('fs');
let content = fs.readFileSync('src/app/reports/page.tsx', 'utf8');

const oldStr = `<RatingComponent internId={group.internId} reviewType="WORK_REPORT_EVALUATION" />
                                )}`;
const newStr = `<RatingComponent internId={group.internId} reviewType="WORK_REPORT_EVALUATION" />
                                  </div>
                                )}`;

if (content.includes(oldStr)) {
  content = content.replace(oldStr, newStr);
  fs.writeFileSync('src/app/reports/page.tsx', content, 'utf8');
  console.log('Fixed missing div tag!');
} else {
  console.log('Could not find the target string!');
}
