import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const storageBucket = process.env.SUPABASE_STORAGE_BUCKET || "captions";

export async function POST(request: Request) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: "Missing Supabase env vars." },
      { status: 500 },
    );
  }

  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { contentType, ext } = await request.json();

  if (!contentType || !ext) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
  const { data, error } = await supabase.storage
    .from(storageBucket)
    .createSignedUploadUrl(path);

  if (error || !data?.signedUrl) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to create signed upload URL" },
      { status: 500 },
    );
  }

  return NextResponse.json({ uploadUrl: data.signedUrl, path });
}
