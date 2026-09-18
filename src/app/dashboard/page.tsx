"use client";
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, Float, MeshTransmissionMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';
import Link from 'next/link';
import { signOut, useSession } from '@/lib/supabase/useSession';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import InteractivePixelGrid from '@/components/game/InteractivePixelGrid';
import QRScanner from '@/components/qrcode/QRScanner';





// 1. Abstract Flowing "B" Logo
function AbstractLogo() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} scale={1.8}>
        <torusKnotGeometry args={[1, 0.3, 256, 64, 2, 3]} />
        <MeshTransmissionMaterial 
          backside
          samples={4}
          thickness={0.5}
          chromaticAberration={0.8}
          anisotropy={0.3}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.1}
          color="#8A2BE2"
          transmission={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </Float>
  );
}

// 2. Background Floating Geometric Shapes
function FloatingShapes() {
  const shapes = useMemo(() => {
    return Array.from({ length: 15 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 - 8
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
      scale: Math.random() * 0.4 + 0.1,
      type: Math.random() > 0.5 ? 'icosahedron' : 'octahedron'
    }));
  }, []);

  return (
    <>
      {shapes.map((props, i) => (
        <Float key={i} speed={1.5} rotationIntensity={2} floatIntensity={2}>
          <mesh position={props.position} rotation={props.rotation} scale={props.scale}>
            {props.type === 'icosahedron' ? <icosahedronGeometry args={[1, 0]} /> : <octahedronGeometry args={[1, 0]} />}
            <meshStandardMaterial color="#4c1d95" wireframe transparent opacity={0.3} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

// 3. The 3D Canvas Assembly
function ThreeScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <color attach="background" args={['#050510']} />
        
        <ambientLight intensity={0.4} color="#8A2BE2" />
        <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={2} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#8A2BE2" />

        <AbstractLogo />
        <FloatingShapes />
        
        <Sparkles count={300} scale={15} size={2} speed={0.4} opacity={0.4} color="#e9d5ff" noise={0.2} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
          maxPolarAngle={Math.PI / 2 + 0.3} 
          minPolarAngle={Math.PI / 2 - 0.3} 
        />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

// UI OVERLAY COMPONENT
export default function AdminDashboard() {
  const { data: session, status } = useSession();

  const router = useRouter();
  useEffect(() => {
    if (session?.user && (session.user as any).role === "INTERN") {
      router.push("/intern-panel");
    }
  }, [session, router]);

  const [filter, setFilter] = useState('all');
  const [isScanning, setIsScanning] = useState(false);
  const [interns, setInterns] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Multiple selection for bulk team updates
  const [isTeamUpModalOpen, setIsTeamUpModalOpen] = useState(false);
  const [selectedInternIds, setSelectedInternIds] = useState<Set<string>>(new Set());
  const [newTeamName, setNewTeamName] = useState("");
  const [isSubmittingTeam, setIsSubmittingTeam] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") return;
    
    Promise.all([
      fetch("/api/interns").then(res => res.json()),
      fetch("/api/logs").then(res => res.json()),
        fetch("/api/reviews").then(res => res.json())
    ]).then(([internData, logsData, reviewsData]) => {
      if (Array.isArray(internData)) setInterns(internData);
      if (Array.isArray(logsData)) setLogs(logsData);
        if (Array.isArray(reviewsData)) setReviews(reviewsData);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, [status]);


  const weeklyChartData = useMemo(() => {
    const days = ["M", "T", "W", "T", "F", "S", "S"];
    const counts = [0, 0, 0, 0, 0, 0, 0];
    
    const now = new Date();
    const dayOfWeek = now.getDay() || 7;
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - dayOfWeek + 1);

    logs.forEach((log: any) => {
      const logDate = new Date(log.createdAt);
      if (logDate >= startOfWeek) {
        const logDay = logDate.getDay() || 7;
        counts[logDay - 1] += 1;
      }
    });

    return days.map((day, i) => ({
      day,
      logs: counts[i]
    }));
  }, [logs]);
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#e0e5ec] flex flex-col gap-6 items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4 font-serif">"Leadership is the capacity to translate vision into reality."</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest mb-8">- Warren Bennis</p>
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
    return <div className="min-h-screen bg-[#e0e5ec] flex items-center justify-center font-bold text-xl">Loading...</div>;
  }

  // Filter interns
  const filteredInterns = interns.filter(i => {
    if (filter === 'all') return true;
    if (filter === 'tech') return i.department === 'Engineering' || i.department === 'Tech';
    if (filter === 'design') return i.department === 'Design';
    if (filter === 'marketing') return i.department === 'Marketing';
    return true;
  });

  // Calculate some stats
  const totalXP = interns.reduce((sum, i) => sum + (i.xp || 0), 0);
  const avgXP = interns.length ? Math.round(totalXP / interns.length) : 0;

  
  const handleToggleInternSelection = (id: string) => {
    const newSet = new Set(selectedInternIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedInternIds(newSet);
  };

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || selectedInternIds.size === 0) return;
    
    setIsSubmittingTeam(true);
    try {
      await Promise.all(
        Array.from(selectedInternIds).map(id =>
          fetch(`/api/interns/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ teamName: newTeamName })
          })
        )
      );
      
      const res = await fetch('/api/interns');
      const data = await res.json();
      if (Array.isArray(data)) setInterns(data);
      
      setIsTeamUpModalOpen(false);
      setSelectedInternIds(new Set());
      setNewTeamName("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingTeam(false);
    }
  };

  return (
    <><main className="relative w-full h-screen overflow-hidden bg-[#e0e5ec] text-slate-900 font-sans selection:bg-[#8A2BE2] selection:text-white">
      
      {/* Interactive Background */}
      <InteractivePixelGrid />
      
      {isScanning && <QRScanner onClose={() => setIsScanning(false)} />}
      
      {/* Fallback ambient glow since 3D is removed */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#8A2BE2] rounded-full blur-[150px] opacity-[0.15] pointer-events-none"></div>

      <div className="absolute inset-0 z-10 flex flex-col justify-between pointer-events-none p-6 md:p-10">
        
        {/* Top Header */}
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-2 border-black p-4 rounded-xl backdrop-blur-md">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-900">BELVO</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsTeamUpModalOpen(true)}
              className="bg-white border-2 border-black px-6 py-2 rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-[#00f2fe] hover:text-slate-900 transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]"
            >
              TEAM UP
            </button>
            <Link href="/reports" className="bg-white border-2 border-black px-6 py-2 rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-[#8A2BE2] hover:text-white transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] block">
              REPORTS
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
                  <button onClick={() => { setIsPasswordModalOpen(true); setIsProfileMenuOpen(false); }} className="text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-[#8A2BE2] hover:text-white transition-colors border-b-2 border-slate-100">Change Password</button>
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
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 h-full pb-4">
          
          <div className="pointer-events-auto flex flex-col gap-4">
            <h1 className="text-4xl md:text-5xl font-bold font-serif leading-[1.1] tracking-tight mb-2 text-slate-900">
              INTERN <br/> CONNECT <br/> PLATFORM
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Link 
                href="/dashboard/add-intern"
                className="bg-white border-2 border-black text-slate-900 px-6 h-14 rounded-2xl flex items-center justify-center hover:bg-[#8A2BE2] hover:text-white transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] font-bold tracking-widest uppercase text-sm"
              >
                + Add Intern
              </Link>
              <button 
                onClick={() => setIsScanning(true)}
                className="bg-white border-2 border-black text-slate-900 w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-[#8A2BE2] hover:text-white transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] group"
                title="Scan Intern ID"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h3m2 7a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1h6a1 1 0 011 1v2m0 0H9" /></svg>
              </button>
              <div className="relative inline-block group">
                <select 
                  onChange={(e) => setFilter(e.target.value)}
                  value={filter}
                  className="appearance-none bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-2 border-black backdrop-blur-xl text-slate-900 py-3.5 pl-6 pr-14 rounded-2xl focus:outline-none focus:border-[#8A2BE2] transition-colors cursor-pointer font-medium h-14"
                >
                  <option value="all" className="bg-[#ffffff]">All Departments</option>
                  <option value="engineering" className="bg-[#ffffff]">Engineering</option>
                  <option value="design" className="bg-[#ffffff]">Design</option>
                  <option value="marketing" className="bg-[#ffffff]">Marketing</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#8A2BE2] group-hover:translate-y-[2px] transition-transform">&#9660;</div>
              </div>
            </div>
          </div>

          <aside className="pointer-events-auto w-full md:w-[420px] bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] backdrop-blur-2xl border-2 border-black rounded-xl p-7 shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex flex-col gap-8 max-h-[80vh] overflow-y-auto custom-scrollbar relative overflow-hidden">
            
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#8A2BE2] rounded-full blur-[80px] opacity-[0.25] pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-black pb-4 relative z-10">
              <h2 className="text-xl font-semibold tracking-wide text-slate-900/90">Intern Profile MOM</h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-[#8A2BE2] font-bold">Live</span>
                <div className="h-2 w-2 rounded-full bg-[#8A2BE2] animate-pulse shadow-[0_0_10px_#8A2BE2]"></div>
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <h3 className="text-xs uppercase tracking-widest text-slate-500 font-medium">Intern Dossiers</h3>
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {isLoading ? (
                  <p className="text-sm text-slate-400 italic py-2">Loading interns...</p>
                ) : filteredInterns.map((intern) => (
                  <Link href={`/intern-${intern.id}`} key={intern.id} title={intern.name} className="flex-shrink-0 w-14 h-14 rounded-full border-2 border-[#8A2BE2]/30 p-0.5 overflow-hidden hover:border-[#8A2BE2] transition-colors cursor-pointer group bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                    <img src={intern.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(intern.name)}`} alt={intern.name} className="w-full h-full rounded-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" />
                  </Link>
                ))}
                {!isLoading && filteredInterns.length === 0 && (
                  <p className="text-sm text-slate-400 italic py-2">No interns in this department.</p>
                )}
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <h3 className="text-xs uppercase tracking-widest text-slate-500 font-medium">Daily Logs Activity</h3>
              <div className="h-32 w-full relative -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyChartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} 
                      dy={5} 
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} allowDecimals={false} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(138, 43, 226, 0.1)' }}
                      contentStyle={{ borderRadius: '8px', border: '2px solid #000', boxShadow: '4px 4px 0 0 rgba(0,0,0,1)', fontWeight: 'bold', fontSize: '12px', padding: '4px 8px' }}
                      itemStyle={{ color: '#8A2BE2' }}
                    />
                    <Bar dataKey="logs" radius={[4, 4, 0, 0]}>
                      {weeklyChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="url(#colorUv)" />
                      ))}
                    </Bar>
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8A2BE2" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8A2BE2" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-3 flex-1 min-h-[150px] relative z-10">
              <h3 className="text-xs uppercase tracking-widest text-slate-500 font-medium">Feedback Feed</h3>
              <div className="space-y-3">
                {reviews.length > 0 ? reviews.map((review, i) => (
                  <div key={review.id || i} className="bg-black/30 p-4 rounded-2xl border-2 border-black hover:border-[#8A2BE2]/30 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-200 group-hover:text-slate-900">{review.name} &rarr; {review.targetName}</span>
                      <div className="flex text-[#8A2BE2] text-xs gap-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <span key={idx} className={idx < review.rating ? "opacity-100" : "opacity-30"}>&#9733;</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{review.text}</p>
                  </div>
                )) : (
                  <p className="text-xs text-slate-400 italic">No feedback yet.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {isTeamUpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm pointer-events-auto">
          <div className="bg-white border-4 border-black p-6 rounded-3xl w-full max-w-lg shadow-[8px_8px_0_0_rgba(0,0,0,1)] max-h-[90vh] flex flex-col">
            <h2 className="text-2xl font-bold uppercase tracking-tight text-slate-900 mb-6">Team Up Interns</h2>
            
            <form onSubmit={handleSaveTeam} className="flex flex-col flex-1 overflow-hidden">
              <div className="mb-4">
                <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">Squad Name</label>
                <input 
                  type="text" 
                  required
                  value={newTeamName}
                  onChange={e => setNewTeamName(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-black rounded-xl p-3 text-sm focus:outline-none focus:border-[#8A2BE2] shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-colors"
                  placeholder="e.g. Next-Gen Frontend"
                />
              </div>

              <label className="block text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">Select Interns</label>
              <div className="flex-1 overflow-y-auto custom-scrollbar border-2 border-black rounded-xl bg-slate-50 p-2 mb-6">
                {interns.length > 0 ? interns.map(intern => (
                  <div 
                    key={intern.id} 
                    onClick={() => handleToggleInternSelection(intern.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg mb-2 cursor-pointer transition-colors border-2 ${
                      selectedInternIds.has(intern.id) ? 'bg-[#00f2fe]/10 border-[#00f2fe]' : 'bg-white border-transparent hover:border-black/10'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selectedInternIds.has(intern.id) ? 'border-[#00f2fe] bg-[#00f2fe]' : 'border-slate-300 bg-white'}`}>
                      {selectedInternIds.has(intern.id) && (
                        <svg className="w-3 h-3 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      )}
                    </div>
                    <img src={intern.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(intern.name)}`} alt={intern.name} className="w-8 h-8 rounded-full object-cover border border-slate-300" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">{intern.name}</p>
                      <p className="text-[10px] uppercase tracking-widest text-slate-500">{intern.teamName || 'Unassigned'}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-sm text-slate-500 p-4">No interns found.</p>
                )}
              </div>

              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsTeamUpModalOpen(false)}
                  className="flex-1 py-3 border-2 border-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmittingTeam || selectedInternIds.size === 0 || !newTeamName.trim()}
                  className="flex-1 py-3 bg-[#00f2fe] border-2 border-black rounded-xl font-bold uppercase tracking-widest text-xs shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmittingTeam ? 'Saving...' : 'Confirm Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(138, 43, 226, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(138, 43, 226, 0.6);
        }
      `}} />
    </main>
      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
    </>
  );
}














