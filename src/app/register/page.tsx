"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Registration successful! Check your email to confirm.");
        router.push('/login');
      }
    } catch (err: any) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f0e6fa] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] border-4 border-black">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900 mb-8 text-center">
          Admin Sign Up
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold uppercase tracking-widest mb-1 text-slate-900">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border-2 border-black rounded-xl p-3 focus:outline-none shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900 placeholder-slate-400 focus:border-[#8A2BE2]"
              placeholder="admin@belvo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase tracking-widest mb-1 text-slate-900">Password</label>
            <input 
              type="password" 
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border-2 border-black rounded-xl p-3 focus:outline-none shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900 placeholder-slate-400 focus:border-[#8A2BE2]"
              placeholder="••••••••"
            />
          </div>
          <button 
            disabled={isLoading}
            className="w-full bg-[#8A2BE2] text-white font-bold py-3 rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-[#7a20c9] hover:translate-y-1 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all disabled:opacity-50 mt-4"
          >
            {isLoading ? "Creating Account..." : "Create Admin Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-medium">
          Already have an account? <Link href="/login?admin=true" className="text-[#8A2BE2] hover:underline">Log in</Link>
        </p>
      </div>
    </main>
  );
}
