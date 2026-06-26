import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════ */
const LINKS = {
  github: "https://github.com/ahmetysfd",
  appStore:
    "https://apps.apple.com/app/posturefix-analyze-with-ai/id6765663533",
  appSite: "https://posturefix-website.vercel.app/",
  email: "mailto:ahmetysfd2002@gmail.com",
};

/* Flagship iOS app */
const APP = {
  name: "PostureFix",
  version: "2.1.2",
  tagline: "Better posture, backed by AI.",
  category: "Health & Fitness",
  platform: "iOS 15+",
  price: "Free",
  description:
    "An AI posture coach for iPhone. Scan your posture from a single photo and PostureFix detects risks like forward head, rounded shoulders and pelvic tilt — then builds a personalized daily program of guided exercises to fix them.",
  features: [
    "AI posture scan",
    "Personalized daily program",
    "Guided step-by-step exercises",
    "Smart reminders & weekly schedule",
  ],
  shots: [
    { src: "/images/posturefix-01.png", alt: "AI posture analysis flagging risks" },
    { src: "/images/posturefix-02.png", alt: "Take a photo, analyze your posture" },
    { src: "/images/posturefix-03.png", alt: "Personalized daily program" },
    { src: "/images/posturefix-04.png", alt: "Guided exercises and video tutorials" },
    { src: "/images/posturefix-05.png", alt: "Smart reminders and weekly schedule" },
  ],
};

/* Secondary web work */
const PROJECTS = [
  {
    title: "Movie Library",
    subtitle: "Film & TV collection tracker",
    description:
      "A personal movie and TV library with rich poster grids, genre filtering, watch stats and a visual analytics dashboard.",
    tags: ["React", "REST API", "Data Viz"],
    image: "/images/movie-lib.png",
    href: LINKS.github,
    domain: "movielibrary.app",
  },
  {
    title: "Onboard",
    subtitle: "Product landing page",
    description:
      "A clean, conversion-focused product website with smooth scroll interactions and bold typography, designed end-to-end.",
    tags: ["Web Design", "UI/UX", "Figma"],
    image: "/images/onboard.png",
    href: "https://user-notch-43691001.figma.site/",
    domain: "onboard.site",
  },
];

const SOCIALS = [
  { label: "GitHub", href: LINKS.github },
  { label: "App Store", href: LINKS.appStore },
  { label: "Email", href: LINKS.email },
];

const SKILLS = [
  "JavaScript / TypeScript",
  "React / Next.js",
  "Swift / iOS",
  "Python",
  "Node.js",
  "UI/UX Design",
  "REST APIs",
  "Git & DevOps",
];

