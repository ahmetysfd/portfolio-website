import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════ */
const GH_USER = "ahmetysfd";

const LINKS = {
  github: `https://github.com/${GH_USER}`,
  appStore: "https://apps.apple.com/app/id6765663533",
  appSite: "https://posturefix-website.vercel.app/",
  email: "mailto:ahmetysfd2002@gmail.com",
};

const APP = {
  name: "PostureFix",
  version: "2.1.2",
  meta: "Health & Fitness · iOS 15+ · Free",
  description:
    "An AI posture coach for iPhone. Scan your posture from a single photo to detect risks like forward head, rounded shoulders and pelvic tilt — then follow a personalized daily program to fix them.",
  shots: [
    { src: "/images/posturefix-01.png", alt: "AI posture analysis flagging risks" },
    { src: "/images/posturefix-02.png", alt: "Take a photo to analyze your posture" },
    { src: "/images/posturefix-03.png", alt: "Personalized daily program" },
    { src: "/images/posturefix-04.png", alt: "Guided exercises and video tutorials" },
    { src: "/images/posturefix-05.png", alt: "Smart reminders and weekly schedule" },
  ],
};

const LANG_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
  Swift: "#F05138", HTML: "#e34c26", CSS: "#563d7c", SCSS: "#c6538c",
  "Jupyter Notebook": "#DA5B0B", Java: "#b07219", Kotlin: "#A97BFF",
  "C++": "#f34b7d", C: "#555555", Go: "#00ADD8", Dart: "#00B4AB",
  Vue: "#41b883", PHP: "#4F5D95", Ruby: "#701516", Shell: "#89e051",
};
const langColor = (l) => LANG_COLORS[l] || "#9aa0a6";

function relTime(iso) {
  const days = (Date.now() - new Date(iso).getTime()) / 86400000;
  if (days < 1) return "today";
  if (days < 2) return "yesterday";
  if (days < 30) return `${Math.floor(days)} days ago`;
  if (days < 365) { const m = Math.floor(days / 30); return `${m} month${m > 1 ? "s" : ""} ago`; }
  const y = Math.floor(days / 365); return `${y} year${y > 1 ? "s" : ""} ago`;
}

/* ═══════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════ */
function useInView() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.14 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

function useTheme() {
  const [theme, setTheme] = useState(
    () => (typeof document !== "undefined" && document.documentElement.getAttribute("data-theme")) || "light"
  );
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch { /* ignore */ }
  }, [theme]);
  return [theme, () => setTheme((t) => (t === "dark" ? "light" : "dark"))];
}

