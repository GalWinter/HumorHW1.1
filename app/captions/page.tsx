import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle";
import VoteButtons from "./VoteButtons";

export const dynamic = "force-dynamic";

type Caption = {
  id: string;
  content: string;
  created_datetime_utc: string;
  like_count: number;
};

export default async function CaptionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user?.id)
    .single();

  let votedCaptionIds: string[] = [];
  if (profile) {
    const { data: votes } = await supabase
      .from("caption_votes")
      .select("caption_id")
      .eq("profile_id", profile.id);

    votedCaptionIds = votes?.map((vote) => vote.caption_id) || [];
  }

  let query = supabase
    .from("captions")
    .select("id, content, created_datetime_utc, like_count")
    .eq("is_public", true)
    .order("created_datetime_utc", { ascending: false })
    .limit(20);

  if (votedCaptionIds.length > 0) {
    query = query.not("id", "in", `(${votedCaptionIds.join(",")})`);
  }

  const { data: captions, error } = await query;

  return (
    <main className="product-shell">
      <aside className="sidebar">
        <Link href="/" className="nav-brand sidebar-brand">
          <i className="bi bi-tree-fill" />
          Giggle Garden
        </Link>
        <p className="sidebar-label">Pages</p>
        <div className="sidebar-list">
          <Link href="/" className="sidebar-item"><i className="bi bi-house" /><span>Home</span></Link>
          <Link href="/upload" className="sidebar-item"><i className="bi bi-cloud-upload" /><span>Upload</span></Link>
          <Link href="/captions" className="sidebar-item"><i className="bi bi-chat-square-quote" /><span>Vote</span></Link>
        </div>
      </aside>

      <section className="main-pane">
        <nav className="topbar">
          <div className="topbar-left"><h1>Caption Voting</h1></div>
          <div className="topbar-actions">
            <Link href="/upload" className="nav-btn">
              <i className="bi bi-cloud-upload" />
              <span>Upload</span>
            </Link>
            <Link href="/" className="nav-btn">
              <i className="bi bi-house" />
              <span>Home</span>
            </Link>
            <ThemeToggle />
            <form action="/auth/signout" method="post">
              <button type="submit" className="nav-btn">
                <i className="bi bi-box-arrow-right" />
                <span>Exit</span>
              </button>
            </form>
          </div>
        </nav>

        <header className="content-head">
          <h2>Vote on the best generated captions</h2>
          <p>Each card is shown once so you can quickly rank and move on.</p>
        </header>

        <div className="content-container">
        {error && <div className="alert-error">{error.message}</div>}

        <div className="grid grid-2">
          {captions?.map((caption: Caption) => (
            <div key={caption.id} className="theme-card">
              <div className="card-body" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ flex: 1 }}>
                  <p className="caption-text">&ldquo;{caption.content}&rdquo;</p>
                  <div className="caption-meta">
                    <span>
                      <i className="bi bi-heart-fill" style={{ color: "var(--danger)", marginRight: "0.3rem" }} />
                      {caption.like_count} likes
                    </span>
                    <span>{new Date(caption.created_datetime_utc).toLocaleDateString("en-US")}</span>
                  </div>
                </div>
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.75rem", marginTop: "0.75rem" }}>
                  <VoteButtons captionId={caption.id} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {(!captions || captions.length === 0) && !error && (
          <div className="empty-state">
            <h3 className="empty-title">
              {votedCaptionIds.length > 0 ? "All Done!" : "No Captions Yet"}
            </h3>
            <p className="empty-text">
              {votedCaptionIds.length > 0
                ? "You have already voted on all available captions."
                : "Public captions will appear here once they are added."}
            </p>
          </div>
        )}
        </div>
      </section>
    </main>
  );
}
