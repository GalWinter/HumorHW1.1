"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const handleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <button
        type="button"
        onClick={handleLogin}
        className="rounded-lg border border-zinc-300 bg-black px-5 py-3 text-base font-semibold text-white"
      >
        Continue with Google
      </button>
    </main>
  );
}
