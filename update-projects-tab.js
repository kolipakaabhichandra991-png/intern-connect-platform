const fs = require('fs');
let content = fs.readFileSync('src/app/[internId]/page.tsx', 'utf8');

const replacement = `
        {activeTab === "PROJECTS" && (
          <div className="space-y-6">
            
            {/* UPCOMING PROJECT EDIT */}
            <div className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Upcoming Project</h3>
              {isAdmin ? (
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const res = await fetch(\`/api/interns/\${displayIntern.userId}/project\`, {
                      method: 'PUT',
                      body: JSON.stringify({
                        upcomingProjectTitle: formData.get('title'),
                        upcomingProjectDesc: formData.get('desc'),
                        upcomingProjectDate: formData.get('date'),
                      })
                    });
                    if (res.ok) {
                      toast.success('Project updated!');
                    } else {
                      toast.error('Failed to update project');
                    }
                  }}
                  className="space-y-4"
                >
                  <input name="title" defaultValue={displayIntern.upcomingProjectTitle || ''} placeholder="Project Title" className="w-full border-2 border-black p-3 rounded-lg" required />
                  <textarea name="desc" defaultValue={displayIntern.upcomingProjectDesc || ''} placeholder="Project Description" className="w-full border-2 border-black p-3 rounded-lg" rows={3}></textarea>
                  <input name="date" defaultValue={displayIntern.upcomingProjectDate || ''} placeholder="Deadline (e.g. Friday, 5:00 PM)" className="w-full border-2 border-black p-3 rounded-lg" />
                  <button type="submit" className="bg-[#00f2fe] text-slate-900 font-bold px-6 py-2 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] rounded-xl hover:translate-y-1 hover:shadow-none transition-all">Assign Project</button>
                </form>
              ) : (
                <div className="space-y-2">
                  <h4 className="font-bold text-blue-600">{displayIntern.upcomingProjectTitle || 'No project assigned'}</h4>
                  <p className="text-slate-600 text-sm">{displayIntern.upcomingProjectDesc}</p>
                  <p className="text-xs font-bold text-slate-500 uppercase">Deadline: {displayIntern.upcomingProjectDate || 'N/A'}</p>
                </div>
              )}
            </div>

            {/* COMPLETED PROJECTS */}
            <div>
              <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Completed</h3>
              <div className="space-y-4">
                {displayIntern.completedProjects.map((proj, i) => (
                  <div key={i} className="bg-slate-50 p-5 rounded-xl border-2 border-black flex items-center justify-between shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                    <span className="text-sm font-medium">{proj}</span>
                    <span className="text-[#8A2BE2]">??</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
`;

const regex = /\{activeTab === \"PROJECTS\" && \(\s*<div className=\"space-y-4\">\s*\{displayIntern\.completedProjects\.map[\s\S]*?<\/div>\s*\)\}/;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/app/[internId]/page.tsx', content, 'utf8');
  console.log('Replaced PROJECTS tab!');
} else {
  console.log('Regex did not match!');
}
