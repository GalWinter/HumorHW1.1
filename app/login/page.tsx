"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const handleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <main className="login-container">
      <div className="login-card">
        <div className="hero-icon" style={{ marginBottom: "1.2rem" }}>
          <i className="bi bi-stars" />
        </div>
        <h2 className="login-title">Welcome to Humor Hub Remix</h2>
        <p className="login-subtitle">Sign in to upload and rate captions.</p>
        <button type="button" onClick={handleLogin} className="google-btn">
          <i className="bi bi-google" />
          Continue with Google
        </button>
      </div>
    </main>
  );
}
