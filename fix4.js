const fs = require('fs');
let content = fs.readFileSync('src/app/reports/page.tsx', 'utf8');

if (!content.includes('import RatingComponent')) {
  content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport RatingComponent from '@/components/reviews/RatingComponent';");
  fs.writeFileSync('src/app/reports/page.tsx', content, 'utf8');
  console.log('Added import successfully!');
} else {
  console.log('Import already exists!');
}
