"use client";
import React, { useState, Suspense } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'intern'; // default to intern
  const isAdmin = role === 'admin';

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      role: isAdmin ? "ADMIN" : "INTERN",
    });

    if (res?.error) {
      toast.error("Invalid email or password");
      setIsLoading(false);
    } else {
      toast.success("Successfully logged in!");
      const session = await getSession();
      setIsLoading(false);
      
      if (session?.user && (session.user as any).role === "ADMIN") {
        router.push("/dashboard");
      } else {
        router.push("/intern-panel");
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#e0e5ec] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border-2 border-black rounded-2xl p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] relative">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">{isAdmin ? "Admin Login" : "Intern Login"}</h1>
        <p className="text-slate-500 mb-8">Sign in to your Belvo workspace.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold uppercase tracking-widest mb-1 text-slate-900">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={`w-full border-2 border-black rounded-xl p-3 focus:outline-none shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900 placeholder-slate-400 ${isAdmin ? 'focus:border-[#8A2BE2]' : 'focus:border-[#00f2fe]'}`}
              placeholder={isAdmin ? "admin@belvo.com" : "intern@belvo.com"}
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase tracking-widest mb-1 text-slate-900">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`w-full border-2 border-black rounded-xl p-3 focus:outline-none shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900 placeholder-slate-400 ${isAdmin ? 'focus:border-[#8A2BE2]' : 'focus:border-[#00f2fe]'}`}
              placeholder="••••••••"
            />
          </div>
          <button 
            disabled={isLoading}
            className={`w-full text-white font-bold py-3 rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all disabled:opacity-50 mt-4 ${
              isAdmin 
                ? 'bg-[#8A2BE2] hover:bg-[#7a20c9] hover:translate-y-1 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)]' 
                : 'bg-[#00f2fe] text-slate-900 hover:bg-[#00d2dd] hover:translate-y-1 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)]'
            }`}
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        {isAdmin && (
          <p className="mt-6 text-center text-sm font-medium">
            Don't have an admin account? <Link href="/register" className="text-[#8A2BE2] hover:underline">Sign up</Link>
          </p>
        )}
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#e0e5ec] flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
