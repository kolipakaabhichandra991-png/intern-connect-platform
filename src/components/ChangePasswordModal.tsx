"use client";
import React, { useState } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export default function ChangePasswordModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully!");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white border-4 border-black rounded-3xl p-6 md:p-8 max-w-md w-full shadow-[8px_8px_0_0_rgba(0,0,0,1)] relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-black font-bold uppercase text-sm tracking-widest"
        >
          Close
        </button>
        <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 mb-6">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold uppercase tracking-widest mb-1 text-slate-900">New Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border-2 border-black rounded-xl p-3 focus:outline-none shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase tracking-widest mb-1 text-slate-900">Confirm Password</label>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full border-2 border-black rounded-xl p-3 focus:outline-none shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-slate-900 focus:border-blue-500"
            />
          </div>
          <button 
            disabled={isLoading}
            type="submit"
            className="w-full mt-4 bg-black text-white font-bold py-3 rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
