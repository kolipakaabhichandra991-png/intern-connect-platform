"use client";
import Loader from '@/components/Loader';
import { useState, use, useEffect } from "react";
import QRCodeGenerator from "@/components/qrcode/QRCodeGenerator";
import { useSession } from "@/lib/supabase/useSession";
import { toast } from "sonner";
import { useRouter, notFound } from "next/navigation";

export default function ScannedProfilePage({ params }: { params: Promise<{ internId: string }> }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("ABOUT");
  const [isFlipped, setIsFlipped] = useState(false);
  const resolvedParams = use(params);
  
  const [intern, setIntern] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  
  const [localRole, setLocalRole] = useState<string | null>(null);
  useEffect(() => {
    fetch('/api/me').then(res => res.json()).then(data => setLocalRole(data.role)).catch(() => {});
  }, []);
  const isAdmin = (session?.user && (session.user as any).role === "ADMIN") || localRole === "ADMIN";


  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${intern.name}'s account? This action cannot be undone.`)) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/interns/${resolvedParams.internId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Intern account deleted successfully");
        router.push("/dashboard");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete intern");
        setIsDeleting(false);
      }
    } catch (err) {
      toast.error("An error occurred");
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetch(`/api/interns/${resolvedParams.internId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setIntern(data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [resolvedParams.internId]);

  if (isLoading) {
    return <Loader text="Loading Dossier..." />;
  }

  if (!intern) {
    notFound();
  }

  // Fallbacks for now since some fields don't exist in Prisma yet
  const displayIntern = {
    ...intern,
    level: intern.level || 1,
    xp: intern.xp || 50,
    age: 21,
    city: "Remote",
    bloodGroup: "O+",
    bio: intern.bio || "No biography provided yet.",
    likesCorporate: "Great mentorship and free coffee!",
    completedProjects: ["Onboarding"],
    photoUrl: intern.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(intern.name)}`
  };

  const xpForNextLevel = displayIntern.level * 100;
  const progressPercent = ((displayIntern.xp % 100) / 100) * 100;

  // Dynamic borders based on Level
  let cardBorder = "border-amber-600 shadow-[0_0_25px_rgba(217,119,6,0.3)]"; // Bronze
  if (displayIntern.level >= 3 && displayIntern.level < 5) cardBorder = "border-black shadow-[0_0_25px_rgba(203,213,225,0.5)]"; // Silver
  if (displayIntern.level >= 5) cardBorder = "border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.7)]"; // Gold

  return (
    <main className="min-h-screen bg-[#e0e5ec] text-slate-900 pb-20 font-sans relative overflow-x-hidden">
      
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#8A2BE2] rounded-full blur-[150px] opacity-[0.25] pointer-events-none"></div>

      {/* Nav */}
      <div className="pt-8 px-6 flex justify-between items-center relative z-10">
        <button onClick={() => window.history.back()} className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2 text-sm font-bold tracking-widest uppercase">
          <span>←</span> Back
        </button>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-700 transition-colors text-xs font-bold tracking-widest uppercase border border-red-500 px-3 py-1 rounded-full hover:bg-red-500 hover:text-white"
            >
              {isDeleting ? "Deleting..." : "Delete Intern"}
            </button>
          )}
          <div className="text-xl font-serif tracking-widest font-bold">
            <span className="text-slate-900">BEL</span><span className="text-[#8A2BE2]">VO</span> <span className="text-xs text-red-500">[{session?.user ? (session.user as any).role : "NO_SESSION"}]</span>
          </div>
        </div>
      </div>

      {/* 3D Flippable ID Card Container */}
      <div className="pt-8 px-6 flex flex-col items-center justify-center perspective-1000 relative z-10">
        <div 
          className={`relative w-full max-w-sm h-[420px] transition-transform duration-700 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          
          {/* FRONT OF CARD */}
          <div className={`absolute inset-0 backface-hidden bg-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] backdrop-blur-2xl px-6 py-8 rounded-2xl flex flex-col items-center border-4 transition-colors duration-500 ${cardBorder}`}>
            <div className="absolute top-4 right-6 opacity-30 text-xs tracking-widest font-bold">TAP TO FLIP</div>
            
            <div className={`w-32 h-32 rounded-full overflow-hidden border-4 bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${cardBorder} relative mt-4`}>
              <img src={displayIntern.photoUrl} alt={displayIntern.name} className="w-full h-full object-cover" />
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 mt-6">{displayIntern.name}</h1>
            <p className="text-[#8A2BE2] font-medium text-sm mt-2 uppercase tracking-widest text-center">{displayIntern.designation}</p>
            
            {/* Quick Stats Grid */}
            <div className="flex gap-8 mt-auto w-full justify-center border-t border-black pt-6">
              <div className="text-center"><p className="text-[10px] text-slate-500 uppercase tracking-widest">Level</p><p className="font-semibold text-slate-900 mt-1 text-xl">{displayIntern.level}</p></div>
              <div className="text-center"><p className="text-[10px] text-slate-500 uppercase tracking-widest">Dept</p><p className="font-semibold text-slate-900 mt-1 text-lg">{displayIntern.department?.substring(0,3).toUpperCase() || 'ENG'}</p></div>
              <div className="text-center"><p className="text-[10px] text-slate-500 uppercase tracking-widest">ID</p><p className="font-semibold text-[#8A2BE2] mt-1 text-sm">{displayIntern.idCardNumber || displayIntern.id.substring(0,8)}</p></div>
            </div>
          </div>
          
          {/* BACK OF CARD */}
          <div className={`absolute inset-0 backface-hidden rotate-y-180 bg-[#0f172a] shadow-[6px_6px_0_0_rgba(0,0,0,1)] px-6 py-8 rounded-2xl flex flex-col items-center border-4 border-black text-white`}>
            <div className="absolute top-4 right-6 opacity-30 text-xs tracking-widest font-bold">TAP TO FLIP</div>
            
            <h2 className="text-xl font-bold mb-6 mt-4">Security QR</h2>
            <div className="bg-white p-2 rounded-xl shadow-[4px_4px_0_0_rgba(255,255,255,0.2)]">
              <QRCodeGenerator internId={`intern-${displayIntern.id}`} name={displayIntern.name} />
            </div>
            
            <p className="text-xs text-slate-400 mt-6 max-w-[200px] text-center leading-relaxed">
              Scan this code to verify {displayIntern.name.split(' ')[0]}'s identity.
            </p>
            <p className="mt-auto text-[10px] tracking-widest text-slate-500">ISSUED: 2026</p>
          </div>
        </div>
        <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase mt-8 opacity-60">Tap the card to flip</p>
      </div>

      {/* Tabs */}
      <div className="mt-12 px-6 flex justify-center gap-4 relative z-10">
        {['ABOUT', 'PROJECTS', ...(isAdmin ? ['ACTIVITY'] : [])].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest transition-all ${
              activeTab === tab 
                ? 'bg-slate-900 text-white shadow-[2px_2px_0_0_rgba(0,0,0,1)]' 
                : 'bg-white text-slate-500 border-2 border-black hover:border-[#8A2BE2] hover:text-[#8A2BE2]'
            }`}
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
                <span className="text-xs font-bold text-slate-900 text-right">{displayIntern.xp} / {xpForNextLevel} XP</span>
              </div>
              <div className="w-full h-3 bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] rounded-full overflow-hidden border-2 border-black">
                <div className="h-full bg-gradient-to-r from-[#8A2BE2] to-[#00f2fe]" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>

            <div className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-6 rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <h3 className="text-[10px] uppercase tracking-widest text-[#8A2BE2] font-bold mb-3">Contact Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Name</p>
                    <p className="text-sm font-bold text-slate-900">{displayIntern.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Intern ID</p>
                    <p className="text-sm font-bold text-slate-900">{displayIntern.idCardNumber}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Phone</p>
                    <p className="text-sm font-bold text-slate-900">{displayIntern.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Address</p>
                    <p className="text-sm font-bold text-slate-900">{displayIntern.address || "Not provided"}</p>
                  </div>
                </div>
              
              {(displayIntern.linkedInId || displayIntern.instagramId || displayIntern.githubId) && (
                <div className="mt-6 pt-6 border-t-2 border-slate-100 flex gap-4 flex-wrap">
                  {displayIntern.linkedInId && (
                    <a href={displayIntern.linkedInId.includes('http') ? displayIntern.linkedInId : `https://linkedin.com/in/${displayIntern.linkedInId}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-[#00f2fe] transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      LinkedIn
                    </a>
                  )}
                  {displayIntern.instagramId && (
                    <a href={displayIntern.instagramId.includes('http') ? displayIntern.instagramId : `https://instagram.com/${displayIntern.instagramId}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-[#8A2BE2] transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                      Instagram
                    </a>
                  )}
                  {displayIntern.githubId && (
                    <a href={displayIntern.githubId.includes('http') ? displayIntern.githubId : `https://github.com/${displayIntern.githubId}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-black transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      GitHub
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        
        {activeTab === "PROJECTS" && (
          <div className="space-y-6">
            
            {/* UPCOMING PROJECT EDIT */}
            <div className="bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Upcoming Project</h3>
              {isAdmin ? (
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const res = await fetch(`/api/interns/${displayIntern.userId}/project`, {
                      method: 'PUT',
                      body: JSON.stringify({
                        upcomingProjectTitle: formData.get('title'),
                        upcomingProjectDesc: formData.get('desc'),
                        upcomingProjectDate: formData.get('date'),
                      })
                    });
                    if (res.ok) {
                      toast.success('Project updated!');
                    } else {
                      toast.error('Failed to update project');
                    }
                  }}
                  className="space-y-4"
                >
                  <input name="title" defaultValue={displayIntern.upcomingProjectTitle || ''} placeholder="Project Title" className="w-full border-2 border-black p-3 rounded-lg" required />
                  <textarea name="desc" defaultValue={displayIntern.upcomingProjectDesc || ''} placeholder="Project Description" className="w-full border-2 border-black p-3 rounded-lg" rows={3}></textarea>
                  <input name="date" defaultValue={displayIntern.upcomingProjectDate || ''} placeholder="Deadline (e.g. Friday, 5:00 PM)" className="w-full border-2 border-black p-3 rounded-lg" />
                  <button type="submit" className="bg-[#00f2fe] text-slate-900 font-bold px-6 py-2 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] rounded-xl hover:translate-y-1 hover:shadow-none transition-all">Assign Project</button>
                </form>
              ) : (
                <div className="space-y-2">
                  <h4 className="font-bold text-blue-600">{displayIntern.upcomingProjectTitle || 'No project assigned'}</h4>
                  <p className="text-slate-600 text-sm">{displayIntern.upcomingProjectDesc}</p>
                  <p className="text-xs font-bold text-slate-500 uppercase">Deadline: {displayIntern.upcomingProjectDate || 'N/A'}</p>
                </div>
              )}
            </div>

            {/* COMPLETED PROJECTS */}
            <div>
              <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Completed</h3>
              <div className="space-y-4">
                {displayIntern.completedProjects.map((proj: string, i: number) => (
                  <div key={i} className="bg-slate-50 p-5 rounded-xl border-2 border-black flex items-center justify-between shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                    <span className="text-sm font-medium">{proj}</span>
                    <span className="text-[#8A2BE2]">&#10004;</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "ACTIVITY" && (
          <div className="space-y-4">
            <div className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-6 rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <h3 className="text-[10px] uppercase tracking-widest text-[#8A2BE2] font-bold mb-4">Recent Daily Logs</h3>
              <div className="space-y-4">
                {displayIntern.dailyReports?.length ? displayIntern.dailyReports.slice(0, 3).map((log: any) => (
                  <div key={log.id} className="border-l-2 border-[#8A2BE2] pl-4">
                    <p className="text-xs text-slate-400 mb-1">{new Date(log.createdAt).toLocaleDateString()}</p>
                    <p className="text-sm text-slate-800 line-clamp-2">{log.reportOfDay}</p>
                  </div>
                )) : (
                  <p className="text-sm text-slate-500 italic">No logs submitted yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

    </main>
  );
}
