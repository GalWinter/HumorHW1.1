"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export default function UploadPage() {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    if (!file) {
      setStatus("Please select an image.");
      return;
    }

    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/login";
      return;
    }

    const ext = file.name.split(".").pop() || "png";
    const contentType = file.type || "application/octet-stream";

    const presignResponse = await fetch("/api/uploads/presign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ contentType, ext }),
    });

    if (!presignResponse.ok) {
      setStatus("Failed to get upload URL.");
      return;
    }

    const { uploadUrl, path } = await presignResponse.json();

    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      setStatus("Upload failed.");
      return;
    }

    const captionResponse = await fetch("/api/captions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ imagePath: path, caption }),
    });

    if (!captionResponse.ok) {
      setStatus("Failed to create caption.");
      return;
    }

    setCaption("");
    setFile(null);
    setStatus("Caption created.");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-6 py-16 text-black">
      <div className="text-3xl font-semibold">Upload Caption</div>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-4"
      >
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
        <input
          type="text"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          placeholder="Caption text"
          className="rounded border border-zinc-300 px-3 py-2"
        />
        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-white"
        >
          Create Caption
        </button>
      </form>
      {status ? <div className="text-sm text-zinc-600">{status}</div> : null}
    </main>
  );
}
