import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════ */
const GH_USER = "ahmetysfd";

const LINKS = {
  github: `https://github.com/${GH_USER}`,
  linkedin: "https://www.linkedin.com/in/ahmet-yusuf-demirel-562aba318/",
  appStore: "https://apps.apple.com/app/id6765663533",
  appSite: "https://posturefix-website.vercel.app/",
  email: "mailto:ahmetysfd2002@gmail.com",
};

const LINKEDIN_NAME = "Ahmet Yusuf Demirel";

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
  const [data, setData] = useState({ status: "loading", profile: null });
  useEffect(() => {
    let alive = true;
    fetch(`https://api.github.com/users/${user}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((profile) => { if (alive) setData({ status: "ready", profile }); })
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

function GithubMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}

function LinkedInMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
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
            <a href="#connect">Connect</a>
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
   CONNECT
   ═══════════════════════════════════════════════════ */
function SocialCard({ href, icon, brand, title, meta, accent, delay }) {
  return (
    <Reveal delay={delay} className="social-wrap">
      <a
        className="social"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ "--accent": accent }}
      >
        <span className="social__sheen" aria-hidden="true" />
        <div className="social__row">
          <span className="social__icon">{icon}</span>
          <span className="social__arrow" aria-hidden="true">↗</span>
        </div>
        <div className="social__body">
          <span className="social__brand">{brand}</span>
          <span className="social__title">{title}</span>
        </div>
        <span className="social__meta">{meta}</span>
      </a>
    </Reveal>
  );
}

function Connect() {
  const gh = useGitHub(GH_USER);
  const ghMeta =
    gh.status === "ready"
      ? `${gh.profile.public_repos} repositories · ${gh.profile.followers} follower${gh.profile.followers === 1 ? "" : "s"}`
      : gh.status === "error"
      ? "Code, experiments & projects"
      : "Loading…";

  return (
    <section id="connect" className="section">
      <div className="wrap">
        <Reveal><SectionLabel index="02">Connect</SectionLabel></Reveal>
        <div className="social-grid">
          <SocialCard
            href={LINKS.github}
            icon={<GithubMark />}
            brand="GitHub"
            title={`@${GH_USER}`}
            meta={ghMeta}
            accent="#8957e5"
            delay={0.05}
          />
          <SocialCard
            href={LINKS.linkedin}
            icon={<LinkedInMark />}
            brand="LinkedIn"
            title={LINKEDIN_NAME}
            meta="Let's connect professionally"
            accent="#0a66c2"
            delay={0.12}
          />
        </div>
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

      {/* ── HERO + iOS APP ── */}
      <header id="app" className="hero">
        <div className="hero__bg" aria-hidden="true">
          <span className="hero__blob hero__blob--1" />
          <span className="hero__blob hero__blob--2" />
          <span className="hero__grid-lines" />
        </div>

        <div className="wrap hero__grid">
          <div className="hero__copy">
            <Reveal>
              <div className="eyebrow">
                <span className="dot" /> Available for work — Developer &amp; Designer
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="hero__title">
                I design and build{" "}
                <span className="hero__accent">digital products.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="hero__sub">
                Creator of PostureFix — an AI posture-analysis app live on the
                App Store. I work across iOS and the web with a focus on clean,
                considered interfaces.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="appcard">
                <img className="appcard__icon" src="/images/posturefix-icon.png" alt="PostureFix app icon" />
                <div className="appcard__info">
                  <div className="appcard__name">
                    {APP.name}
                    <span className="ver"><span className="ver__dot" /> v{APP.version} · Live</span>
                  </div>
                  <div className="appcard__meta">{APP.meta}</div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <div className="hero__cta">
                <a className="btn btn--solid" href={LINKS.appStore} target="_blank" rel="noopener noreferrer">
                  <AppleMark /> App Store
                </a>
                <a className="btn btn--ghost" href={LINKS.appSite} target="_blank" rel="noopener noreferrer">
                  Visit website ↗
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.14} className="hero__visual">
            <PhoneSlideshow shots={APP.shots} />
          </Reveal>
        </div>
      </header>

      {/* ── CONNECT ── */}
      <Connect />

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
                <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
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
