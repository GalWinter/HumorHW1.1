import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import SignOutButton from "./sign-out-button";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-black">
      <div className="text-3xl font-semibold">Logged in</div>
      <div className="text-base text-zinc-700">
        {user?.email ?? "Unknown user"}
      </div>
      <SignOutButton />
    </main>
  );
}
