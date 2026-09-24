const fs = require('fs');

let content = fs.readFileSync('src/app/intern-panel/page.tsx', 'utf8');

const reviewsUI = `
              {/* Admin Reviews Row */}
              {displayIntern.reviews && displayIntern.reviews.length > 0 && (
                <div className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-2 border-black p-6 rounded-xl mt-6">
                  <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-4">Admin Feedback</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayIntern.reviews.map((review: any) => (
                      <div key={review.id} className="bg-slate-50 border-2 border-black p-4 rounded-xl shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-100 px-2 py-1 border border-blue-200 rounded">{review.type}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{new Date(review.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-1 mb-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < review.rating ? "text-[#8A2BE2] text-lg" : "text-slate-200 text-lg"}>?</span>
                          ))}
                        </div>
                        {review.comments && (
                          <p className="text-sm text-slate-700 italic border-l-2 border-[#00f2fe] pl-3 leading-relaxed">{review.comments}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
`;

content = content.replace(
  /<KudosWidget teamMembers=\{teamMembers\} \/>\s*<\/div>/,
  '<KudosWidget teamMembers={teamMembers} />\n              </div>\n' + reviewsUI
);

fs.writeFileSync('src/app/intern-panel/page.tsx', content, 'utf8');
console.log("Patched reviews into frontend!");
