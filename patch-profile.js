const fs = require('fs');
let content = fs.readFileSync('src/app/[internId]/page.tsx', 'utf8');

const newUI = `<h3 className="text-[10px] uppercase tracking-widest text-[#8A2BE2] font-bold mb-3">Contact Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Name</p>
                    <p className="text-sm font-bold text-slate-900">{displayIntern.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Intern ID</p>
                    <p className="text-sm font-bold text-slate-900">{displayIntern.idCardNumber}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Phone</p>
                    <p className="text-sm font-bold text-slate-900">{displayIntern.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Address</p>
                    <p className="text-sm font-bold text-slate-900">{displayIntern.address || "Not provided"}</p>
                  </div>
                </div>`;

content = content.replace(/<h3 className="text-\[10px\] uppercase tracking-widest text-\[#8A2BE2\] font-bold mb-3">Bio<\/h3>\s*<p className="text-slate-600 text-sm leading-relaxed">\{displayIntern\.bio\}<\/p>/, newUI);
fs.writeFileSync('src/app/[internId]/page.tsx', content, 'utf8');
console.log("Patched Scanned Profile!");
