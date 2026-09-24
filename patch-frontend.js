const fs = require('fs');
let content = fs.readFileSync('src/app/intern-panel/page.tsx', 'utf8');

// Replace state variables
content = content.replace('const [editBio, setEditBio] = useState("");', `const [editName, setEditName] = useState("");
  const [editIdCard, setEditIdCard] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");`);

// Replace setters in fetch
content = content.replace('setEditBio(meData.bio || "");', `setEditName(meData.name || "");
          setEditIdCard(meData.idCardNumber || "");
          setEditPhone(meData.phone || "");
          setEditAddress(meData.address || "");`);

// Replace in handleUpdateProfile
content = content.replace('bio: editBio,', `name: editName,
            idCardNumber: editIdCard,
            phone: editPhone,
            address: editAddress,`);

// Replace Bio UI
const oldBioUI = `<div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-900 mb-2">Bio</label>
                  <textarea 
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                    className="w-full border-2 border-black rounded-xl p-3 focus:outline-none focus:border-[#00f2fe] shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900 resize-none h-24"
                    placeholder="Tell us about yourself..."
                  />
                </div>`;

const newUI = `<div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-900 mb-2">Name</label>
                    <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full border-2 border-black rounded-xl p-3 focus:outline-none focus:border-[#00f2fe] shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900" placeholder="Your Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-900 mb-2">Intern ID</label>
                    <input type="text" value={editIdCard} onChange={e => setEditIdCard(e.target.value)} className="w-full border-2 border-black rounded-xl p-3 focus:outline-none focus:border-[#00f2fe] shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900" placeholder="ID Number" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-900 mb-2">Phone No.</label>
                    <input type="text" value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full border-2 border-black rounded-xl p-3 focus:outline-none focus:border-[#00f2fe] shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900" placeholder="Phone Number" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-900 mb-2">Address</label>
                    <input type="text" value={editAddress} onChange={e => setEditAddress(e.target.value)} className="w-full border-2 border-black rounded-xl p-3 focus:outline-none focus:border-[#00f2fe] shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900" placeholder="Address" />
                  </div>
                </div>`;

content = content.replace(oldBioUI, newUI);
fs.writeFileSync('src/app/intern-panel/page.tsx', content, 'utf8');
console.log("Patched Frontend!");
