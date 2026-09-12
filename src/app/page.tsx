"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Brain, Trophy, BookOpen, Shield } from 'lucide-react';

const MiniGame = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const checkWinner = (squares: any[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = checkWinner(board);
  const isDraw = !winner && board.every(Boolean);

  const handleClick = (i: number) => {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col items-center rotate-2 w-full max-w-sm mx-auto">
      <div className="flex justify-between w-full items-center mb-6">
        <h3 className="font-black text-xl uppercase tracking-widest">Tic Tac Toe</h3>
        <span className="font-black text-lg bg-[#00f2fe] px-3 py-1 border-2 border-black">
          {winner ? `WINNER: ${winner}` : isDraw ? 'DRAW!' : `NEXT: ${xIsNext ? 'X' : 'O'}`}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-6 w-full aspect-square">
        {board.map((cell, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: cell || winner ? 1 : 0.9 }}
            onClick={() => handleClick(i)}
            disabled={!!cell || !!winner}
            className={`border-4 border-black flex items-center justify-center text-5xl font-black transition-colors ${
              cell === 'X' ? 'bg-[#8A2BE2] text-white' : 
              cell === 'O' ? 'bg-[#ffdb00] text-black' : 
              'bg-slate-100 hover:bg-slate-200 cursor-pointer'
            }`}
          >
            {cell && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                {cell}
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      <button onClick={resetGame} className="w-full bg-black text-white font-black uppercase tracking-widest py-3 border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all hover:bg-[#00f2fe] hover:text-black">
        {winner || isDraw ? 'Play Again' : 'Reset Game'}
      </button>
    </div>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#e0e5ec] font-sans selection:bg-[#8A2BE2] selection:text-white overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="w-full p-6 flex justify-between items-center relative z-50">
        <div className="text-3xl font-serif tracking-widest font-black border-2 border-black bg-white px-4 py-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] rotate-[-2deg]">
          <span className="text-slate-900">BEL</span>
          <span className="text-[#8A2BE2]">VO</span>
        </div>
        <Link 
          href="/login" 
          className="bg-[#00f2fe] text-black font-bold uppercase tracking-widest px-6 py-3 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-12 pb-32 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* Floating background shapes */}
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-[45%] w-24 h-24 bg-[#00f2fe] border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] -z-10 hidden md:block"
        />
        <motion.div 
          animate={{ rotate: -360, y: [0, 20, 0] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-10 right-[5%] w-32 h-32 bg-[#8A2BE2] rounded-full border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] -z-10 hidden md:block"
        />

        {/* Left Column - Text */}
        <div className="flex-1 text-left z-10">
          <motion.h1 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
            className="text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-black leading-[1.1] mb-6"
          >
            The Ultimate <br/> 
            <span className="bg-[#8A2BE2] text-white px-4 pb-2 border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] inline-block -rotate-2 my-2">Internship</span> <br/>
            Experience.
          </motion.h1>

          <motion.p 
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-700 font-medium max-w-2xl mb-12"
          >
            Elevate your career with AI-driven insights, gamified progress, and seamless team collaboration.
          </motion.p>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a 
              href="#join"
              className="group relative inline-flex items-center justify-center gap-4 bg-white text-black font-black uppercase tracking-widest text-xl px-12 py-5 border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:bg-[#ffdb00] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all"
            >
              Get Started <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </a>
          </motion.div>
        </div>

        {/* Right Column - Mini Game */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex-1 w-full flex justify-center lg:justify-end z-10"
        >
          <MiniGame />
        </motion.div>
      </main>

      {/* Marquee */}
      <div className="w-full bg-black text-[#00f2fe] border-y-4 border-black overflow-hidden py-4 rotate-1 scale-105 z-20 relative shadow-2xl">
        <div className="flex whitespace-nowrap animate-marquee font-black text-3xl uppercase tracking-widest">
          <span className="mx-8">? LEARN & GROW</span>
          <span className="mx-8">?? SHIP CODE</span>
          <span className="mx-8">?? EARN KUDOS</span>
          <span className="mx-8">?? AI SUMMARIES</span>
          <span className="mx-8">? LEARN & GROW</span>
          <span className="mx-8">?? SHIP CODE</span>
          <span className="mx-8">?? EARN KUDOS</span>
          <span className="mx-8">?? AI SUMMARIES</span>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter border-b-8 border-black inline-block pb-4">
            Supercharged Features
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              color: 'bg-[#8A2BE2]',
              textColor: 'text-white',
              title: 'AI Summaries',
              desc: 'Let our AI summarize your daily logs into actionable performance insights and feedback.'
            },
            {
              icon: Trophy,
              color: 'bg-[#ffdb00]',
              textColor: 'text-black',
              title: 'Gamification',
              desc: 'Earn XP, level up, and send Kudos to teammates for a fun, engaging work culture.'
            },
            {
              icon: BookOpen,
              color: 'bg-[#00f2fe]',
              textColor: 'text-black',
              title: 'Resource Hub',
              desc: 'Access curated company resources, guidelines, and documentation in one central spot.'
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className={`${feature.color} ${feature.textColor} border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-8 flex flex-col items-center text-center`}
            >
              <div className="bg-white text-black p-4 border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] mb-6 rotate-3">
                <feature.icon className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-wider mb-4">{feature.title}</h3>
              <p className="font-medium text-lg leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Login Portal Selection */}
      <section id="join" className="py-24 px-6 bg-black text-white border-t-4 border-black relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-[#00f2fe]">
              Choose Your Portal
            </h2>
            <p className="text-xl text-slate-400 font-medium">Select your role to enter the workspace.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-center">
            
            <Link href="/login?role=intern" className="flex-1 group text-left">
              <div className="h-full bg-white text-black border-4 border-black p-10 flex flex-col items-center text-center transition-all hover:bg-[#00f2fe] shadow-[8px_8px_0_0_rgba(0,242,254,1)]">
                <div className="w-24 h-24 bg-black text-white border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform -rotate-6">
                  <Zap className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black uppercase mb-3">Intern Portal</h2>
                <p className="text-lg font-medium text-slate-700 mb-8 group-hover:text-black">
                  Submit daily logs, view your upcoming projects, and see your team.
                </p>
                <div className="mt-auto w-full py-4 border-4 border-black bg-black text-[#00f2fe] font-black tracking-widest uppercase text-lg group-hover:bg-white group-hover:text-black transition-colors">
                  Enter Portal
                </div>
              </div>
            </Link>

            <Link href="/login?role=admin" className="flex-1 group text-left">
              <div className="h-full bg-white text-black border-4 border-black p-10 flex flex-col items-center text-center transition-all hover:bg-[#8A2BE2] shadow-[8px_8px_0_0_rgba(138,43,226,1)] group-hover:text-white">
                <div className="w-24 h-24 bg-black text-white border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform rotate-6">
                  <Shield className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black uppercase mb-3">Admin Dashboard</h2>
                <p className="text-lg font-medium text-slate-700 mb-8 group-hover:text-white">
                  Access the directory, monitor performance, and review daily logs.
                </p>
                <div className="mt-auto w-full py-4 border-4 border-black bg-black text-[#8A2BE2] font-black tracking-widest uppercase text-lg group-hover:bg-white group-hover:text-black transition-colors">
                  Enter Workspace
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>
      
      <footer className="bg-black text-white text-center py-6 border-t border-slate-800 font-medium">
        <p>� 2026 Belvo. Built with ??</p>
      </footer>
    </div>
  );
}
