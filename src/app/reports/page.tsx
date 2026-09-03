"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function ReportsPage() {
  const [reports, setReports] = useState([
    {
      id: 1,
      intern: "Alex Fielding",
      date: "Today, 4:30 PM",
      reportOfDay: "Completed the WebGL dashboard integration and fixed the QR code flipping bugs.",
      learningOfDay: "Learned how to use React Three Fiber's MeshTransmissionMaterial for glass effects.",
      hrFeedback: "Excellent progress, Alex! The 3D effect looks incredibly polished."
    },
    {
      id: 2,
      intern: "Sarah Jenkins",
      date: "Yesterday, 5:15 PM",
      reportOfDay: "Refactored the authentication middleware to support role-based access for the CEO.",
      learningOfDay: "Deep dive into NextAuth JWT callbacks.",
      hrFeedback: "" // Pending
    }
  ]);

  return (
    <main className="min-h-screen bg-[#e0e5ec] text-slate-900 font-sans selection:bg-[#8A2BE2] selection:text-slate-900 relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#8A2BE2] rounded-full blur-[150px] opacity-[0.15] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col p-6 md:p-10 max-w-7xl mx-auto h-screen">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <Link href="/dashboard" className="text-3xl font-serif tracking-widest font-bold">
            <span className="text-slate-900">BEL</span>
            <span className="text-[#8A2BE2]">VO</span>
          </Link>
          <nav className="hidden md:flex gap-8 items-center text-sm font-medium text-slate-600">
            <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Directory</Link>
            <Link href="/reports" className="text-[#8A2BE2] font-bold">Reports</Link>
            <Link href="/analytics" className="hover:text-slate-900 transition-colors">Analytics</Link>
          </nav>
        </header>

        {/* Content Layout */}
        <div className="flex flex-col flex-1 min-h-0">
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Organization Reports</h1>
            <p className="text-slate-500 text-sm">Review daily logs from your interns and provide feedback.</p>
          </div>

          {/* Timeline Feed (Admin View) */}
          <div className="w-full bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] backdrop-blur-2xl border-2 border-black rounded-xl p-8 shadow-[4px_4px_0_0_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[70vh]">
            <h2 className="text-xl font-semibold tracking-wide text-slate-900/90 mb-8 flex items-center gap-3">
              Organization Timeline 
              <span className="bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-xs px-2 py-1 rounded-md text-[#8A2BE2]">Live Feed</span>
            </h2>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-6 space-y-8">
              {reports.map((report) => (
                <div key={report.id} className="relative pl-8 border-l border-[#8A2BE2]/30 pb-4">
                  <div className="absolute -left-[6px] top-0 w-3 h-3 rounded-full bg-[#8A2BE2] shadow-[0_0_12px_#8A2BE2]"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] overflow-hidden border border-[#8A2BE2]/50">
                        <img src={`https://i.pravatar.cc/150?u=${report.intern}`} alt="avatar" />
                      </div>
                      <span className="font-bold text-lg text-slate-900 tracking-wide">{report.intern}</span>
                    </div>
                    <span className="text-sm text-slate-400 font-medium bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] px-3 py-1 rounded-full">{report.date}</span>
                  </div>
                  
                  <div className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-6 rounded-2xl border-2 border-black mb-4 group hover:border-black transition-colors">
                    <p className="text-base text-slate-600 leading-relaxed mb-4">
                      <span className="text-slate-400 font-semibold text-xs uppercase mr-3 tracking-widest">Report:</span>
                      {report.reportOfDay}
                    </p>
                    <p className="text-base text-slate-600 leading-relaxed">
                      <span className="text-slate-400 font-semibold text-xs uppercase mr-3 tracking-widest">Learning:</span>
                      {report.learningOfDay}
                    </p>
                  </div>

                  {report.hrFeedback ? (
                    <div className="bg-[#8A2BE2]/10 p-4 rounded-xl border border-[#8A2BE2]/30 flex gap-4 items-start ml-6 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#8A2BE2]"></div>
                      <div className="text-xs uppercase font-bold text-[#8A2BE2] mt-0.5 shrink-0">HR Review</div>
                      <p className="text-sm text-purple-700 leading-relaxed">{report.hrFeedback}</p>
                    </div>
                  ) : (
                    <div className="ml-6 bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-4 rounded-xl border-2 border-black focus-within:border-[#8A2BE2]/50 transition-colors">
                      <div className="text-xs uppercase font-bold text-slate-400 mb-2">Provide Feedback</div>
                      <input 
                        type="text" 
                        placeholder="Type your review and press Enter..."
                        className="bg-transparent border-b border-black text-sm text-slate-900 placeholder-slate-400 focus:border-[#8A2BE2] outline-none py-2 w-full transition-colors"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(138, 43, 226, 0.3); border-radius: 6px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(138, 43, 226, 0.6); }
      `}} />
    </main>
  );
}
