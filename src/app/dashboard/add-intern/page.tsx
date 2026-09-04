"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AddInternPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "INTERN", department, photoUrl })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create intern");
      }

      toast.success("Intern created successfully!");
      router.push("/dashboard");

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#e0e5ec] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border-2 border-black rounded-2xl p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] relative">
        
        <Link href="/dashboard" className="text-sm font-bold text-slate-500 hover:text-slate-900 mb-4 inline-block uppercase tracking-widest">
          ← Back
        </Link>
        
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Add Intern</h1>
        <p className="text-slate-500 mb-8">Create a new intern account for your team.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold uppercase tracking-widest mb-1 text-slate-900">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border-2 border-black rounded-xl p-3 focus:outline-none focus:border-[#8A2BE2] shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900 placeholder-slate-400"
              placeholder="Intern Name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold uppercase tracking-widest mb-1 text-slate-900">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border-2 border-black rounded-xl p-3 focus:outline-none focus:border-[#8A2BE2] shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900 placeholder-slate-400"
              placeholder="intern@belvo.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold uppercase tracking-widest mb-1 text-slate-900">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border-2 border-black rounded-xl p-3 focus:outline-none focus:border-[#8A2BE2] shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900 placeholder-slate-400"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-widest mb-1 text-slate-900">Department</label>
            <select 
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full border-2 border-black rounded-xl p-3 focus:outline-none focus:border-[#8A2BE2] shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900 cursor-pointer"
            >
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-widest mb-1 text-slate-900">Profile Photo (Optional)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPhotoUrl(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                } else {
                  setPhotoUrl("");
                }
              }}
              className="w-full border-2 border-black rounded-xl p-2 focus:outline-none focus:border-[#8A2BE2] shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900 bg-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#8A2BE2] file:text-white hover:file:bg-[#7a20c9]"
            />
            {photoUrl && (
              <div className="mt-3">
                <p className="text-xs text-slate-500 font-bold mb-1">Preview:</p>
                <img src={photoUrl} alt="Preview" className="w-16 h-16 rounded-full border-2 border-black object-cover" />
              </div>
            )}
            <p className="text-xs text-slate-500 mt-2">Leave blank to auto-generate an avatar.</p>
          </div>
          
          <button 
            disabled={isLoading}
            className="w-full bg-[#8A2BE2] text-white font-bold py-3 rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-[#7a20c9] hover:translate-y-1 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all disabled:opacity-50 mt-4"
          >
            {isLoading ? "Creating..." : "Add Intern"}
          </button>
        </form>

      </div>
    </main>
  );
}
