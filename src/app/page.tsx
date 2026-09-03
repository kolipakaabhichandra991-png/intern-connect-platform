"use client";
import React from 'react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#e0e5ec] flex items-center justify-center font-sans relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#8A2BE2] rounded-full blur-[150px] opacity-[0.25] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#00f2fe] rounded-full blur-[150px] opacity-[0.25] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl p-6">
        
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif tracking-widest font-bold mb-4">
            <span className="text-slate-900">BEL</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8A2BE2] to-[#00f2fe]">VO</span>
          </h1>
          <p className="text-slate-500 text-lg tracking-wide">Intern Connect Platform</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center">
          
          {/* Admin Login Card */}
          <Link href="/dashboard" className="flex-1 group">
            <div className="h-full bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] backdrop-blur-xl border-2 border-black p-10 rounded-2xl flex flex-col items-center text-center transition-all hover:bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:border-[#8A2BE2]/50 hover:shadow-[0_0_40px_rgba(138,43,226,0.2)]">
              <div className="w-20 h-20 bg-[#8A2BE2]/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(138,43,226,0.5)]">
                <span className="text-3xl">🛡️</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Login as Admin</h2>
              <p className="text-sm text-slate-500 mb-8">Access the directory, monitor performance, and review daily logs.</p>
              <div className="mt-auto w-full py-4 rounded-2xl bg-[#8A2BE2]/20 text-purple-700 font-bold tracking-widest uppercase text-sm group-hover:bg-[#8A2BE2] group-hover:text-slate-900 transition-colors">
                Enter Workspace
              </div>
            </div>
          </Link>

          {/* Intern Login Card */}
          <Link href="/intern-panel" className="flex-1 group">
            <div className="h-full bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] backdrop-blur-xl border-2 border-black p-10 rounded-2xl flex flex-col items-center text-center transition-all hover:bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:border-[#00f2fe]/50 hover:shadow-[0_0_40px_rgba(0,242,254,0.2)]">
              <div className="w-20 h-20 bg-[#00f2fe]/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,242,254,0.5)]">
                <span className="text-3xl">👨‍💻</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Login as Intern</h2>
              <p className="text-sm text-slate-500 mb-8">Submit daily logs, view your upcoming projects, and see your team.</p>
              <div className="mt-auto w-full py-4 rounded-2xl bg-[#00f2fe]/20 text-cyan-700 font-bold tracking-widest uppercase text-sm group-hover:bg-[#00f2fe] group-hover:text-black transition-colors">
                Enter Portal
              </div>
            </div>
          </Link>

        </div>
      </div>
    </main>
  );
}
