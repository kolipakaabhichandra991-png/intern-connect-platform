"use client";
import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, Float, MeshTransmissionMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';
import Link from 'next/link';
import InteractivePixelGrid from '@/components/game/InteractivePixelGrid';

const internsData = [
  { id: 1, dept: 'engineering' },
  { id: 2, dept: 'design' },
  { id: 3, dept: 'marketing' },
  { id: 4, dept: 'engineering' },
  { id: 5, dept: 'design' },
  { id: 6, dept: 'engineering' },
];

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
export default function Dashboard() {
  const [filter, setFilter] = useState('all');

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#e0e5ec] text-slate-900 font-sans selection:bg-[#8A2BE2] selection:text-slate-900">
      
      {/* Interactive Background */}
      <InteractivePixelGrid />
      
      {/* Fallback ambient glow since 3D is removed */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#8A2BE2] rounded-full blur-[150px] opacity-[0.15] pointer-events-none"></div>

      <div className="absolute inset-0 z-10 flex flex-col justify-between pointer-events-none p-6 md:p-10">
        
        <header className="flex justify-between items-center pointer-events-auto">
          <div className="text-3xl font-serif tracking-widest font-bold">
            <span className="text-slate-900">BEL</span>
            <span className="text-[#8A2BE2]">VO</span>
          </div>
          <nav className="hidden md:flex gap-8 items-center text-sm font-medium text-slate-600">
            <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Directory</Link>
            <Link href="/reports" className="hover:text-slate-900 transition-colors">Reports</Link>
            <Link href="/analytics" className="hover:text-slate-900 transition-colors">Analytics</Link>
            <Link href="/intern-panel" className="bg-[#8A2BE2]/10 border border-[#8A2BE2]/40 px-5 py-2.5 rounded-full text-slate-900 shadow-[0_0_15px_rgba(138,43,226,0.3)] hover:shadow-[0_0_25px_rgba(138,43,226,0.6)] hover:bg-[#8A2BE2]/20 transition-all backdrop-blur-md">
              Intern Portal
            </Link>
          </nav>
        </header>

        <div className="flex-1 flex flex-col md:flex-row items-end justify-between mt-10 gap-8">
          
          <div className="pointer-events-auto w-full md:w-1/2 lg:w-1/3 mb-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6 text-slate-900 drop-shadow-[4px_4px_0_rgba(0,0,0,0.1)]">
              INTERN <br/> CONNECT <br/> PLATFORM
            </h1>
            
            <div className="relative inline-block mt-2 group">
              <select 
                onChange={(e) => setFilter(e.target.value)}
                value={filter}
                className="appearance-none bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-2 border-black backdrop-blur-xl text-slate-900 py-3.5 pl-6 pr-14 rounded-2xl focus:outline-none focus:border-[#8A2BE2] transition-colors cursor-pointer shadow-[4px_4px_0_0_rgba(0,0,0,1)] shadow-black/20 font-medium"
              >
                <option value="all" className="bg-[#ffffff]">All Departments</option>
                <option value="engineering" className="bg-[#ffffff]">Engineering</option>
                <option value="design" className="bg-[#ffffff]">Design</option>
                <option value="marketing" className="bg-[#ffffff]">Marketing</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#8A2BE2] group-hover:translate-y[-40%] transition-transform">
                ▼
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
                {internsData.filter(i => filter === 'all' || i.dept === filter).map((intern) => (
                  <Link href={`/intern-${intern.id}`} key={intern.id} className="flex-shrink-0 w-14 h-14 rounded-full border-2 border-[#8A2BE2]/30 p-0.5 overflow-hidden hover:border-[#8A2BE2] transition-colors cursor-pointer group bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                    <img src={`https://i.pravatar.cc/150?img=${intern.id + 12}`} alt="avatar" className="w-full h-full rounded-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" />
                  </Link>
                ))}
                {internsData.filter(i => filter === 'all' || i.dept === filter).length === 0 && (
                  <p className="text-sm text-slate-400 italic py-2">No interns in this department.</p>
                )}
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <h3 className="text-xs uppercase tracking-widest text-slate-500 font-medium">Daily Logs Activity</h3>
              <div className="h-28 flex items-end justify-between gap-2 px-1">
                {[40, 70, 45, 90, 60, 100, 30].map((h, i) => (
                  <div key={i} className="w-full bg-gradient-to-t from-[#8A2BE2]/10 to-[#8A2BE2]/40 rounded-t-md relative group cursor-pointer hover:to-[#8A2BE2]/80 transition-colors border-t border-[#8A2BE2]/30" style={{ height: `${h}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#e0e5ec] border border-[#8A2BE2]/50 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                      {h} Logs
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between px-2 text-[10px] text-slate-400 uppercase font-bold mt-1">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
              </div>
            </div>

            <div className="space-y-3 flex-1 min-h-[150px] relative z-10">
              <h3 className="text-xs uppercase tracking-widest text-slate-500 font-medium">Feedback Feed</h3>
              <div className="space-y-3">
                {[
                  { name: "Sarah J.", text: "Incredible attention to detail in the latest UI sprint." },
                  { name: "Michael T.", text: "Great communication during the daily standups. Proactive." }
                ].map((review, i) => (
                  <div key={i} className="bg-black/30 p-4 rounded-2xl border-2 border-black hover:border-[#8A2BE2]/30 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-200 group-hover:text-slate-900">{review.name}</span>
                      <div className="flex text-[#8A2BE2] text-xs gap-0.5">★★★★★</div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
      
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
  );
}
