import { getSupabaseClient } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function vote(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const captionId = formData.get("caption_id");

  if (!captionId) {
    return;
  }

  await supabase.from("caption_votes").insert({
    caption_id: captionId,
    profile_id: session.user.id,
    vote_value: 1,
  });

  redirect("/");
}

export default async function Home() {
  const supabase = getSupabaseClient();
  const { data, error } = supabase
    ? await supabase.from("captions").select("*")
    : { data: null, error: null };
  const status = !supabase
    ? "Missing Supabase env vars"
    : error
      ? "Supabase error"
      : "Supabase connected";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-6 py-16 text-black">
      <div className="text-4xl font-semibold">Captions</div>
      <div className="text-base font-normal text-zinc-600">{status}</div>
      <div className="w-full max-w-3xl text-sm text-zinc-900">
        <ul className="space-y-3">
          {(data ?? []).map((row, index) => {
            const rowId =
              typeof row.id === "number" || typeof row.id === "string"
                ? String(row.id)
                : "";

            const captionText =
              typeof row.caption === "string"
                ? row.caption
                : typeof row.content === "string"
                  ? row.content
                  : typeof row.text === "string"
                    ? row.text
                    : rowId || "Untitled caption";

            return (
              <li
                key={row.id ?? `${row.caption ?? "row"}-${index}`}
                className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-base text-zinc-900">{captionText}</p>
                  <form action={vote}>
                    <input type="hidden" name="caption_id" value={row.id} />
                    <button type="submit">👍</button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
        {data && data.length === 0 ? (
          <div className="mt-4 text-zinc-500">No rows found.</div>
        ) : null}
      </div>
    </main>
  );
}
