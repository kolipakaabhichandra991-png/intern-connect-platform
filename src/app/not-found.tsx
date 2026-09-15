"use client";
import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#e0e5ec] flex items-center justify-center font-sans p-6">
      <div className="bg-white border-4 border-black p-12 shadow-[12px_12px_0_0_rgba(0,0,0,1)] text-center max-w-2xl rotate-2">
        <h1 className="text-8xl md:text-9xl font-black mb-4 tracking-tighter text-[#ff3366] -rotate-6 block">404</h1>
        <h2 className="text-4xl font-black uppercase mb-6 tracking-widest bg-[#00f2fe] inline-block px-4 py-2 border-2 border-black rotate-2">Page Not Found</h2>
        <p className="text-xl font-medium mb-12 text-slate-700">Oops! Looks like you took a wrong turn in the neo-brutalist maze. This page doesn't exist.</p>
        <Link 
          href="/" 
          className="bg-[#8A2BE2] text-white font-black uppercase tracking-widest px-8 py-4 border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-xl inline-flex"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
