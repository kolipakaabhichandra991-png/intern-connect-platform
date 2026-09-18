"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ConfirmPage() {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const establishSession = async () => {
      try {
        // Parse the URL to see if Supabase returned an error
        const urlParams = new URLSearchParams(window.location.search);
        const urlError = urlParams.get("error");
        const urlErrorDesc = urlParams.get("error_description");
        
        if (urlError) {
          if (mounted) setError(`Supabase Error: ${urlError} - ${urlErrorDesc}`);
          return;
        }

        // Manually parse the hash fragment for access_token and refresh_token
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken && refreshToken) {
          // Manually establish the session
          const { error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (setSessionError) {
            if (mounted) setError(`Set Session Error: ${setSessionError.message}`);
            return;
          }
        }

        // Wait a tiny bit for cookies to propagate
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          if (mounted) setError(`Failed to establish session. Hash: ${window.location.hash ? "Present" : "Missing"}`);
          return;
        }

        // Check role
        try {
          const res = await fetch("/api/me");
          if (res.ok) {
            const userData = await res.json();
            if (mounted) {
              if (userData.role === "ADMIN") {
                router.push("/dashboard");
              } else {
                router.push("/intern-panel");
              }
            }
          } else {
            if (mounted) {
              if (session?.user?.email === "abhichandra.belvo@gmail.com") {
                router.push("/dashboard");
              } else {
                router.push("/intern-panel");
              }
            }
          }
        } catch (err) {
          if (mounted) router.push("/dashboard");
        }
      } catch (err: any) {
        if (mounted) setError(`Unexpected error: ${err.message}`);
      }
    };
    
    establishSession();

    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  return (
    <div className="min-h-screen bg-[#e0e5ec] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] text-center">
        <h1 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-4">
          Authenticating...
        </h1>
        {error ? (
          <p className="text-red-500 font-bold break-words">{error}</p>
        ) : (
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-black mx-auto"></div>
        )}
      </div>
    </div>
  );
}
