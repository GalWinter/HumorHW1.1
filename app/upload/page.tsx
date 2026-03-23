import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle";
import UploadForm from "./UploadForm";

export const dynamic = "force-dynamic";

export default async function UploadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
          <div className="topbar-left"><h1>Caption Studio</h1></div>
          <div className="topbar-actions">
            <Link href="/captions" className="nav-btn">
              <i className="bi bi-chat-square-quote" />
              <span>Vote</span>
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
          <h2>Upload an image and generate multiple captions</h2>
          <p>
            Everything is still the same flow, now in a cleaner studio layout for{" "}
            {user?.user_metadata?.full_name || user?.email || "you"}.
          </p>
        </header>

        <div className="content-container">
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <div className="glass-card">
              <div className="card-body">
                <UploadForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
