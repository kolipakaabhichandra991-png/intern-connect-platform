"use client";
import React, { useState, useEffect } from 'react';
import RatingComponent from '@/components/reviews/RatingComponent';
import Link from 'next/link';
import { signOut, useSession } from '@/lib/supabase/useSession';
import { toast } from 'sonner';

export default function ReportsPage() {
  const { data: session, status } = useSession();
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedInternId, setExpandedInternId] = useState<string | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") return;
    
    fetch('/api/logs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setReports(data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [status]);

  const generateAISummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const res = await fetch("/api/ai-summary");
      if (res.ok) {
        const data = await res.json();
        setAiSummary(data.summary);
        toast.success("Summary generated!");
      } else {
        toast.error("Failed to generate summary");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleProvideFeedback = async (reportId: string, feedback: string) => {
    // Add logic here if we create a PATCH route for hrReview later
    console.log("Feedback provided:", feedback);
  };

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#e0e5ec] flex flex-col gap-6 items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4 font-serif">"Feedback is the breakfast of champions."</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest mb-8">- Ken Blanchard</p>
        <Link 
          href="/login" 
          className="px-8 py-3 bg-[#8A2BE2] text-white font-bold tracking-widest uppercase rounded-xl text-sm border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all"
        >
          Sign In Again
        </Link>
      </div>
    );
  }

  if (status === "loading" || isLoading) {
    return <div className="min-h-screen bg-[#e0e5ec] flex items-center justify-center font-bold">Loading...</div>;
  }

  const groupedReportsArray = Object.values(
    reports.reduce((acc: any, report: any) => {
      const internId = report.intern?.id || report.internId || Math.random().toString();
      if (!acc[internId]) {
        acc[internId] = {
          internId,
          intern: report.intern,
          logs: []
        };
      }
      acc[internId].logs.push(report);
      return acc;
    }, {})
  );

  return (
    <main className="min-h-screen bg-[#e0e5ec] text-slate-900 font-sans selection:bg-[#8A2BE2] selection:text-slate-900 relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#8A2BE2] rounded-full blur-[150px] opacity-[0.15] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col p-6 md:p-10 max-w-7xl mx-auto h-screen">
        
        {/* Top Header */}
        <header className="flex justify-between items-start mb-12 pointer-events-auto">
          <Link href="/dashboard" className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-2 border-black p-4 rounded-xl backdrop-blur-md block">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-900">BELVO</h1>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="bg-white border-2 border-black px-6 py-2 rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-[#00f2fe] hover:text-slate-900 transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] hidden md:block"
            >
              DIRECTORY
            </Link>
            <Link href="/reports" className="bg-[#8A2BE2] text-white border-2 border-black px-6 py-2 rounded-xl text-sm font-bold tracking-widest uppercase transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] hidden md:block">
              REPORTS
            </Link>
            <Link 
              href="/resources"
              className="bg-white border-2 border-black px-6 py-2 rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-[#00f2fe] hover:text-slate-900 transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] hidden md:block"
            >
              HUB
            </Link>
            <div className="relative">
              <div 
                className="w-12 h-12 bg-white border-2 border-black rounded-full overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)] cursor-pointer hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <img src={session?.user?.image || "https://i.pravatar.cc/150?img=68"} alt="Admin" className="w-full h-full object-cover" />
              </div>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-4 w-48 bg-white border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] rounded-xl overflow-hidden z-50 flex flex-col pointer-events-auto">
                  <div className="p-4 border-b-2 border-black bg-slate-50">
                    <p className="text-sm font-bold text-slate-900">{session?.user?.name || "Admin User"}</p>
                    <p className="text-xs text-slate-500 font-medium mt-1 truncate">{session?.user?.email || "admin@belvo.com"}</p>
                  </div>
                  <Link href="/resources" className="text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-[#8A2BE2] hover:text-white transition-colors border-b-2 border-slate-100 md:hidden">
                    Resource Hub
                  </Link>
                  <button className="text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-[#8A2BE2] hover:text-white transition-colors border-b-2 border-slate-100">
                    Settings
                  </button>
                  <button 
                    onClick={() => signOut()}
                    className="text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Layout */}
        <div className="flex flex-col flex-1 min-h-0">
          
          <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">Organization Reports</h1>
              <p className="text-slate-500 text-sm">Review daily logs from your interns and provide feedback.</p>
            </div>
            
            <button 
              onClick={generateAISummary}
              disabled={isGeneratingSummary}
              className="bg-[#00f2fe] text-black font-bold py-3 px-6 rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all uppercase tracking-widest text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isGeneratingSummary ? "Generating..." : "✨ AI Summarize Day"}
            </button>
          </div>

          {aiSummary && (
            <div className="bg-white border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] rounded-3xl p-6 md:p-8 mb-8 relative">
              <button 
                onClick={() => setAiSummary(null)}
                className="absolute top-4 right-6 text-slate-400 hover:text-black font-bold text-xl"
              >✕</button>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 flex items-center gap-2">
                🤖 AI Standup Summary
              </h2>
              <div className="prose max-w-none text-slate-700 font-medium whitespace-pre-wrap">
                {aiSummary.replace("✨ **AI Standup Summary** ✨", "").trim()}
              </div>
            </div>
          )}

          {/* Timeline Feed (Admin View) */}
          <div className="w-full h-full flex flex-col max-h-[75vh] overflow-hidden">
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 md:pr-6 space-y-6 pb-20">
              {groupedReportsArray.map((group: any) => {
                const isExpanded = expandedInternId === group.internId;

                return (
                  <div key={group.internId} className="bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] border-4 border-black rounded-3xl overflow-hidden transition-all duration-300">
                    
                    {/* Clickable Header Block */}
                    <div 
                      onClick={() => setExpandedInternId(isExpanded ? null : group.internId)}
                      className="p-6 md:p-8 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-full bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] overflow-hidden border-2 border-black">
                          <img src={group.intern?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(group.intern?.name || "Intern")}`} alt="avatar" />
                        </div>
                        <div>
                          <h2 className="font-bold text-2xl text-slate-900 tracking-tight">{group.intern?.name || "Unknown Intern"}</h2>
                          <span className="text-xs font-bold uppercase tracking-widest text-[#8A2BE2] bg-[#8A2BE2]/10 px-3 py-1 rounded-full border border-[#8A2BE2]/30 mt-2 inline-block">
                            {group.logs.length} Reports
                          </span>
                        </div>
                      </div>
                      
                      {/* Expand / Collapse Icon */}
                      <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-white text-slate-900 transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>

                    {/* Expandable Logs Area */}
                    {isExpanded && (
                      <div className="p-6 md:p-8 pt-0 border-t-2 border-slate-100 bg-slate-50/50">
                        <div className="space-y-8 pl-4 mt-8">
                          {group.logs.map((report: any) => (
                            <div key={report.id} className="relative pl-8 border-l-2 border-slate-200 pb-2">
                              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]"></div>
                              
                              <div className="flex justify-between items-start mb-6">
                                <span className="text-sm text-slate-500 font-bold bg-white shadow-[2px_2px_0_0_rgba(0,0,0,0.1)] px-4 py-2 rounded-md uppercase tracking-wider border border-slate-200">
                                  {new Date(report.createdAt).toLocaleString()}
                                </span>
                              </div>
                              
                              <div className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-8 rounded-2xl border-2 border-black mb-6 transition-colors">
                                <p className="text-base text-slate-800 leading-relaxed mb-6 font-medium">
                                  <span className="text-slate-400 font-bold text-sm uppercase mr-3 tracking-widest">Report:</span>
                                  {report.reportOfDay}
                                </p>
                                <p className="text-base text-slate-800 leading-relaxed mb-6 font-medium">
                                  <span className="text-slate-400 font-bold text-sm uppercase mr-3 tracking-widest">Learning:</span>
                                  {report.learningOfDay}
                                </p>
                                <p className="text-base text-slate-800 leading-relaxed font-medium">
                                  <span className="text-slate-400 font-bold text-sm uppercase mr-3 tracking-widest">Meeting:</span>
                                  {report.meetingOfDay}
                                </p>
                              </div>

                              {report.hrReview ? (
                                <div className="bg-[#8A2BE2]/10 p-6 rounded-xl border-2 border-[#8A2BE2] flex gap-4 items-start relative shadow-[4px_4px_0_0_rgba(138,43,226,0.2)]">
                                  <div className="text-xs uppercase font-bold text-[#8A2BE2] mt-0.5 shrink-0 bg-white px-3 py-1.5 rounded shadow-sm border border-[#8A2BE2]/30">HR Review</div>
                                  <p className="text-base text-purple-900 leading-relaxed font-bold">{report.hrReview}</p>
                                </div>
                              ) : (
                                <div className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-6 rounded-xl border-2 border-black focus-within:border-[#8A2BE2] focus-within:shadow-[4px_4px_0_0_#8A2BE2] transition-all">
                                  <RatingComponent internId={group.internId} reviewType="WORK_REPORT_EVALUATION" /></div>)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {reports.length === 0 && (
                <div className="text-center text-slate-500 p-10 bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] font-bold text-lg">
                  No reports found for any intern.
                </div>
              )}
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

