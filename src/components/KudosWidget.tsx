import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function KudosWidget({ teamMembers }: { teamMembers: any[] }) {
  const [kudos, setKudos] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/kudos').then(res => res.json()).then(data => {
      if (!data.error) setKudos(data);
    });
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverId || !message) return toast.error("Select a teammate and write a message!");

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/kudos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, receiverId })
      });
      if (res.ok) {
        const newKudo = await res.json();
        setKudos([newKudo, ...kudos]);
        setMessage('');
        setReceiverId('');
        toast.success("Kudo sent! +10 Good Karma");
      }
    } catch (e) {
      toast.error("Failed to send kudo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] backdrop-blur-xl border-2 border-black p-6 rounded-xl flex flex-col gap-6 w-full h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          ?? Team Kudos
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[250px] custom-scrollbar pr-2 flex flex-col gap-3">
        {kudos.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No kudos yet. Be the first!</p>
        ) : (
          kudos.map(k => (
            <div key={k.id} className="bg-purple-50 border-2 border-black rounded-lg p-3 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              <p className="text-xs font-bold text-purple-700 mb-1">
                {k.sender?.email?.split('@')[0]} ? {k.receiver?.email?.split('@')[0]}
              </p>
              <p className="text-sm text-slate-900">{k.message}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSend} className="mt-auto border-t-2 border-black pt-4 flex flex-col gap-3">
        <select 
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          className="w-full border-2 border-black rounded-lg p-2 text-sm focus:outline-none shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
        >
          <option value="">Select a teammate...</option>
          {teamMembers.map(m => (
            <option key={m.userId} value={m.userId}>{m.name}</option>
          ))}
        </select>
        
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="You are awesome because..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border-2 border-black rounded-lg p-2 text-sm focus:outline-none shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
          />
          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-purple-600 text-white font-bold px-4 rounded-lg border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-y-px hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] disabled:opacity-50 transition-all"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
