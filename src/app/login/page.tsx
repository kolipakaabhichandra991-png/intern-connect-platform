"use client";
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error("Incorrect email or password");
      } else {
        toast.success("Successfully logged in!");
        router.push(isAdmin ? '/intern-panel' : '/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/api/auth/callback`
      }
    });
  };

  return (
    <main className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${isAdmin ? 'bg-[#f0e6fa]' : 'bg-[#e0e5ec]'}`}>
      <div className={`absolute top-0 left-0 w-full h-2 ${isAdmin ? 'bg-gradient-to-r from-[#8A2BE2] to-[#c299eb]' : 'bg-gradient-to-r from-[#00f2fe] to-[#4facfe]'}`} />
      
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] border-4 border-black">
        <div className="mb-8 text-center relative">
          <div className="inline-block relative">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">
              {isAdmin ? "Admin Access" : "Belvo Login"}
            </h1>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
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
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`w-full border-2 border-black rounded-xl p-3 pr-12 focus:outline-none shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900 placeholder-slate-400 ${isAdmin ? 'focus:border-[#8A2BE2]' : 'focus:border-[#00f2fe]'}`}
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 font-bold text-xs uppercase tracking-widest"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          
          <button 
            disabled={isLoading}
            className={`w-full text-white font-bold py-3 rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all disabled:opacity-50 mt-4 ${
              isAdmin 
                ? 'bg-[#8A2BE2] hover:bg-[#7a20c9] hover:translate-y-1 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)]' 
                : 'bg-[#00f2fe] text-slate-900 hover:bg-[#00d2dd] hover:translate-y-1 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)]'
            }`}
          >
            {isLoading ? "Checking..." : "Continue"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-2">
           <button 
             onClick={() => handleOAuth('google')}
             className="w-full font-bold py-3 rounded-xl border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2 bg-white text-black"
           >
             Continue with Google
           </button>
           <button 
             onClick={() => handleOAuth('github')}
             className="w-full font-bold py-3 rounded-xl border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2 bg-black text-white"
           >
             Continue with GitHub
           </button>
        </div>

        <p className="mt-6 text-center text-sm font-medium">
          Don't have an account? <Link href="/register" className="text-[#00f2fe] hover:underline">Sign up</Link>
        </p>
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
