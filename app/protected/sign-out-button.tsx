"use client";

import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium"
    >
      Sign out
    </button>
  );
}
