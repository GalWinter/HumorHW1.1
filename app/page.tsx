import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export const dynamic = "force-dynamic";

type HumorTheme = {
  id: number;
  created_datetime_utc: string;
  name: string;
  description: string | null;
};

const humorIcons: Record<string, string> = {
  sarcasm: "bi-emoji-wink",
  satire: "bi-newspaper",
  parody: "bi-film",
  irony: "bi-arrow-repeat",
  slapstick: "bi-person-arms-up",
  wit: "bi-lightbulb",
  pun: "bi-chat-quote",
  dark: "bi-moon-stars",
  absurd: "bi-question-diamond",
  observational: "bi-eye",
  "self-deprecating": "bi-emoji-smile-upside-down",
  deadpan: "bi-emoji-expressionless",
  default: "bi-emoji-laughing",
};

const humorImages: Record<string, string> = {
  columbia:
    "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=220&fit=crop",
  barnard:
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=220&fit=crop",
  brainrot:
    "https://images.unsplash.com/photo-1585559700398-1385b3a8aeb6?w=400&h=220&fit=crop",
  current:
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=220&fit=crop",
  "new york":
    "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=220&fit=crop",
  original:
    "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=400&h=220&fit=crop",
  personalities:
    "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=400&h=220&fit=crop",
  default:
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=220&fit=crop",
};

function getIconForTheme(themeName: string): string {
  const lowerName = themeName.toLowerCase();
  for (const [key, icon] of Object.entries(humorIcons)) {
    if (lowerName.includes(key)) return icon;
  }
  return humorIcons.default;
}

function getImageForTheme(themeName: string): string {
  const lowerName = themeName.toLowerCase();
  for (const [key, image] of Object.entries(humorImages)) {
    if (key !== "default" && lowerName.includes(key)) return image;
  }
  return humorImages.default;
}

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: themes, error } = await supabase
    .from("humor_themes")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return (
      <main>
        <section className="hero-section">
          <div className="hero-icon">
            <i className="bi bi-exclamation-triangle" />
          </div>
          <h1 className="hero-title">Error Loading Themes</h1>
          <p className="hero-subtitle">{error.message}</p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <nav className="app-navbar">
        <div className="container">
          <Link href="/" className="nav-brand">
            <i className="bi bi-tree-fill" />
            Giggle Garden
          </Link>
          <div className="nav-actions">
            <Link href="/upload" className="nav-btn">
              <i className="bi bi-cloud-upload" />
              <span>Upload</span>
            </Link>
            <Link href="/captions" className="nav-btn">
              <i className="bi bi-chat-square-quote" />
              <span>Vote</span>
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
                <span>Exit</span>
              </button>
            </form>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-icon">
          <i className="bi bi-flower1" />
        </div>
        <h1 className="hero-title">Comedy Garden</h1>
        <p className="hero-subtitle">
          Welcome back, {user?.user_metadata?.full_name?.split(" ")[0] || "friend"}.
          Pick a mood and grow some hilarious captions.
        </p>
      </section>

      <div className="content-container">
        {!!themes?.length && (
          <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <span className="theme-badge">
              <i className="bi bi-collection" />
              {themes.length} Mood Pods
            </span>
            <span className="theme-badge">
              <i className="bi bi-tree" />
              Green Mode
            </span>
          </div>
        )}
        <div className="grid grid-3">
          {themes?.map((theme: HumorTheme) => (
            <Link key={theme.id} href="/captions" className="theme-card-link">
              <div className="theme-card">
                <div className="card-image">
                  <img src={getImageForTheme(theme.name)} alt={theme.name} />
                </div>
                <div className="card-body">
                  <h2 className="card-title">{theme.name}</h2>
                  {theme.description && <p className="card-description">{theme.description}</p>}
                  <div className="card-meta">
                    <i className={`bi ${getIconForTheme(theme.name)}`} />
                    <span>
                      {new Date(theme.created_datetime_utc).toLocaleDateString("en-US")}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="rating-cloud">
        <Link href="/captions">
          <i className="bi bi-star-fill" />
          Start Laughing
        </Link>
      </div>
    </main>
  );
}
