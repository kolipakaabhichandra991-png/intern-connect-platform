
"use client";
import { useEffect, useState } from 'react';
import { createClient } from './client';

export function useSession() {
  const [session, setSession] = useState<any>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    
    async function initSession() {
      const { data: { session: authSession } } = await supabase.auth.getSession();
      
      if (authSession) {
        // Fetch role from Prisma
        try {
          const res = await fetch('/api/me');
          if (res.ok) {
            const data = await res.json();
            if (isMounted) {
              setSession({ user: { email: authSession.user.email, id: authSession.user.id, role: data.role } });
              setStatus("authenticated");
            }
            return;
          }
        } catch (e) {}
        
        if (isMounted) {
          setSession({ user: { email: authSession.user.email, id: authSession.user.id } });
          setStatus("authenticated");
        }
      } else {
        if (isMounted) setStatus("unauthenticated");
      }
    }
    
    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, authSession) => {
      if (authSession) {
        initSession();
      } else {
        setSession(null);
        setStatus("unauthenticated");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return { data: session, status };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  window.location.href = '/login';
}