/* ═══════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════ */
function useInView(opts = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.12, ...opts }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function useMouse() {
  const pos = useRef({ x: 0.5, y: 0.5 });
  const [, forceRender] = useState(0);
  useEffect(() => {
    let raf;
    const target = { x: 0.5, y: 0.5 };
    const onMove = (e) => {
      target.x = e.clientX / window.innerWidth;
      target.y = e.clientY / window.innerHeight;
    };
    const tick = () => {
      pos.current.x += (target.x - pos.current.x) * 0.06;
      pos.current.y += (target.y - pos.current.y) * 0.06;
      forceRender((n) => n + 1);
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return pos.current;
}

/* ═══════════════════════════════════════════════════
   PRIMITIVES
   ═══════════════════════════════════════════════════ */
function Reveal({ children, delay = 0, className = "", style = {} }) {
  const [ref, vis] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(28px)",
        transition: `opacity .8s cubic-bezier(.16,1,.3,1) ${delay}s, transform .8s cubic-bezier(.16,1,.3,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children, style = {} }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(11px,1.1vw,13px)", fontWeight: 500,
        letterSpacing: ".14em", textTransform: "uppercase",
        color: "var(--fg-muted)", ...style,
      }}
    >
      {children}
    </div>
  );
}

function Grain() {
  return (
    <div
      style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9000, opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat", backgroundSize: 180,
      }}
    />
  );
}

function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const [hov, setHov] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer:coarse)").matches) return;
    const mv = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; if (!show) setShow(true); };
    const ov = (e) => { if (e.target.closest("a,button,.hov")) setHov(true); };
    const ou = (e) => { if (e.target.closest("a,button,.hov")) setHov(false); };
    window.addEventListener("mousemove", mv);
    document.addEventListener("mouseover", ov);
    document.addEventListener("mouseout", ou);
    document.addEventListener("mouseleave", () => setShow(false));
    document.addEventListener("mouseenter", () => setShow(true));
    let raf;
    const loop = () => {
      dotPos.current.x += (mouse.current.x - dotPos.current.x) * 0.35;
      dotPos.current.y += (mouse.current.y - dotPos.current.y) * 0.35;
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.11;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.11;
      if (dotRef.current) dotRef.current.style.transform = `translate(${dotPos.current.x - 4}px,${dotPos.current.y - 4}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px,${ringPos.current.y - 20}px) scale(${hov ? 1.9 : 1})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", mv); };
  }, [hov, show]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer:coarse)").matches) return null;
  const base = { position: "fixed", top: 0, left: 0, borderRadius: "50%", pointerEvents: "none", mixBlendMode: "difference" };
  return (
    <>
      <div ref={dotRef} style={{ ...base, width: 8, height: 8, background: "var(--accent)", zIndex: 99999, opacity: show ? 1 : 0, transition: "opacity .3s" }} />
      <div ref={ringRef} style={{ ...base, width: 40, height: 40, border: "1.5px solid var(--accent)", zIndex: 99998, opacity: show ? (hov ? 0.6 : 0.25) : 0, transition: "opacity .3s, transform .25s cubic-bezier(.16,1,.3,1)" }} />
    </>
  );
}

function InteractiveCircles() {
  const mouse = useMouse();
  const ox = -(mouse.x - 0.5);
  const oy = -(mouse.y - 0.5);
  const circles = [
    { size: 420, x: -490, y: -60,  speed: 40, border: "rgba(240,237,232,0.06)" },
    { size: 300, x: -410, y: 30,   speed: 60, border: "rgba(240,237,232,0.04)" },
    { size: 520, x: -530, y: 80,   speed: 25, border: "rgba(240,237,232,0.05)" },
    { size: 180, x: -310, y: -90,  speed: 80, border: "rgba(240,237,232,0.07)" },
    { size: 260, x: -590, y: 120,  speed: 50, border: "rgba(240,237,232,0.04)" },
    { size: 360, x: -450, y: -150, speed: 35, border: "rgba(240,237,232,0.035)" },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {circles.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute", width: c.size, height: c.size, borderRadius: "50%",
            border: `1px solid ${c.border}`,
            left: `calc(50% + ${c.x}px)`, top: `calc(50% + ${c.y}px)`,
            transform: `translate(-50%, -50%) translate(${ox * c.speed}px, ${oy * c.speed}px)`,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}

/* ── Pill button ─────────────────────────────────── */
function Pill({ href, children, primary, external = true, gradient = false, style = {}, onClick }) {
  const [hov, setHov] = useState(false);
  const base = {
    display: "inline-flex", alignItems: "center", gap: 10,
    fontSize: 13, letterSpacing: ".03em", fontWeight: 500,
    padding: "13px 26px", borderRadius: 100,
    transition: "all .35s cubic-bezier(.16,1,.3,1)", whiteSpace: "nowrap",
    transform: hov ? "translateY(-2px)" : "translateY(0)",
    ...style,
  };
  let look;
  if (gradient) {
    look = {
      color: "#fff", background: "var(--brand-grad)", border: "1px solid transparent",
      boxShadow: hov ? "0 12px 34px rgba(168,85,247,.32)" : "0 6px 18px rgba(168,85,247,.18)",
    };
  } else if (primary) {
    look = {
      color: "var(--bg)", background: "var(--fg)", border: "1px solid var(--fg)",
      boxShadow: hov ? "0 10px 30px rgba(240,237,232,.16)" : "none",
    };
  } else {
    look = {
      color: hov ? "var(--fg)" : "var(--fg-muted)",
      background: "transparent",
      border: `1px solid ${hov ? "var(--fg)" : "var(--border)"}`,
    };
  }
  return (
    <a
      href={href}
      onClick={onClick}
      className="hov"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      style={{ ...base, ...look }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </a>
  );
}

/* ── iPhone mockup ───────────────────────────────── */
function Phone({ src, alt, style = {}, eager = false }) {
  return (
    <div className="phone" style={style}>
      <div className="phone__frame">
        <div className="phone__island" />
        <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} />
      </div>
    </div>
  );
}

/* ── Nav ─────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 var(--px)", height: 64,
        background: scrolled ? "var(--bg-blur)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "all .4s cubic-bezier(.16,1,.3,1)",
      }}
    >
      <a href="#top" className="hov" style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, letterSpacing: ".04em" }}>
        Ahmet.
      </a>
      <div className="nav__links" style={{ display: "flex", gap: 30, alignItems: "center" }}>
        {[["App", "#app"], ["Work", "#work"], ["About", "#about"], ["Contact", "#contact"]].map(([item, href]) => (
          <a
            key={item}
            href={href}
            className="hov"
            style={{ fontSize: 12, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--fg-muted)", transition: "color .3s" }}
            onMouseEnter={(e) => (e.target.style.color = "var(--fg)")}
            onMouseLeave={(e) => (e.target.style.color = "var(--fg-muted)")}
          >
            {item}
          </a>
        ))}
        <Pill href={LINKS.github} style={{ padding: "9px 18px", fontSize: 12 }}>
          GitHub ↗
        </Pill>
      </div>
    </nav>
  );
}

/* ── Browser mockup for web projects ─────────────── */
function BrowserFrame({ project, index }) {
  const [hov, setHov] = useState(false);
  const [ref, vis] = useInView();
  return (
    <a
      ref={ref}
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="hov"
      style={{
        display: "block", textDecoration: "none",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(40px)",
        transition: `opacity .9s cubic-bezier(.16,1,.3,1) ${index * 0.12}s, transform .9s cubic-bezier(.16,1,.3,1) ${index * 0.12}s`,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div
        style={{
          borderRadius: 14, overflow: "hidden", border: "1px solid var(--border)", background: "#111",
          transition: "transform .5s cubic-bezier(.16,1,.3,1), box-shadow .5s, border-color .5s",
          transform: hov ? "translateY(-6px)" : "none",
          borderColor: hov ? "var(--border-hover)" : "var(--border)",
          boxShadow: hov ? "0 24px 60px rgba(0,0,0,.5)" : "0 8px 30px rgba(0,0,0,.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 15px", background: "#161616", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#ff5f57" }} />
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#febc2e" }} />
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#28c840" }} />
          </div>
          <div style={{ flex: 1, marginLeft: 10, background: "#0e0e0e", borderRadius: 6, padding: "5px 12px", fontSize: 11, color: "var(--fg-dim)", letterSpacing: ".02em" }}>
            {project.domain}
          </div>
        </div>
        <div style={{ position: "relative", overflow: "hidden", aspectRatio: "16 / 10", background: "#0c0c0c" }}>
          <img
            src={project.image}
            alt={project.title}
            style={{
              width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block",
              transition: "transform .6s cubic-bezier(.16,1,.3,1)",
              transform: hov ? "scale(1.03)" : "scale(1)",
            }}
          />
        </div>
      </div>

      <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600, letterSpacing: "-.02em" }}>
          {project.title}
        </div>
        <span style={{ fontSize: 12, color: hov ? "var(--fg)" : "var(--fg-muted)", transition: "color .3s" }}>
          Visit ↗
        </span>
      </div>
      <div style={{ fontSize: 13, color: "var(--fg-muted)", marginTop: 4 }}>{project.subtitle}</div>
      <p style={{ fontSize: 14, color: "var(--fg-muted)", marginTop: 12, lineHeight: 1.7, fontWeight: 300 }}>
        {project.description}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
        {project.tags.map((t) => (
          <span key={t} style={{ fontSize: 11, padding: "4px 11px", border: "1px solid var(--border)", borderRadius: 100, color: "var(--fg-dim)", letterSpacing: ".03em" }}>
            {t}
          </span>
        ))}
      </div>
    </a>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════ */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [heroText, setHeroText] = useState("");
  const fullText = "Hi, I'm Ahmet.";

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  useEffect(() => {
    if (!loaded) return;
    let i = 0;
    const t = setInterval(() => {
      setHeroText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(t);
    }, 60);
    return () => clearInterval(t);
  }, [loaded]);

  return (
    <div id="top">
      <Grain />
      <Cursor />
      <Nav />

      {/* ━━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        style={{
          minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "96px var(--px) 0", maxWidth: "var(--max-w)", margin: "0 auto", position: "relative",
        }}
      >
        <InteractiveCircles />

        <div
          style={{
            position: "absolute", bottom: 0, left: "var(--px)", right: "var(--px)", height: 1, background: "var(--border)",
            transformOrigin: "left",
            animation: loaded ? "lineGrow 1.2s cubic-bezier(.16,1,.3,1) .8s both" : "none",
          }}
        />

        <div className="hero-split">
          {/* Left — Text */}
          <div
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(40px)",
              transition: "all 1s cubic-bezier(.16,1,.3,1) .2s",
            }}
          >
            <div style={{ display: "flex", gap: "clamp(16px,3vw,28px)", marginBottom: "clamp(24px,4vw,40px)", flexWrap: "wrap" }}>
              <div style={{ fontSize: "clamp(11px,1.1vw,13px)", letterSpacing: ".06em", color: "var(--fg-muted)" }}>
                <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#4ade80", marginRight: 8, verticalAlign: "middle", animation: "blink 2.5s ease-in-out infinite" }} />
                Available for work
              </div>
              <div style={{ fontSize: "clamp(11px,1.1vw,13px)", letterSpacing: ".06em", color: "var(--fg-muted)" }}>
                Developer & Designer
              </div>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-display)", fontSize: "clamp(38px, 5.4vw, 72px)",
                fontWeight: 600, letterSpacing: "-.04em", lineHeight: 1.04,
                marginBottom: "clamp(18px,2.5vw,28px)", minHeight: "clamp(46px, 6vw, 86px)",
              }}
            >
              {heroText}
              <span style={{ display: "inline-block", width: "clamp(3px,.4vw,4px)", height: "clamp(36px,5vw,68px)", background: "var(--fg)", marginLeft: 4, verticalAlign: "text-bottom", animation: "blink 1s step-end infinite" }} />
            </h1>

            <p style={{ fontSize: "clamp(15px,1.5vw,18px)", lineHeight: 1.7, color: "var(--fg-muted)", maxWidth: 460, fontWeight: 300 }}>
              I build and ship complete products — from an AI-powered iOS app
              on the App Store to full-stack web tools. Focused on clean code,
              thoughtful design and details that feel right.
            </p>

            <div style={{ display: "flex", gap: 14, marginTop: "clamp(26px,3vw,40px)", flexWrap: "wrap" }}>
              <Pill href="#app" external={false} gradient onClick={(e) => { e.preventDefault(); document.getElementById("app")?.scrollIntoView({ behavior: "smooth" }); }}>
                See my iOS app
              </Pill>
              <Pill href={LINKS.github}>
                GitHub ↗
              </Pill>
            </div>
          </div>

          {/* Right — App phone */}
          <div
            className="hero-art"
            style={{
              display: "flex", justifyContent: "center", alignItems: "center",
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(40px)",
              transition: "all 1s cubic-bezier(.16,1,.3,1) .4s",
            }}
          >
            <Phone src={APP.shots[0].src} alt={APP.shots[0].alt} eager style={{ animation: "float 6s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* ━━━ POSTUREFIX — FLAGSHIP iOS APP ━━━━━━━━━ */}
      <section id="app" style={{ position: "relative", padding: "clamp(80px,12vw,150px) var(--px)", borderTop: "1px solid var(--border)" }}>
        <div className="app-glow" aria-hidden="true" />
        <div style={{ maxWidth: "var(--max-w)", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal>
            <Eyebrow style={{ marginBottom: 28 }}>Flagship · iOS App</Eyebrow>
          </Reveal>

          <div className="app-head">
            <Reveal>
              <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22 }}>
                <img src="/images/posturefix-icon.png" alt="PostureFix icon" style={{ width: 72, height: 72, borderRadius: 18, border: "1px solid var(--border)" }} />
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(30px,4.4vw,54px)", fontWeight: 600, letterSpacing: "-.03em", lineHeight: 1 }}>
                    {APP.name}
                  </h2>
                  <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span className="ver-badge">
                      <span className="ver-dot" /> Version {APP.version} · Live
                    </span>
                    <span style={{ fontSize: 12, color: "var(--fg-muted)", letterSpacing: ".03em" }}>
                      {APP.category} · {APP.platform} · {APP.price}
                    </span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "clamp(15px,1.7vw,20px)", lineHeight: 1.65, fontWeight: 300, maxWidth: 620, color: "var(--fg)" }}>
                <span className="app-grad" style={{ fontWeight: 500 }}>{APP.tagline}</span>{" "}
                <span style={{ color: "var(--fg-muted)" }}>{APP.description}</span>
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 26 }}>
                {APP.features.map((f) => (
                  <span key={f} style={{ fontSize: 12.5, padding: "7px 15px", border: "1px solid var(--border)", borderRadius: 100, color: "var(--fg-muted)", letterSpacing: ".02em" }}>
                    {f}
                  </span>
                ))}
              </div>

              <div style={{ display: "flex", gap: 14, marginTop: 30, flexWrap: "wrap" }}>
                <Pill href={LINKS.appStore} gradient>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ marginTop: -1 }}>
                    <path d="M15.13 3.15c.88-1.06 1.48-2.53 1.32-4.01-1.28.05-2.82.86-3.74 1.93-.82.95-1.54 2.47-1.35 3.92 1.43.11 2.89-.73 3.77-1.84Zm3.18 9.54c.03 3.17 2.79 4.23 2.82 4.24-.02.07-.44 1.51-1.45 3-.87 1.29-1.78 2.58-3.2 2.61-1.4.03-1.85-.83-3.46-.83-1.61 0-2.11.81-3.43.86-1.37.05-2.42-1.37-3.3-2.65-1.8-2.6-3.17-7.36-1.33-10.55.91-1.58 2.53-2.58 4.29-2.61 1.34-.03 2.61.91 3.46.91.84 0 2.42-1.13 4.08-.96.69.03 2.63.28 3.88 2.1-.1.06-2.32 1.35-2.36 3.88Z" />
                  </svg>
                  Download on the App Store
                </Pill>
                <Pill href={LINKS.appSite}>
                  Visit website ↗
                </Pill>
              </div>
            </Reveal>
          </div>

          {/* Screenshot rail */}
          <Reveal delay={0.1}>
            <div className="shot-rail">
              {APP.shots.map((s, i) => (
                <Phone key={s.src} src={s.src} alt={s.alt} style={{ flex: "0 0 auto", animationDelay: `${i * 0.4}s` }} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━ GITHUB ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ padding: "clamp(70px,10vw,130px) var(--px)", maxWidth: "var(--max-w)", margin: "0 auto", borderTop: "1px solid var(--border)" }}>
        <Reveal>
          <Eyebrow style={{ marginBottom: 28 }}>Open Source · GitHub</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="hov gh-card">
            <div className="gh-card__inner">
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.31-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.87.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.29 0 .32.21.7.82.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
                </svg>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,2.6vw,30px)", fontWeight: 600, letterSpacing: "-.02em" }}>
                    @ahmetysfd
                  </div>
                  <div style={{ fontSize: 13, color: "var(--fg-muted)", marginTop: 4 }}>
                    Code, experiments & side projects — explore the repositories.
                  </div>
                </div>
              </div>
              <span className="gh-card__arrow">View profile ↗</span>
            </div>
          </a>
        </Reveal>
      </section>

      {/* ━━━ SELECTED WORK ━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="work" style={{ padding: "clamp(70px,10vw,130px) var(--px)", maxWidth: "var(--max-w)", margin: "0 auto", borderTop: "1px solid var(--border)" }}>
        <Reveal>
          <Eyebrow style={{ marginBottom: "clamp(40px,6vw,64px)" }}>Selected Work</Eyebrow>
        </Reveal>
        <div className="work-grid">
          {PROJECTS.map((p, i) => (
            <BrowserFrame key={i} project={p} index={i} />
          ))}
        </div>
      </section>

      {/* ━━━ ABOUT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="about" style={{ padding: "clamp(60px,10vw,120px) var(--px)", maxWidth: "var(--max-w)", margin: "0 auto", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "clamp(40px,6vw,72px)" }}>
          <Reveal>
            <Eyebrow style={{ marginBottom: 24 }}>About</Eyebrow>
            <p style={{ fontSize: "clamp(16px,1.9vw,21px)", lineHeight: 1.7, fontWeight: 300, letterSpacing: "-.01em" }}>
              I'm a developer and designer who likes owning the whole build —
              shaping the idea, designing the interface, writing the code and
              shipping it to real users. PostureFix, my AI posture app, is live
              on the App Store; alongside it I build web tools with the same
              care for craft and clarity.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <Eyebrow style={{ marginBottom: 24 }}>Capabilities</Eyebrow>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {SKILLS.map((s) => (
                <span
                  key={s}
                  className="hov"
                  style={{ fontSize: 12, padding: "8px 18px", border: "1px solid var(--border)", borderRadius: 100, color: "var(--fg-muted)", letterSpacing: ".02em", transition: "all .3s" }}
                  onMouseEnter={(e) => { e.target.style.borderColor = "var(--fg)"; e.target.style.color = "var(--fg)"; }}
                  onMouseLeave={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--fg-muted)"; }}
                >
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━ CONTACT / FOOTER ━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer id="contact" style={{ padding: "clamp(60px,10vw,120px) var(--px)", maxWidth: "var(--max-w)", margin: "0 auto", borderTop: "1px solid var(--border)" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 48 }}>
            <div>
              <Eyebrow style={{ marginBottom: 24 }}>Let's Connect</Eyebrow>
              <p style={{ fontSize: "clamp(26px,4vw,50px)", fontFamily: "var(--font-display)", fontWeight: 500, letterSpacing: "-.03em", lineHeight: 1.15, maxWidth: 520 }}>
                Got a project in mind?{" "}
                <a
                  href={LINKS.email}
                  className="hov"
                  style={{ color: "var(--fg-muted)", borderBottom: "2px solid var(--border)", paddingBottom: 2, transition: "color .3s, border-color .3s" }}
                  onMouseEnter={(e) => { e.target.style.color = "var(--fg)"; e.target.style.borderColor = "var(--fg)"; }}
                  onMouseLeave={(e) => { e.target.style.color = "var(--fg-muted)"; e.target.style.borderColor = "var(--border)"; }}
                >
                  Say hello →
                </a>
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="hov"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 13, letterSpacing: ".04em", color: "var(--fg-muted)", display: "flex", alignItems: "center", gap: 8, transition: "color .3s, transform .3s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--fg)"; e.currentTarget.style.transform = "translateX(6px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--fg-muted)"; e.currentTarget.style.transform = "translateX(0)"; }}
                >
                  → {s.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <div style={{ marginTop: "clamp(60px,8vw,100px)", paddingTop: 24, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontSize: 11, color: "var(--fg-dim)", letterSpacing: ".04em" }}>
            © {new Date().getFullYear()} Ahmet
          </span>
          <span style={{ fontSize: 11, color: "var(--fg-dim)", letterSpacing: ".04em" }}>
            Designed & built by Ahmet
          </span>
        </div>
      </footer>
    </div>
  );
}
