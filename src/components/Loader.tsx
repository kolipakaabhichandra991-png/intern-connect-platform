import React from 'react';

export default function Loader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-screen bg-[#e0e5ec] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Marquee */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none">
        <h1 className="text-[15vw] font-black uppercase tracking-tighter whitespace-nowrap animate-pulse text-slate-900">
          BELVO
        </h1>
      </div>

      {/* Main Loader Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Spinning Neo-Brutalist Box */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 rounded-xl"></div>
          <div className="absolute inset-0 bg-[#00f2fe] border-4 border-black rounded-xl animate-[spin_2s_linear_infinite] flex items-center justify-center shadow-inner">
            <div className="w-8 h-8 bg-black rounded-full animate-bounce"></div>
          </div>
        </div>

        {/* Text Box */}
        <div className="bg-white border-4 border-black px-8 py-3 rounded-2xl shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
          <h2 className="text-xl font-black uppercase tracking-widest text-slate-900 animate-pulse">
            {text}
          </h2>
        </div>
      </div>
    </div>
  );
}
