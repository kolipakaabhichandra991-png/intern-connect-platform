"use client";
import { Star } from "lucide-react";
import React, { useState, useEffect } from 'react'; 
import Loader from '@/components/Loader';
import Link from 'next/link';
import QRCodeGenerator from "@/components/qrcode/QRCodeGenerator";
import PomodoroTimer from "@/components/PomodoroTimer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { signOut, useSession } from "@/lib/supabase/useSession";
import ChangePasswordModal from '@/components/ChangePasswordModal';
import InteractivePixelGrid from '@/components/game/InteractivePixelGrid';
import KudosWidget from '@/components/KudosWidget';

const logSchema = z.object({
  reportOfDay: z.string().min(1),
  learningOfDay: z.string().min(1),
  meetingOfDay: z.string().min(1),
});

type LogFormValues = z.infer<typeof logSchema>;

export default function InternPanelPage() {
  const { data: session, status } = useSession();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  const [intern, setIntern] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editIdCard, setEditIdCard] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editInstagram, setEditInstagram] = useState("");
  const [editLinkedIn, setEditLinkedIn] = useState("");
  const [editGithub, setEditGithub] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LogFormValues>({
    resolver: zodResolver(logSchema)
  });

  useEffect(() => {
    if (status === "unauthenticated") return;
    
    Promise.all([
      fetch('/api/interns/me').then(res => res.json()),
      fetch('/api/interns').then(res => res.json())
    ])
    .then(([meData, allInternsData]) => {
      if (meData.error) {
        toast.error(meData.error);
      } else {
        setIntern(meData);
        setEditName(meData.name || "");
          setEditIdCard(meData.idCardNumber || "");
          setEditPhone(meData.phone || "");
          setEditAddress(meData.address || "");
        setEditInstagram(meData.instagramId || "");
        setEditLinkedIn(meData.linkedInId || "");
        setEditGithub(meData.githubId || "");
        
        if (Array.isArray(allInternsData)) {
          // Filter out the current user, and pick a few others as 'team members'
          let others = allInternsData.filter(i => i.id !== meData.id);
            if (meData.teamName) {
              others = others.filter(i => i.teamName === meData.teamName);
            }
          setTeamMembers(others.slice(0, 3));
        }
      }
      setIsLoading(false);
    })
    .catch(err => {
      toast.error("Network error");
      setIsLoading(false);
    });
  }, [status]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/interns/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
            idCardNumber: editIdCard,
            phone: editPhone,
            address: editAddress,
          instagramId: editInstagram,
          linkedInId: editLinkedIn,
          githubId: editGithub
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setIntern(updated);
        setIsEditModalOpen(false);
        toast.success("Profile updated!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch(err) {
      toast.error("Network error");
    }
  };

  const xp = intern?.xp || 0;
  const currentLevel = Math.floor(xp / 100) + 1;
  const xpForNextLevel = currentLevel * 100;
  const progressPercent = ((xp % 100) / 100) * 100;

  const onSubmit = async (data: LogFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) throw new Error("Failed to submit");
      
      const newXp = xp + 50;
      setIntern({ ...intern, xp: newXp }); // Optimistic update
      reset();
      
      if (Math.floor(newXp / 100) > Math.floor(xp / 100)) {
        toast.success(`🎉 LEVEL UP! You earned 50 XP and reached Level ${currentLevel + 1}!`);
      } else {
        toast.success("+50 XP! Daily Log Submitted Successfully.");
      }
    } catch (error) {
      toast.error("Failed to submit daily log. Are you logged in?");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#e0e5ec] flex flex-col gap-6 items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4 font-serif">"The only way to do great work is to love what you do."</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest mb-8">- Steve Jobs</p>
        <Link 
          href="/login" 
          className="px-8 py-3 bg-[#00f2fe] text-slate-900 font-bold tracking-widest uppercase rounded-xl text-sm border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all"
        >
          Sign In Again
        </Link>
      </div>
    );
  }

  if (status === "loading" || isLoading) {
    return <Loader text="Loading Panel..." />;
  }

  if (!intern) {
    return (
      <div className="min-h-screen bg-[#e0e5ec] flex flex-col gap-6 items-center justify-center font-bold text-xl text-slate-900 p-6 text-center">
        <div>Error loading profile or unauthorized.</div>
        <button 
          onClick={() => signOut()} 
          className="px-6 py-2 bg-slate-900 text-white font-bold tracking-widest uppercase rounded-xl text-sm border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // Fallbacks for display
  const displayIntern = {
    ...intern,
    level: currentLevel,
    age: 21,
    city: "Remote",
    bloodGroup: "O+",
    bio: intern.bio || "No biography provided yet.",
    photoUrl: intern.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(intern.name)}`
  };

  const upcomingProject = {
    title: intern.upcomingProjectTitle || "No Current Project",
    deadline: intern.upcomingProjectDate || "N/A",
    description: intern.upcomingProjectDesc || "No current project assigned yet."
  };

  // Dynamic borders based on Level
  let cardBorder = "border-amber-600 shadow-[0_0_25px_rgba(217,119,6,0.3)]"; // Bronze
  if (displayIntern.level >= 3 && displayIntern.level < 5) cardBorder = "border-black shadow-[0_0_25px_rgba(203,213,225,0.5)]"; // Silver
  if (displayIntern.level >= 5) cardBorder = "border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.7)]"; // Gold

  return (
    <> `n <main className="min-h-screen bg-[#e0e5ec] text-slate-900 font-sans selection:bg-[#00f2fe] selection:text-slate-900 relative overflow-hidden pb-20">
      
      <InteractivePixelGrid />

      {/* Background ambient glow - using cyan/blue for Intern view */}
      <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-[#00f2fe] rounded-full blur-[180px] opacity-[0.15] pointer-events-none"></div>

      <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto">
        
        {/* Top Header */}
        <header className="flex justify-between items-start mb-12 pointer-events-auto">
          <div className="flex items-center gap-4">
            <div className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-2 border-black p-4 rounded-xl backdrop-blur-md block">
              <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-900">BELVO</h1>
            </div>
            <span className="hidden md:inline-block bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-2 border-black px-4 py-2 rounded-xl text-sm font-bold tracking-widest uppercase text-slate-900">
              INTERN PORTAL
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block bg-white border-2 border-black px-6 py-2 rounded-xl text-sm font-bold tracking-widest uppercase shadow-[4px_4px_0_0_rgba(0,0,0,1)] cursor-default">
              MY WORKSPACE
            </div>
            
            <div className="relative">
              <div 
                className="w-12 h-12 bg-white border-2 border-black rounded-full overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)] cursor-pointer hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <img src={session?.user?.image || displayIntern.photoUrl || "https://i.pravatar.cc/150?img=68"} alt="Intern" className="w-full h-full object-cover" />
              </div>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-4 w-48 bg-white border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] rounded-xl overflow-hidden z-50 flex flex-col pointer-events-auto">
                  <div className="p-4 border-b-2 border-black bg-slate-50">
                    <p className="text-sm font-bold text-slate-900">{session?.user?.name || displayIntern.name || "Intern"}</p>
                    <p className="text-xs text-slate-500 font-medium mt-1 truncate">{session?.user?.email || "intern@belvo.com"}</p>
                  </div>
                  <button onClick={() => { setIsPasswordModalOpen(true); setIsProfileMenuOpen(false); }} className="text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-[#00f2fe] hover:text-slate-900 transition-colors border-b-2 border-slate-100">Change Password</button>
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

        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Welcome back, {displayIntern.name.split(' ')[0]}!</h1>
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
            
            {/* Identity Card Component */}
            <div className="perspective-1000 w-full h-[400px]">
              <div 
                className={`relative w-full h-full transition-transform duration-700 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* FRONT */}
                <div className={`absolute inset-0 backface-hidden bg-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] rounded-3xl p-6 flex flex-col items-center border-4 transition-colors duration-500 ${cardBorder}`}>
                  <div className="absolute top-4 right-6 opacity-30 text-xs tracking-widest font-bold">TAP TO FLIP</div>
                  
                  <div className={`w-28 h-28 rounded-full overflow-hidden border-4 bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${cardBorder} relative mt-2`}>
                    <img src={displayIntern.photoUrl} alt={displayIntern.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-900 mt-5">{displayIntern.name}</h2>
                  <p className="text-[#00f2fe] font-bold text-xs mt-1 uppercase tracking-widest text-center">{displayIntern.designation}</p>
                  
                  <div className="flex gap-6 mt-auto w-full justify-center border-t border-black pt-5">
                    <div className="text-center"><p className="text-[10px] text-slate-500 uppercase tracking-widest">Level</p><p className="font-semibold text-slate-900 mt-1 text-xl">{currentLevel}</p></div>
                    <div className="text-center"><p className="text-[10px] text-slate-500 uppercase tracking-widest">Dept</p><p className="font-semibold text-slate-900 mt-1 text-lg">{displayIntern.department?.substring(0,3).toUpperCase() || 'ENG'}</p></div>
                    <div className="text-center"><p className="text-[10px] text-slate-500 uppercase tracking-widest">Rating</p><p className="font-semibold text-[#00f2fe] mt-1 text-sm">{displayIntern.rating || '4.8'}</p></div>
                  </div>
                </div>

                {/* BACK */}
                <div className={`absolute inset-0 backface-hidden rotate-y-180 bg-[#0f172a] shadow-[6px_6px_0_0_rgba(0,0,0,1)] p-6 rounded-3xl flex flex-col items-center border-4 border-black text-white`}>
                  <div className="absolute top-4 right-6 opacity-30 text-xs tracking-widest font-bold">TAP TO FLIP</div>
                  <h3 className="text-lg font-bold mb-4 mt-2">Security QR</h3>
                  <div className="bg-white p-2 rounded-xl shadow-[4px_4px_0_0_rgba(255,255,255,0.2)]">
                    <QRCodeGenerator internId={displayIntern.id} name={displayIntern.name} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-5 max-w-[200px] text-center leading-relaxed">
                    This QR validates your active internship status at Belvo.
                  </p>
                  <p className="mt-auto text-[10px] tracking-widest text-slate-500 font-mono">ID: {displayIntern.idCardNumber || displayIntern.id.substring(0,8)}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-[#00f2fe] hover:text-slate-900 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all tracking-widest uppercase text-xs mt-2"
            >
              Edit Profile
            </button>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] backdrop-blur-xl border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-center">
                 <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Projects Done</p>
                 <p className="text-3xl font-bold text-slate-900">{displayIntern.projectsDone || 0}</p>
               </div>
               <div className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] backdrop-blur-xl border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-center">
                 <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Current Rating</p>
                 <p className="text-3xl font-bold text-blue-600">★ {displayIntern.rating || 'N/A'}</p>
               </div>
            </div>
            
            {/* Interactive Widget: Pomodoro Timer */}
            <PomodoroTimer />

          </div>

          {/* Right Column: Projects and Team */}
          <div className="w-full lg:w-7/12 flex flex-col gap-6">
            
            {/* Current Project */}
            <div className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] backdrop-blur-xl border-2 border-black p-8 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-[#00f2fe] to-transparent opacity-50"></div>
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                  Current Project
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

            {/* My Team & Kudos Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] backdrop-blur-xl border-2 border-black p-6 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex flex-col justify-center">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-2">My Team</h3>
                <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-6">Squad: {displayIntern.teamName || 'Engineering'}</p>

                <div className="flex flex-col gap-4">
                  {teamMembers.length > 0 ? teamMembers.map((member) => (
                    <Link href={`/intern-${member.id}`} key={member.id} className="flex items-center gap-4 bg-white border-2 border-black p-3 rounded-2xl hover:bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-colors cursor-pointer border border-transparent hover:border-black group">
                      <img src={member.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`} alt={member.name} className="w-12 h-12 rounded-full object-cover border-2 border-black group-hover:border-[#00f2fe] transition-colors" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#00f2fe] transition-colors">{member.name}</h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">{member.designation || 'Intern'}</p>
                      </div>
                    </Link>
                  )) : (
                    <p className="text-sm text-slate-500 italic py-4">You are currently the only intern in this squad!</p>
                  )}
                </div>
              </div>
              
              <KudosWidget teamMembers={teamMembers} />
              </div>

              {/* Admin Reviews Row */}
              {displayIntern.reviews && displayIntern.reviews.length > 0 && (
                <div className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-2 border-black p-6 rounded-xl mt-6">
                  <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-4">Admin Feedback</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayIntern.reviews.map((review: any) => (
                      <div key={review.id} className="bg-slate-50 border-2 border-black p-4 rounded-xl shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-100 px-2 py-1 border border-blue-200 rounded">{review.type}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{new Date(review.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-1 mb-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-5 h-5 ${i < review.rating ? "text-[#8A2BE2] fill-[#8A2BE2]" : "text-slate-300"}`} />
                          ))}
                        </div>
                        {review.comments && (
                          <p className="text-sm text-slate-700 italic border-l-2 border-[#00f2fe] pl-3 leading-relaxed">{review.comments}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}


            {/* Submit Daily Log */}
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] backdrop-blur-xl border-2 border-black p-8 rounded-xl relative overflow-hidden flex flex-col mt-2">
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-[#00f2fe] to-transparent opacity-50"></div>
              
              <div className="mb-4">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-1">Submit Today's Log</h3>
                <p className="text-xs text-slate-500">Your logs are sent directly to your HR manager.</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">What did you accomplish today?</label>
                  <textarea 
                    {...register("reportOfDay")}
                    className="w-full p-4 bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] rounded-xl border-2 border-black focus:bg-white focus:border-[#00f2fe] outline-none text-sm transition-all text-slate-900 placeholder-slate-400 custom-scrollbar resize-none"
                    rows={3} 
                    placeholder="Summarize your tasks and progress..."
                  />
                  {errors.reportOfDay && <p className="text-red-500 text-xs font-bold">{errors.reportOfDay.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Biggest Learning</label>
                    <input 
                      type="text"
                      {...register("learningOfDay")}
                      className="w-full p-3 bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] rounded-xl border-2 border-black focus:border-[#00f2fe] outline-none text-sm transition-all text-slate-900 placeholder-slate-400"
                      placeholder="e.g. React hooks..."
                    />
                    {errors.learningOfDay && <p className="text-red-500 text-xs font-bold">{errors.learningOfDay.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Meetings / Blockers</label>
                    <input 
                      type="text"
                      {...register("meetingOfDay")}
                      className="w-full p-3 bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] rounded-xl border-2 border-black focus:border-[#00f2fe] outline-none text-sm transition-all text-slate-900 placeholder-slate-400"
                      placeholder="e.g. Daily Standup"
                    />
                    {errors.meetingOfDay && <p className="text-red-500 text-xs font-bold">{errors.meetingOfDay.message}</p>}
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-[#00f2fe] hover:text-slate-900 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all disabled:opacity-50 tracking-widest uppercase text-xs mt-2"
                >
                  {isSubmitting ? "Submitting Log..." : "Submit Log & Claim XP"}
                </button>
              </div>
            </form>

          </div>

        </div>

      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black rounded-2xl p-8 max-w-lg w-full shadow-[8px_8px_0_0_rgba(0,0,0,1)] relative">
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-black font-bold text-xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Edit Profile</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-900 mb-2">Name</label>
                    <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full border-2 border-black rounded-xl p-3 focus:outline-none focus:border-[#00f2fe] shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900" placeholder="Your Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-900 mb-2">Intern ID</label>
                    <input type="text" value={editIdCard} onChange={e => setEditIdCard(e.target.value)} className="w-full border-2 border-black rounded-xl p-3 focus:outline-none focus:border-[#00f2fe] shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900" placeholder="ID Number" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-900 mb-2">Phone No.</label>
                    <input type="text" value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full border-2 border-black rounded-xl p-3 focus:outline-none focus:border-[#00f2fe] shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900" placeholder="Phone Number" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-900 mb-2">Address</label>
                    <input type="text" value={editAddress} onChange={e => setEditAddress(e.target.value)} className="w-full border-2 border-black rounded-xl p-3 focus:outline-none focus:border-[#00f2fe] shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900" placeholder="Address" />
                  </div>
                </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-900 mb-2">LinkedIn</label>
                  <input 
                    type="text"
                    value={editLinkedIn}
                    onChange={e => setEditLinkedIn(e.target.value)}
                    className="w-full border-2 border-black rounded-xl p-3 focus:outline-none focus:border-[#00f2fe] shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900"
                    placeholder="Username or URL"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-900 mb-2">Instagram</label>
                  <input 
                    type="text"
                    value={editInstagram}
                    onChange={e => setEditInstagram(e.target.value)}
                    className="w-full border-2 border-black rounded-xl p-3 focus:outline-none focus:border-[#00f2fe] shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900"
                    placeholder="Username or URL"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-900 mb-2">GitHub</label>
                <input 
                  type="text"
                  value={editGithub}
                  onChange={e => setEditGithub(e.target.value)}
                  className="w-full border-2 border-black rounded-xl p-3 focus:outline-none focus:border-[#00f2fe] shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900"
                  placeholder="Username or URL"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-[#00f2fe] text-black font-bold tracking-widest uppercase text-sm py-4 rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all mt-4"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

    </main>
      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
    </>
  );
}





