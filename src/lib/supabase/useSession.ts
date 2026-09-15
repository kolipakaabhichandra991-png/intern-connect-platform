"use client";
import { useEffect, useState } from 'react';
import { createClient } from './client';

export function useSession() {
  const [session, setSession] = useState<any>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession({ user: { email: session.user.email, id: session.user.id } });
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession({ user: { email: session.user.email, id: session.user.id } });
        setStatus("authenticated");
      } else {
        setSession(null);
        setStatus("unauthenticated");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return { data: session, status };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  window.location.href = '/login';
}
