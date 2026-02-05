import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data, error } = await supabase.from("captions").select("*");
  const status = error ? "Supabase error" : "Supabase connected";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-6 py-16 text-black">
      <div className="text-4xl font-semibold">Hello World</div>
      <div className="text-base font-normal text-zinc-600">{status}</div>
      <div className="w-full max-w-3xl text-sm text-zinc-900">
        <ul className="space-y-3">
          {(data ?? []).map((row, index) => (
            <li
              key={row.id ?? `${row.caption ?? "row"}-${index}`}
              className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <pre className="whitespace-pre-wrap break-words">
                {JSON.stringify(row, null, 2)}
              </pre>
            </li>
          ))}
        </ul>
        {data && data.length === 0 ? (
          <div className="mt-4 text-zinc-500">No rows found.</div>
        ) : null}
      </div>
    </main>
  );
}
