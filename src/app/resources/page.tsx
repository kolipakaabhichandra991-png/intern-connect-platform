'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ResourceHub() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user && (session.user as any).role === 'ADMIN';

  const [resources, setResources] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('General');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") return;

    fetch('/api/resources').then(res => res.json()).then(data => {
      if (!data.error) setResources(data);
    });
  }, [status]);

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, url, category })
      });
      if (res.ok) {
        const newResource = await res.json();
        setResources([newResource, ...resources]);
        setTitle('');
        setDescription('');
        setUrl('');
        toast.success("Resource added!");
      } else {
        toast.error("Failed to add resource");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#e0e5ec] flex flex-col gap-6 items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4 font-serif">"An investment in knowledge pays the best interest."</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest mb-8">- Benjamin Franklin</p>
        <Link 
          href="/login" 
          className="px-8 py-3 bg-[#00f2fe] text-slate-900 font-bold tracking-widest uppercase rounded-xl text-sm border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all"
        >
          Sign In Again
        </Link>
      </div>
    );
  }

  if (status === "loading") {
    return <div className="min-h-screen bg-[#e0e5ec] flex items-center justify-center font-bold text-xl">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-[#e0e5ec] p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-2">Resource Hub ??</h1>
            <p className="text-slate-500">Your central library for onboarding, tools, and guides.</p>
          </div>
          <Link 
            href={isAdmin ? "/dashboard" : "/intern-panel"}
            className="bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] px-6 py-2 rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-slate-50 hover:translate-y-1 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all"
          >
            Back Home
          </Link>
        </header>

        {/* Admin Add Form */}
        {isAdmin && (
          <form onSubmit={handleAddResource} className="bg-white border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-900">Add New Resource (Admin Only)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Title" required value={title} onChange={e => setTitle(e.target.value)} className="border-2 border-black p-3 rounded-xl focus:outline-none shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900 placeholder:text-slate-400" />
              <input type="url" placeholder="URL (https://...)" required value={url} onChange={e => setUrl(e.target.value)} className="border-2 border-black p-3 rounded-xl focus:outline-none shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900 placeholder:text-slate-400" />
              <input type="text" placeholder="Description" required value={description} onChange={e => setDescription(e.target.value)} className="border-2 border-black p-3 rounded-xl focus:outline-none shadow-[2px_2px_0_0_rgba(0,0,0,1)] md:col-span-2 text-slate-900 placeholder:text-slate-400" />
            </div>
            <button disabled={isSubmitting} className="bg-[#00f2fe] text-black font-bold py-3 rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all uppercase tracking-widest text-sm self-end px-8">
              {isSubmitting ? "Adding..." : "Add Resource"}
            </button>
          </form>
        )}

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.length === 0 ? (
            <p className="text-slate-500 italic">No resources added yet.</p>
          ) : (
            resources.map(r => (
              <a 
                href={r.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                key={r.id} 
                className="bg-white border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-y-1 transition-all rounded-2xl p-6 flex flex-col h-full"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-2">{r.category}</span>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{r.title}</h3>
                <p className="text-sm text-slate-600 mb-6 flex-1">{r.description}</p>
                <div className="flex items-center text-sm font-bold text-slate-900 uppercase tracking-widest mt-auto">
                  Open Link 
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </div>
              </a>
            ))
          )}
        </div>

      </div>
    </main>
  );
}
