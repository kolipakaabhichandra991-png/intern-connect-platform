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
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: isAdmin ? "ADMIN" : "INTERN" })
      });

      if (res.ok) {
        toast.success("OTP sent to your email!");
        setStep(2);
      } else {
        const data = await res.json();
        toast.error(data.error || "Invalid credentials");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      role: isAdmin ? "ADMIN" : "INTERN",
      otp
    });

    if (res?.error) {
      toast.error(res.error || "Invalid OTP");
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
        <p className="text-slate-500 mb-8">
          {step === 1 ? "Sign in to your Belvo workspace." : "Enter the verification code sent to your email."}
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
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
              {isLoading ? "Checking..." : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest mb-1 text-slate-900">Verification Code</label>
              <input 
                type="text" 
                required
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className={`w-full border-2 border-black rounded-xl p-3 focus:outline-none shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900 placeholder-slate-400 text-center tracking-[1em] font-mono text-xl ${isAdmin ? 'focus:border-[#8A2BE2]' : 'focus:border-[#00f2fe]'}`}
                placeholder="000000"
                maxLength={6}
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
              {isLoading ? "Verifying..." : "Verify & Login"}
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setStep(1)}
              className="w-full text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mt-2"
            >
              Back to Login
            </button>
          </form>
        )}

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
