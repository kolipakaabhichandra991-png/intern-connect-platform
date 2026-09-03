"use client";
import React from 'react';
import Link from 'next/link';

export default function AnalyticsPage() {
  // Mock data for analytics
  const stats = [
    { label: "Total Active Interns", value: "24", trend: "+3 this month" },
    { label: "Daily Logs Submitted", value: "1,204", trend: "+12% vs last week" },
    { label: "Average Performance", value: "4.8 / 5", trend: "+0.2 rating" },
    { label: "Projects Completed", value: "45", trend: "On track" },
  ];

  const departmentData = [
    { name: "Engineering", count: 12, color: "bg-blue-500" },
    { name: "Design", count: 7, color: "bg-purple-500" },
    { name: "Marketing", count: 5, color: "bg-pink-500" },
  ];

  return (
    <main className="min-h-screen bg-[#e0e5ec] text-slate-900 font-sans selection:bg-[#8A2BE2] selection:text-slate-900 relative overflow-hidden pb-20">
      
      {/* Background ambient glow */}
      <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[180px] opacity-[0.15] pointer-events-none"></div>
      <div className="absolute bottom-0 left-[20%] w-[400px] h-[400px] bg-pink-600 rounded-full blur-[150px] opacity-[0.15] pointer-events-none"></div>

      <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <Link href="/dashboard" className="text-3xl font-serif tracking-widest font-bold">
            <span className="text-slate-900">BEL</span>
            <span className="text-[#8A2BE2]">VO</span>
          </Link>
          <nav className="hidden md:flex gap-8 items-center text-sm font-medium text-slate-600">
            <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Directory</Link>
            <Link href="/reports" className="hover:text-slate-900 transition-colors">Reports</Link>
            <Link href="/analytics" className="text-[#8A2BE2] font-bold">Analytics</Link>
          </nav>
        </header>

        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Analytics Overview</h1>
          <p className="text-slate-500">High-level metrics for the intern cohort.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] backdrop-blur-xl border-2 border-black p-6 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] relative overflow-hidden group hover:bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all cursor-pointer">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#8A2BE2] rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-2 font-semibold">{stat.label}</p>
              <h3 className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</h3>
              <p className="text-xs text-purple-700 font-medium">{stat.trend}</p>
            </div>
          ))}
        </div>

        {/* Charts Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Bar Chart Mockup */}
          <div className="flex-1 bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] backdrop-blur-xl border-2 border-black p-8 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <h3 className="text-lg font-semibold tracking-wide text-slate-900/90 mb-8">Daily Logs Over Time</h3>
            <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-2">
              {[45, 60, 30, 80, 50, 100, 75, 40, 85, 65, 90, 55].map((h, i) => (
                <div key={i} className="w-full bg-gradient-to-t from-[#8A2BE2]/20 to-[#8A2BE2]/60 rounded-t-lg relative group cursor-pointer hover:to-[#8A2BE2] transition-colors border-t border-[#8A2BE2]/40" style={{ height: `${h}%` }}>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#e0e5ec] border border-[#8A2BE2]/50 px-3 py-1.5 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-[6px_6px_0_0_rgba(0,0,0,1)] font-bold text-slate-900 z-10">
                    {h}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-slate-400 uppercase font-bold border-t border-black pt-4">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="w-full lg:w-1/3 bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] backdrop-blur-xl border-2 border-black p-8 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex flex-col">
            <h3 className="text-lg font-semibold tracking-wide text-slate-900/90 mb-8">Department Breakdown</h3>
            
            <div className="flex-1 flex flex-col justify-center gap-6">
              {departmentData.map((dept, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-slate-600">{dept.name}</span>
                    <span className="text-slate-900">{dept.count} Interns</span>
                  </div>
                  <div className="w-full h-3 bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] rounded-full overflow-hidden border-2 border-black">
                    <div className={`h-full ${dept.color} rounded-full`} style={{ width: `${(dept.count / 24) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-black text-center">
              <button className="text-sm font-bold text-[#8A2BE2] hover:text-slate-900 transition-colors uppercase tracking-widest">Download Report PDF</button>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
