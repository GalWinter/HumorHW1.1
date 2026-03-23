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
    <main>
      <nav className="app-navbar">
        <div className="container">
          <Link href="/" className="nav-brand">
            <i className="bi bi-stars" />
            Humor Hub Remix
          </Link>
          <div className="nav-actions">
            <Link href="/" className="nav-btn">
              <i className="bi bi-house" />
              <span>Home</span>
            </Link>
            <Link href="/captions" className="nav-btn">
              <i className="bi bi-chat-square-quote" />
              <span>Rate</span>
            </Link>
            <ThemeToggle />
            <div className="nav-user">
              {user?.user_metadata?.avatar_url && (
                <img src={user.user_metadata.avatar_url} alt="Profile" />
              )}
              <span className="nav-user-name">
                {user?.user_metadata?.full_name || user?.email}
              </span>
            </div>
            <form action="/auth/signout" method="post">
              <button type="submit" className="nav-btn">
                <i className="bi bi-box-arrow-right" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-icon">
          <i className="bi bi-image" />
        </div>
        <h1 className="hero-title">Generate Captions</h1>
        <p className="hero-subtitle">Upload an image and generate fresh captions.</p>
      </section>

      <div className="content-container">
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <div className="glass-card">
            <div className="card-body">
              <UploadForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
