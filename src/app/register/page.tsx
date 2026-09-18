"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: "ADMIN", isRegister: true })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      setStep('otp');
      toast.success("6-digit code sent to your email!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Invalid OTP");
      }

      toast.success("Registration complete! Welcome Admin.");
      window.location.href = data.url;
    } catch (err: any) {
      toast.error(err.message);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f0e6fa] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] border-4 border-black relative">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900 mb-8 text-center">
          Admin Sign Up
        </h1>

        {step === 'email' ? (
          <form onSubmit={handleSendCode} className="space-y-4">
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
            
            <button 
              disabled={isLoading}
              className="w-full bg-[#8A2BE2] text-white font-bold py-3 rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-[#7a20c9] hover:translate-y-1 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all disabled:opacity-50 mt-4"
            >
              {isLoading ? "Sending Code..." : "Send Secure Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest mb-1 text-slate-900">Enter 6-Digit Code</label>
              <input 
                type="text" 
                required
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full border-2 border-black rounded-xl p-3 text-center tracking-[0.5em] font-bold text-2xl focus:outline-none shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900 focus:border-[#8A2BE2]"
                placeholder="000000"
              />
            </div>
            
            <button 
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-[#8A2BE2] text-white font-bold py-3 rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-[#7a20c9] hover:translate-y-1 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all disabled:opacity-50 mt-4"
            >
              {isLoading ? "Verifying..." : "Verify & Join"}
            </button>

            <button 
              type="button"
              onClick={() => setStep('email')}
              className="w-full mt-2 text-sm font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest"
            >
              Back
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm font-medium">
          Already have an account? <Link href="/login?role=admin" className="text-[#8A2BE2] hover:underline">Log in</Link>
        </p>
      </div>
    </main>
  );
}
