"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import QRCodeGenerator from "@/components/qrcode/QRCodeGenerator";

export default function InternPanelPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Gamification State
  const [xp, setXp] = useState(280); // Starts at Level 2 (280/300)
  const currentLevel = Math.floor(xp / 100) + 1;
  const xpForNextLevel = currentLevel * 100;
  const progressPercent = ((xp % 100) / 100) * 100;

  const handleSubmitLog = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const newXp = xp + 50;
      setXp(newXp);
      setIsSubmitting(false);
      
      if (Math.floor(newXp / 100) > Math.floor(xp / 100)) {
        alert("🎉 LEVEL UP! You earned 50 XP and reached Level " + (currentLevel + 1) + "!");
      } else {
        alert("+50 XP! Daily Log Submitted Successfully.");
      }
    }, 1000);
  };

  // Mock data for the logged-in intern
  const intern = {
    id: "intern-123",
    name: "Alex Fielding",
    designation: "Software Engineering Intern",
    photoUrl: "https://i.pravatar.cc/300?img=12",
    department: "Engineering",
    rating: "4.8",
    projectsDone: 12,
    teamName: "Nexus WebGL Core",
  };

  const teamMembers = [
    { name: "Sarah Jenkins", role: "Team Lead", img: "https://i.pravatar.cc/150?img=5" },
    { name: "David Kim", role: "Sr. Engineer", img: "https://i.pravatar.cc/150?img=11" },
    { name: "Priya Patel", role: "UI/UX", img: "https://i.pravatar.cc/150?img=9" },
  ];

  const upcomingProject = {
    title: "Implement Real-time WebSocket Feed",
    deadline: "Friday, 5:00 PM",
    description: "Build out the WebSocket integration for the new analytics dashboard live feed feature."
  };

  // Dynamic borders based on Level
  let cardBorder = "border-amber-600 shadow-[0_0_25px_rgba(217,119,6,0.3)]"; // Bronze
  if (currentLevel >= 3 && currentLevel < 5) cardBorder = "border-black shadow-[0_0_25px_rgba(203,213,225,0.5)]"; // Silver
  if (currentLevel >= 5) cardBorder = "border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.7)]"; // Gold

  return (
    <main className="min-h-screen bg-[#e0e5ec] text-slate-900 font-sans selection:bg-[#00f2fe] selection:text-slate-900 relative overflow-hidden pb-20">
      
      {/* Background ambient glow - using cyan/blue for Intern view */}
      <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-[#00f2fe] rounded-full blur-[180px] opacity-[0.15] pointer-events-none"></div>

      <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="text-3xl font-serif tracking-widest font-bold">
            <span className="text-slate-900">BEL</span>
            <span className="text-blue-600">VO</span>
            <span className="text-xs ml-3 bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] px-2 py-1 rounded-md text-slate-600 tracking-normal font-sans align-middle">Intern Portal</span>
          </div>
          <nav className="hidden md:flex gap-8 items-center text-sm font-medium text-slate-600">
            <span className="text-slate-900 font-bold">My Workspace</span>
            <Link href="/" className="hover:text-red-400 transition-colors">Sign Out</Link>
          </nav>
        </header>

        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Welcome back, {intern.name.split(' ')[0]}!</h1>
            <p className="text-slate-500">Here's your project roadmap and team overview.</p>
          </div>
          
          {/* Top XP Tracker */}
          <div className="hidden md:flex flex-col items-end">
            <div className="flex gap-4 items-center mb-1">
              <span className="text-xs uppercase tracking-widest text-blue-600 font-bold">Level {currentLevel}</span>
              <span className="text-xs text-slate-500">{xp} / {xpForNextLevel} XP</span>
            </div>
            <div className="w-48 h-3 bg-white border-2 border-black rounded-full border-2 border-black overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#00f2fe] to-purple-500 transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: ID Card & Quick Stats */}
          <div className="w-full lg:w-5/12 flex flex-col gap-6">
            
            {/* Flippable Digital ID */}
            <div className="perspective-1000">
              <div 
                className={`relative w-full h-[260px] transition-transform duration-700 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* FRONT */}
                <div className={`absolute inset-0 backface-hidden bg-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] backdrop-blur-2xl rounded-xl border-2 p-6 flex items-center gap-6 transition-colors duration-500 ${cardBorder}`}>
                  <div className="absolute top-4 right-5 opacity-30 text-[10px] tracking-widest font-bold">TAP TO FLIP</div>
                  
                  <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#00f2fe] shadow-[0_0_15px_rgba(0,242,254,0.3)] shrink-0">
                    <img src={intern.photoUrl} alt={intern.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">{intern.name}</h2>
                    <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-3">{intern.designation}</p>
                    <p className="text-slate-500 text-xs mb-1">Dept: <span className="text-slate-900">{intern.department}</span></p>
                    <p className="text-slate-500 text-xs">Level: <span className="text-slate-900 font-bold">{currentLevel}</span></p>
                  </div>
                </div>

                {/* BACK (QR) */}
                <div className="absolute inset-0 backface-hidden bg-[#ffffff] rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center justify-center backdrop-blur-2xl border border-[#00f2fe]/50 rotate-y-180 gap-8 px-8">
                  <div className="absolute top-4 left-5 opacity-30 text-[10px] tracking-widest font-bold">TAP TO FLIP</div>
                  
                  <div className="bg-white p-2 rounded-xl shadow-[0_0_20px_rgba(0,242,254,0.2)] shrink-0">
                    <QRCodeGenerator internId={intern.id} name={intern.name} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-slate-900 tracking-wide leading-tight mb-2">SCAN FOR <br/> PROFILE</h3>
                    <p className="text-[10px] text-slate-500">Present this to HR for instant access to your dossier.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] backdrop-blur-xl border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-center">
                 <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Projects Done</p>
                 <p className="text-3xl font-bold text-slate-900">{intern.projectsDone}</p>
               </div>
               <div className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] backdrop-blur-xl border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-center">
                 <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Current Rating</p>
                 <p className="text-3xl font-bold text-blue-600">★ {intern.rating}</p>
               </div>
            </div>

          </div>

          {/* Right Column: Projects and Team */}
          <div className="w-full lg:w-7/12 flex flex-col gap-6">
            
            {/* Upcoming Project */}
            <div className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] backdrop-blur-xl border-2 border-black p-8 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-[#00f2fe] to-transparent opacity-50"></div>
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                  Upcoming Project
                  <span className="text-[9px] bg-red-500/20 text-red-400 px-2 py-1 rounded uppercase tracking-widest">High Priority</span>
                </h3>
              </div>
              
              <div className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] rounded-2xl p-6 border-2 border-black">
                <h4 className="text-lg font-bold text-blue-600 mb-2">{upcomingProject.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{upcomingProject.description}</p>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <span>⏱️ Deadline:</span>
                  <span className="text-slate-900">{upcomingProject.deadline}</span>
                </div>
              </div>
            </div>

            {/* My Team */}
            <div className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] backdrop-blur-xl border-2 border-black p-8 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex-1 flex flex-col justify-center">
              <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-2">My Team</h3>
              <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-6">Squad: {intern.teamName}</p>

              <div className="flex flex-col gap-4">
                {teamMembers.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white border-2 border-black p-3 rounded-2xl hover:bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-colors cursor-pointer border border-transparent hover:border-black">
                    <img src={member.img} alt={member.name} className="w-12 h-12 rounded-full object-cover border-2 border-black" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
                      <p className="text-xs text-slate-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Daily Log */}
            <form onSubmit={handleSubmitLog} className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] backdrop-blur-xl border-2 border-black p-8 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] relative overflow-hidden flex flex-col mt-2">
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-[#00f2fe] to-transparent opacity-50"></div>
              
              <div className="mb-4">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-1">Submit Today's Log</h3>
                <p className="text-xs text-slate-500">Your logs are sent directly to your HR manager.</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">What did you accomplish today?</label>
                  <textarea 
                    required
                    className="w-full p-4 bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] rounded-xl border-2 border-black focus:bg-white border-2 border-black focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe] outline-none text-sm transition-all text-gray-200 placeholder-slate-400 custom-scrollbar"
                    rows={3} 
                    placeholder="Summarize your tasks and progress..."
                  />
                </div>
                <button 
                  disabled={isSubmitting}
                  className="w-full bg-[#00f2fe]/20 border border-[#00f2fe]/50 text-slate-900 font-bold py-4 rounded-xl hover:bg-[#00f2fe] hover:text-black hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] active:scale-[0.98] transition-all disabled:opacity-50 tracking-wide"
                >
                  {isSubmitting ? "Submitting Log..." : "Submit Daily Log"}
                </button>
              </div>
            </form>

          </div>

        </div>

      </div>
    </main>
  );
}
