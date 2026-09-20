const fs = require('fs');
let content = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const replacement = `{reviews.length > 0 ? reviews.map((review, i) => (
                  <div key={review.id || i} className="bg-black/30 p-4 rounded-2xl border-2 border-black hover:border-[#8A2BE2]/30 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-200 group-hover:text-slate-900">{review.name} &rarr; {review.targetName}</span>
                      <div className="flex text-[#8A2BE2] text-xs gap-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <span key={idx} className={idx < review.rating ? "opacity-100" : "opacity-30"}>&#9733;</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{review.text}</p>
                  </div>
                )) : (
                  <p className="text-xs text-slate-400 italic">No feedback yet.</p>
                )}`;

const pattern = /\{\[\s*\{\s*name:\s*"Sarah J\.",[\s\S]*?\}\)\)\}/;
if (pattern.test(content)) {
  content = content.replace(pattern, replacement);
  fs.writeFileSync('src/app/dashboard/page.tsx', content, 'utf8');
  console.log("Successfully replaced!");
} else {
  console.log("Regex pattern didn't match.");
}
