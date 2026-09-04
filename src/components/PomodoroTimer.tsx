"use client";
import React, { useState, useEffect } from 'react';

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Automatically switch modes
      if (mode === 'work') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('work');
        setTimeLeft(25 * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] backdrop-blur-xl border-2 border-black rounded-2xl p-6 relative overflow-hidden mt-6">
      {/* Background decorations */}
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[40px] opacity-30 ${mode === 'work' ? 'bg-[#00f2fe]' : 'bg-[#10b981]'}`}></div>
      
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h3 className="text-sm uppercase tracking-widest text-slate-900 font-bold">Focus Timer</h3>
        <div className="flex bg-slate-100 rounded-md p-1 border-2 border-black">
          <button 
            onClick={() => switchMode('work')}
            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded ${mode === 'work' ? 'bg-black text-white' : 'text-slate-500 hover:text-black'}`}
          >
            Work
          </button>
          <button 
            onClick={() => switchMode('break')}
            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded ${mode === 'break' ? 'bg-[#10b981] text-black border border-black' : 'text-slate-500 hover:text-black'}`}
          >
            Break
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-4 relative z-10">
        <div className={`text-6xl font-black font-mono tracking-tighter mb-6 ${mode === 'work' ? 'text-slate-900' : 'text-[#10b981]'}`}>
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
        
        <div className="flex gap-4 w-full">
          <button 
            onClick={toggleTimer}
            className={`flex-1 py-3 border-2 border-black rounded-xl font-bold uppercase tracking-widest text-xs transition-transform hover:-translate-y-1 ${isActive ? 'bg-red-400 text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]' : 'bg-[#00f2fe] text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]'}`}
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button 
            onClick={resetTimer}
            className="w-12 h-12 flex items-center justify-center border-2 border-black rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1"
          >
            <svg className="w-5 h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
