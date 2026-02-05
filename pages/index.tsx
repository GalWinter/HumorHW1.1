import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { getSupabaseClient } from "@/lib/supabase";

type PageProps = {
  rows: Record<string, unknown>[];
  status: string;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      props: {
        rows: [],
        status: "Missing Supabase env vars",
      },
    };
  }

  const { data, error } = await supabase.from("captions").select("*");

  return {
    props: {
      rows: data ?? [],
      status: error ? "Supabase error" : "Supabase connected",
    },
  };
};

export default function Home({
  rows,
  status,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-6 py-16 text-black">
      <div className="text-4xl font-semibold">Captions</div>
      <div className="text-base font-normal text-zinc-600">{status}</div>
      <div className="w-full max-w-3xl text-sm text-zinc-900">
        <ul className="space-y-3">
          {rows.map((row, index) => (
            <li
              key={`${row.id ?? "row"}-${index}`}
              className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <pre className="whitespace-pre-wrap break-words">
                {JSON.stringify(row, null, 2)}
              </pre>
            </li>
          ))}
        </ul>
        {rows.length === 0 ? (
          <div className="mt-4 text-zinc-500">No rows found.</div>
        ) : null}
      </div>
    </main>
  );
}
