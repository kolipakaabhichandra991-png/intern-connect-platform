"use client";
import { useState, use } from "react";
import QRCodeGenerator from "@/components/qrcode/QRCodeGenerator";

export default function ScannedProfilePage({ params }: { params: Promise<{ internId: string }> }) {
  const [activeTab, setActiveTab] = useState("ABOUT");
  const [isFlipped, setIsFlipped] = useState(false);
  const resolvedParams = use(params);

  // Mock data for the demo
  const intern = {
    id: resolvedParams.internId,
    name: "Alex Fielding",
    designation: "Software Engineering Intern",
    photoUrl: "https://i.pravatar.cc/300?img=12",
    level: 3,
    xp: 330,
    age: 21,
    city: "San Francisco",
    bloodGroup: "O+",
    bio: "Passionate about WebGL and interactive 3D experiences. Studying Computer Science.",
    likesCorporate: "Great mentorship and free coffee!",
    completedProjects: ["Internkonnect 3D Dashboard", "GraphQL API Migration"],
  };

  const xpForNextLevel = intern.level * 100;
  const progressPercent = ((intern.xp % 100) / 100) * 100;

  // Dynamic borders based on Level
  let cardBorder = "border-amber-600 shadow-[0_0_25px_rgba(217,119,6,0.3)]"; // Bronze
  if (intern.level >= 3 && intern.level < 5) cardBorder = "border-black shadow-[0_0_25px_rgba(203,213,225,0.5)]"; // Silver
  if (intern.level >= 5) cardBorder = "border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.7)]"; // Gold

  return (
    <main className="min-h-screen bg-[#e0e5ec] text-slate-900 pb-20 font-sans relative overflow-x-hidden">
      
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#8A2BE2] rounded-full blur-[150px] opacity-[0.25] pointer-events-none"></div>

      {/* Nav */}
      <div className="pt-8 px-6 flex justify-between items-center relative z-10">
        <button onClick={() => window.history.back()} className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2 text-sm font-bold tracking-widest uppercase">
          <span>←</span> Back
        </button>
        <div className="text-xl font-serif tracking-widest font-bold">
          <span className="text-slate-900">BEL</span><span className="text-[#8A2BE2]">VO</span>
        </div>
      </div>

      {/* 3D Flippable ID Card Container */}
      <div className="pt-8 px-6 flex flex-col items-center justify-center perspective-1000 relative z-10">
        <div 
          className={`relative w-full max-w-sm h-[420px] transition-transform duration-700 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          
          {/* FRONT OF CARD */}
          <div className={`absolute inset-0 backface-hidden bg-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] backdrop-blur-2xl px-6 py-8 rounded-2xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex flex-col items-center border-4 transition-colors duration-500 ${cardBorder}`}>
            <div className="absolute top-4 right-6 opacity-30 text-xs tracking-widest font-bold">TAP TO FLIP</div>
            
            <div className={`w-32 h-32 rounded-full overflow-hidden border-4 bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${cardBorder} relative mt-4`}>
              <img src={intern.photoUrl} alt={intern.name} className="w-full h-full object-cover" />
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 mt-6">{intern.name}</h1>
            <p className="text-[#8A2BE2] font-medium text-sm mt-2 uppercase tracking-widest text-center">{intern.designation}</p>
            
            {/* Quick Stats Grid */}
            <div className="flex gap-8 mt-auto w-full justify-center border-t border-black pt-6">
              <div className="text-center"><p className="text-[10px] text-slate-500 uppercase tracking-widest">Level</p><p className="font-semibold text-slate-900 mt-1 text-xl">{intern.level}</p></div>
              <div className="text-center"><p className="text-[10px] text-slate-500 uppercase tracking-widest">Dept</p><p className="font-semibold text-slate-900 mt-1 text-lg">ENG</p></div>
              <div className="text-center"><p className="text-[10px] text-slate-500 uppercase tracking-widest">ID</p><p className="font-semibold text-[#8A2BE2] mt-1 text-lg font-mono">{intern.id.substring(0, 4)}</p></div>
            </div>
          </div>

          {/* BACK OF CARD (QR CODE) */}
          <div className={`absolute inset-0 backface-hidden bg-[#ffffff] rounded-2xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex flex-col items-center justify-center backdrop-blur-2xl border-4 rotate-y-180 transition-colors duration-500 ${cardBorder}`}>
            <div className="absolute top-4 left-6 opacity-30 text-xs tracking-widest font-bold">TAP TO FLIP</div>
            
            <div className="bg-white p-4 rounded-xl shadow-[0_0_30px_rgba(138,43,226,0.3)]">
              {/* Uses the QRCode component we built */}
              <QRCodeGenerator internId={intern.id} name={intern.name} />
            </div>
            
            <div className="mt-8 text-center px-8">
              <h3 className="text-xl font-bold text-slate-900 tracking-wide">SCAN TO CONNECT</h3>
              <p className="text-sm text-slate-500 mt-2">Official BELVO Intern Identity Card</p>
            </div>
          </div>

        </div>
        
        <div className="text-center mt-6">
          <p className="text-xs text-slate-400 uppercase tracking-widest animate-pulse">Tap the card to flip</p>
        </div>
      </div>

      {/* Custom Mobile Tabs */}
      <div className="flex justify-around bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] mt-6 overflow-x-auto mx-4 rounded-2xl border-2 border-black p-1 relative z-10 max-w-2xl md:mx-auto">
        {["ABOUT", "PROJECTS", "REVIEWS"].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-xs font-bold tracking-wider transition-all whitespace-nowrap rounded-xl ${activeTab === tab ? "bg-[#8A2BE2] text-slate-900 shadow-[0_0_15px_rgba(138,43,226,0.4)]" : "text-slate-500 hover:text-gray-200"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="p-4 max-w-2xl mx-auto mt-2 relative z-10">
        {activeTab === "ABOUT" && (
          <div className="space-y-4">
            
            {/* XP Tracker in About Section */}
            <div className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-6 rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[10px] uppercase tracking-widest text-[#8A2BE2] font-bold">Experience Level</h3>
                <span className="text-xs font-bold text-slate-900 text-right">{intern.xp} / {xpForNextLevel} XP</span>
              </div>
              <div className="w-full h-3 bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] rounded-full overflow-hidden border-2 border-black">
                <div className="h-full bg-gradient-to-r from-[#8A2BE2] to-[#00f2fe]" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>

            <div className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-6 rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <h3 className="text-[10px] uppercase tracking-widest text-[#8A2BE2] font-bold mb-3">Bio</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{intern.bio}</p>
            </div>
          </div>
        )}

        {activeTab === "PROJECTS" && (
          <div className="space-y-4">
            {intern.completedProjects.map((proj, i) => (
              <div key={i} className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-5 rounded-xl border-2 border-black flex items-center justify-between shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                <span className="text-sm font-medium">{proj}</span>
                <span className="text-[#8A2BE2]">✅</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "REVIEWS" && (
          <div className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-6 rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <h3 className="text-[10px] uppercase tracking-widest text-yellow-400 font-bold mb-4">Leave an HR Review</h3>
            <div className="flex justify-between mb-4">
               {[1, 2, 3, 4, 5].map((star) => (
                 <span key={star} className="text-3xl text-gray-700 hover:text-yellow-400 cursor-pointer transition-colors">★</span>
               ))}
            </div>
            <textarea 
              className="w-full bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-2 border-black rounded-2xl p-4 text-sm text-slate-600 focus:border-[#8A2BE2] focus:ring-1 focus:ring-[#8A2BE2] outline-none transition-all resize-none" 
              rows={3} 
              placeholder="Write a performance review..."
            ></textarea>
            <button className="w-full mt-4 bg-[#8A2BE2] text-slate-900 py-3 rounded-xl font-bold tracking-widest uppercase text-xs shadow-[0_0_15px_rgba(138,43,226,0.5)]">
              Submit Review
            </button>
          </div>
        )}
      </div>

    </main>
  );
}