function useGitHub(user) {
  const [data, setData] = useState({ status: "loading", profile: null, repos: [] });
  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch(`https://api.github.com/users/${user}`).then((r) => (r.ok ? r.json() : Promise.reject())),
      fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`).then((r) => (r.ok ? r.json() : Promise.reject())),
    ])
      .then(([profile, repos]) => {
        if (!alive) return;
        const top = repos
          .filter((r) => !r.fork)
          .sort((a, b) =>
            b.stargazers_count - a.stargazers_count ||
            new Date(b.pushed_at) - new Date(a.pushed_at))
          .slice(0, 4);
        setData({ status: "ready", profile, repos: top });
      })
      .catch(() => { if (alive) setData((d) => ({ ...d, status: "error" })); });
    return () => { alive = false; };
  }, [user]);
  return data;
}

/* ═══════════════════════════════════════════════════
   PRIMITIVES
   ═══════════════════════════════════════════════════ */
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, vis] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(22px)",
        transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${delay}s, transform .7s cubic-bezier(.16,1,.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ index, children }) {
  return (
    <div className="label">
      <span className="label__idx">{index}</span>
      <span>{children}</span>
    </div>
  );
}

function PhoneSlideshow({ shots, interval = 2800 }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((p) => (p + 1) % shots.length), interval);
    return () => clearInterval(t);
  }, [paused, shots.length, interval]);
  return (
    <div
      className="slideshow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="phone">
        <div className="phone__frame">
          <span className="phone__island" />
          <div className="slideshow__viewport">
            <div className="slideshow__track" style={{ transform: `translateX(-${i * 100}%)` }}>
              {shots.map((s) => (
                <img key={s.src} src={s.src} alt={s.alt} loading="lazy" draggable="false" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="dots">
        {shots.map((s, k) => (
          <button
            key={s.src}
            className={`dot-btn ${k === i ? "is-active" : ""}`}
            onClick={() => setI(k)}
            aria-label={`Show screen ${k + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M15.13 3.15c.88-1.06 1.48-2.53 1.32-4.01-1.28.05-2.82.86-3.74 1.93-.82.95-1.54 2.47-1.35 3.92 1.43.11 2.89-.73 3.77-1.84Zm3.18 9.54c.03 3.17 2.79 4.23 2.82 4.24-.02.07-.44 1.51-1.45 3-.87 1.29-1.78 2.58-3.2 2.61-1.4.03-1.85-.83-3.46-.83-1.61 0-2.11.81-3.43.86-1.37.05-2.42-1.37-3.3-2.65-1.8-2.6-3.17-7.36-1.33-10.55.91-1.58 2.53-2.58 4.29-2.61 1.34-.03 2.61.91 3.46.91.84 0 2.42-1.13 4.08-.96.69.03 2.63.28 3.88 2.1-.1.06-2.32 1.35-2.36 3.88Z" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   NAV
   ═══════════════════════════════════════════════════ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, toggleTheme] = useTheme();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav className={`nav ${scrolled ? "nav--solid" : ""}`}>
      <div className="nav__inner wrap">
        <a className="brand" href="#top">Ahmet<span>.</span></a>
        <div className="nav__right">
          <div className="nav__links">
            <a href="#app">App</a>
            <a href="#github">GitHub</a>
            <a href="#contact">Contact</a>
          </div>
          <button
            className="theme-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title="Toggle theme"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════
   GITHUB
   ═══════════════════════════════════════════════════ */
function RepoCard({ repo }) {
  return (
    <a className="repo" href={repo.html_url} target="_blank" rel="noopener noreferrer">
      <div className="repo__top">
        <span className="repo__name">{repo.name}</span>
        <span className="repo__arrow">↗</span>
      </div>
      <p className="repo__desc">{repo.description || "—"}</p>
      <div className="repo__meta">
        {repo.language && (
          <span className="repo__lang">
            <span className="lang-dot" style={{ background: langColor(repo.language) }} />
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && <span>★ {repo.stargazers_count}</span>}
        <span>Updated {relTime(repo.pushed_at)}</span>
      </div>
    </a>
  );
}

function GitHub() {
  const gh = useGitHub(GH_USER);
  return (
    <section id="github" className="section">
      <div className="wrap">
        <Reveal><SectionLabel index="02">GitHub</SectionLabel></Reveal>
        <Reveal delay={0.05}>
          <div className="gh">
            <div className="gh__head">
              <img className="gh__avatar" src={`https://github.com/${GH_USER}.png?size=160`} alt={`${GH_USER} on GitHub`} />
              <div className="gh__id">
                <div className="gh__name">@{GH_USER}</div>
                <div className="gh__sub">
                  {gh.status === "ready"
                    ? `${gh.profile.public_repos} repositories · ${gh.profile.followers} follower${gh.profile.followers === 1 ? "" : "s"}`
                    : "Code, experiments & projects"}
                </div>
              </div>
              <a className="btn btn--ghost gh__view" href={LINKS.github} target="_blank" rel="noopener noreferrer">
                View profile ↗
              </a>
            </div>

            <figure className="gh__chart">
              <img
                src={`https://ghchart.rshah.org/216e39/${GH_USER}`}
                alt={`${GH_USER}'s GitHub contribution graph`}
                loading="lazy"
                onError={(e) => { e.currentTarget.closest(".gh__chart").style.display = "none"; }}
              />
              <figcaption>Contributions over the last year</figcaption>
            </figure>

            <div className="gh__repos">
              {gh.status === "ready" && gh.repos.map((r) => <RepoCard key={r.id} repo={r} />)}
              {gh.status === "loading" && [0, 1, 2, 3].map((i) => <div key={i} className="repo repo--skel" />)}
              {gh.status === "error" && (
                <a className="repo repo--cta" href={LINKS.github} target="_blank" rel="noopener noreferrer">
                  Explore all repositories on GitHub →
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════ */
export default function App() {
  return (
    <div id="top">
      <Nav />

      {/* ── HERO ── */}
      <header className="hero">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow">
              <span className="dot" /> Available for work — Developer &amp; Designer
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="hero__title">
              I design and build<br />digital products.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="hero__sub">
              Creator of PostureFix, an AI posture-analysis app live on the App
              Store. I work across iOS and the web with a focus on clean,
              considered interfaces.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="hero__cta">
              <a className="btn btn--solid" href="#app">View PostureFix</a>
              <a className="btn btn--ghost" href={LINKS.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ── APP ── */}
      <section id="app" className="section">
        <div className="wrap">
          <Reveal><SectionLabel index="01">iOS App</SectionLabel></Reveal>
          <div className="app">
            <Reveal className="app__info">
              <div className="app__head">
                <img className="app__icon" src="/images/posturefix-icon.png" alt="PostureFix app icon" />
                <div>
                  <h2 className="app__name">{APP.name}</h2>
                  <div className="app__tags">
                    <span className="ver"><span className="ver__dot" /> v{APP.version} · Live</span>
                    <span className="app__meta">{APP.meta}</span>
                  </div>
                </div>
              </div>
              <p className="app__desc">{APP.description}</p>
              <div className="app__cta">
                <a className="btn btn--solid" href={LINKS.appStore} target="_blank" rel="noopener noreferrer">
                  <AppleMark /> App Store
                </a>
                <a className="btn btn--ghost" href={LINKS.appSite} target="_blank" rel="noopener noreferrer">
                  Visit website ↗
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="app__shots">
              <PhoneSlideshow shots={APP.shots} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── GITHUB ── */}
      <GitHub />

      {/* ── FOOTER ── */}
      <footer id="contact" className="footer">
        <div className="wrap">
          <Reveal>
            <div className="footer__top">
              <div>
                <SectionLabel index="03">Contact</SectionLabel>
                <a className="footer__mail" href={LINKS.email}>ahmetysfd2002@gmail.com</a>
              </div>
              <div className="footer__links">
                <a href={LINKS.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
                <a href={LINKS.appStore} target="_blank" rel="noopener noreferrer">App Store ↗</a>
              </div>
            </div>
          </Reveal>
          <div className="footer__base">
            <span>© {new Date().getFullYear()} Ahmet</span>
            <span>Designed &amp; built by Ahmet</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
