import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { error } = await supabase.auth.getSession();
  const status = error ? "Supabase error" : "Supabase connected";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white text-4xl font-semibold text-black">
      <div>Hello World</div>
      <div className="text-base font-normal text-zinc-600">{status}</div>
    </main>
  );
}
