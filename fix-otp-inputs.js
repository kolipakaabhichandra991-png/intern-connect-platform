const fs = require('fs');

// Fix login page
let loginContent = fs.readFileSync('src/app/login/page.tsx', 'utf8');
loginContent = loginContent.replace(
  "className={`w-full border-2 border-black rounded-xl p-3 text-center tracking-[0.5em] font-bold text-2xl focus:outline-none shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${isAdmin ? 'focus:border-[#8A2BE2]' : 'focus:border-[#00f2fe]'}`}",
  "className={`w-full border-2 border-black rounded-xl p-3 text-center tracking-[0.5em] font-bold text-2xl focus:outline-none shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900 ${isAdmin ? 'focus:border-[#8A2BE2]' : 'focus:border-[#00f2fe]'}`}"
);
fs.writeFileSync('src/app/login/page.tsx', loginContent, 'utf8');

// Fix register page
let registerContent = fs.readFileSync('src/app/register/page.tsx', 'utf8');
registerContent = registerContent.replace(
  "className=\"w-full border-2 border-black rounded-xl p-3 text-center tracking-[0.5em] font-bold text-2xl focus:outline-none shadow-[2px_2px_0_0_rgba(0,0,0,1)] focus:border-[#8A2BE2]\"",
  "className=\"w-full border-2 border-black rounded-xl p-3 text-center tracking-[0.5em] font-bold text-2xl focus:outline-none shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900 focus:border-[#8A2BE2]\""
);
fs.writeFileSync('src/app/register/page.tsx', registerContent, 'utf8');

console.log('Fixed OTP inputs!');
