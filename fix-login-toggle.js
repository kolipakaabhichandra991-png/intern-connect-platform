const fs = require('fs');
let content = fs.readFileSync('src/app/login/page.tsx', 'utf8');

const toggleUI = `
          {/* TOGGLE BAR */}
          <div className="flex bg-slate-100 rounded-full p-1 border-2 border-black mb-8 w-full max-w-[250px] mx-auto shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            <button 
              onClick={() => router.push('/login?role=intern')}
              type="button"
              className={\`flex-1 text-xs font-bold uppercase tracking-widest py-2 rounded-full transition-all \${!isAdmin ? 'bg-[#00f2fe] text-slate-900 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]' : 'text-slate-500 hover:text-slate-900'}\`}
            >
              Intern
            </button>
            <button 
              onClick={() => router.push('/login?role=admin')}
              type="button"
              className={\`flex-1 text-xs font-bold uppercase tracking-widest py-2 rounded-full transition-all \${isAdmin ? 'bg-[#8A2BE2] text-white border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]' : 'text-slate-500 hover:text-slate-900'}\`}
            >
              Admin
            </button>
          </div>

          <h1`;

content = content.replace('<h1', toggleUI);
fs.writeFileSync('src/app/login/page.tsx', content, 'utf8');
console.log('Injected toggle bar!');
