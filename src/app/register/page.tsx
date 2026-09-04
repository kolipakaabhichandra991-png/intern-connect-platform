"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ADMIN"); // Forced to ADMIN
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register");
      }

      toast.success("Admin Account created! Logging you in...");
      
      // Log them in immediately
      await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

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
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Create Admin</h1>
        <p className="text-slate-500 mb-8">Set up your workspace dashboard.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold uppercase tracking-widest mb-1 text-slate-900">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border-2 border-black rounded-xl p-3 focus:outline-none focus:border-[#8A2BE2] shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900 placeholder-slate-400"
              placeholder="Admin Name"
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
              placeholder="admin@belvo.com"
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
          
          <button 
            disabled={isLoading}
            className="w-full bg-[#8A2BE2] text-white font-bold py-3 rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-[#7a20c9] hover:translate-y-1 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all disabled:opacity-50 mt-4"
          >
            {isLoading ? "Creating account..." : "Create Admin Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-medium">
          Already have an account? <Link href="/login?role=admin" className="text-[#8A2BE2] hover:underline">Login</Link>
        </p>
      </div>
    </main>
  );
}
