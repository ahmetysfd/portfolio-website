import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════ */
const PROJECTS = [
  {
    title: "SkyWatch",
    subtitle: "Weather Data Platform",
    description:
      "A full-stack weather tracking app with interactive 3D globe, city library, real-time data, reviews, and country exploration — built with Python Flask & JavaScript.",
    tags: ["Python", "Flask", "JavaScript", "API", "3D Globe"],
    image: "/images/skywatch.png",
    href: "#",
  },
  {
    title: "Spotify Library",
    subtitle: "Music Analytics Dashboard",
    description:
      "Personal Spotify analytics dashboard showing top artists, tracks, listening insights and history — connected to the Spotify Web API with OAuth.",
    tags: ["React", "Spotify API", "OAuth", "Node.js"],
    image: "/images/spotify-lib.png",
    href: "#",
  },
];

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/ahmetysfd" },
  { label: "LinkedIn", href: "#" },
  { label: "Email", href: "mailto:hello@ahmet.dev" },
];

const SKILLS = [
  "JavaScript / TypeScript",
  "React / Next.js",
  "Python / Flask",
  "Node.js",
  "UI/UX Design",
  "Data Visualization",
  "REST APIs",
  "Git & DevOps",
];

const FEATURED_SITE = {
  title: "Onboard",
  subtitle: "Product Landing Page",
  description:
    "A clean, modern product website designed in Figma — featuring smooth scroll interactions, bold typography, and a conversion-focused layout.",
  tags: ["Figma", "Web Design", "UI/UX", "Landing Page"],
  url: "https://user-notch-43691001.figma.site/",
};

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
  const pos = useRef({ x: 0.5, y: 0.5 }); // normalized 0-1
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
   COMPONENTS
   ═══════════════════════════════════════════════════ */

/* ── Reveal wrapper ──────────────────────────────── */
function Reveal({ children, delay = 0, className = "", style = {} }) {
  const [ref, vis] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.8s cubic-bezier(.16,1,.3,1) ${delay}s, transform 0.8s cubic-bezier(.16,1,.3,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Film grain overlay ──────────────────────────── */
function Grain() {
  return (
    <div
      style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9000, opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat", backgroundSize: 180,
      }}
    />
  );
}

/* ── Custom cursor ───────────────────────────────── */
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

/* ── Interactive Circles (Yichen Xie style) ──────── */
function InteractiveCircles() {
  const mouse = useMouse(); // 0..1 normalized

  // Offset from center: -0.5 to 0.5, then INVERT for opposite movement
  const ox = -(mouse.x - 0.5);
  const oy = -(mouse.y - 0.5);

  const circles = [
    { size: 420, x: -120, y: -60,  speed: 40, border: "rgba(240,237,232,0.06)", bg: "transparent" },
    { size: 300, x: 60,   y: 30,   speed: 60, border: "rgba(240,237,232,0.04)", bg: "rgba(240,237,232,0.015)" },
    { size: 520, x: -40,  y: 80,   speed: 25, border: "rgba(240,237,232,0.05)", bg: "transparent" },
    { size: 180, x: 200,  y: -90,  speed: 80, border: "rgba(240,237,232,0.07)", bg: "rgba(240,237,232,0.02)" },
    { size: 260, x: -200, y: 120,  speed: 50, border: "rgba(240,237,232,0.04)", bg: "transparent" },
    { size: 140, x: 280,  y: 100,  speed: 90, border: "rgba(240,237,232,0.08)", bg: "rgba(240,237,232,0.01)" },
    { size: 360, x: 150,  y: -150, speed: 35, border: "rgba(240,237,232,0.035)", bg: "transparent" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {circles.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: c.size,
            height: c.size,
            borderRadius: "50%",
            border: `1px solid ${c.border}`,
            background: c.bg,
            left: `calc(50% + ${c.x}px)`,
            top: `calc(50% + ${c.y}px)`,
            transform: `translate(-50%, -50%) translate(${ox * c.speed}px, ${oy * c.speed}px)`,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}

/* ── Featured Browser Frame (iframe) ────────────── */
function FeaturedBrowserFrame() {
  const [hov, setHov] = useState(false);
  const [ref, vis] = useInView();

  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(50px)",
        transition: "opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)",
      }}
    >
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 600, letterSpacing: "-.02em" }}>
            {FEATURED_SITE.title}
          </div>
          <div style={{ fontSize: "clamp(12px, 1.3vw, 14px)", color: "var(--fg-muted)", marginTop: 4 }}>
            {FEATURED_SITE.subtitle}
          </div>
        </div>
        <a
          href={FEATURED_SITE.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hov"
          style={{
            fontSize: 12, letterSpacing: ".05em",
            border: "1px solid var(--border)", padding: "8px 20px", borderRadius: 100,
            transition: "all .3s", whiteSpace: "nowrap",
            background: hov ? "var(--fg)" : "transparent",
            color: hov ? "var(--bg)" : "var(--fg-muted)",
            borderColor: hov ? "var(--fg)" : "var(--border)",
          }}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
        >
          Visit Site →
        </a>
      </div>

      <a
        href={FEATURED_SITE.url}
        target="_blank"
        rel="noopener noreferrer"
        className="hov"
        style={{ display: "block", textDecoration: "none" }}
      >
        <div
          style={{
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid var(--border)",
            background: "#111",
            transition: "transform .5s cubic-bezier(.16,1,.3,1), box-shadow .5s",
            transform: hov ? "translateY(-6px) scale(1.005)" : "none",
            boxShadow: hov ? "0 24px 60px rgba(0,0,0,.5)" : "0 8px 30px rgba(0,0,0,.3)",
          }}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
        >
          <div
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "12px 16px",
              background: "#1a1a1a",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
            </div>
            <div
              style={{
                flex: 1, marginLeft: 12,
                background: "#0e0e0e", borderRadius: 6, padding: "6px 14px",
                fontSize: 11, color: "var(--fg-dim)", letterSpacing: ".02em",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              user-notch-43691001.figma.site
            </div>
          </div>

          <div style={{ position: "relative", overflow: "hidden", background: "#0a0a0a" }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingTop: "56.25%",
                overflow: "hidden",
              }}
            >
              <iframe
                src={FEATURED_SITE.url}
                title={FEATURED_SITE.title}
                loading="eager"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            </div>
            <div
              style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
                background: "linear-gradient(transparent, rgba(7,7,7,0.6))",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </a>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
        {FEATURED_SITE.tags.map((t) => (
          <span
            key={t}
            style={{
              fontSize: 11, padding: "5px 12px",
              border: "1px solid var(--border)", borderRadius: 100,
              color: "var(--fg-dim)", letterSpacing: ".03em",
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <p style={{ fontSize: "clamp(13px, 1.4vw, 15px)", color: "var(--fg-muted)", marginTop: 14, lineHeight: 1.7, maxWidth: 560, fontWeight: 300 }}>
        {FEATURED_SITE.description}
      </p>
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
      <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
        {["Work", "About", "Contact"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="hov nav-link"
            style={{
              fontSize: 12, letterSpacing: ".06em", textTransform: "uppercase",
              color: "var(--fg-muted)", transition: "color .3s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "var(--fg)")}
            onMouseLeave={(e) => (e.target.style.color = "var(--fg-muted)")}
          >
            {item}
          </a>
        ))}
      </div>
    </nav>
  );
}

/* ── Browser Mockup Frame ────────────────────────── */
function BrowserFrame({ project, index }) {
  const [hov, setHov] = useState(false);
  const [ref, vis] = useInView();

  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(50px)",
        transition: `opacity .9s cubic-bezier(.16,1,.3,1) ${index * 0.18}s, transform .9s cubic-bezier(.16,1,.3,1) ${index * 0.18}s`,
      }}
    >
      {/* Project Info Above */}
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 600, letterSpacing: "-.02em" }}>
            {project.title}
          </div>
          <div style={{ fontSize: "clamp(12px, 1.3vw, 14px)", color: "var(--fg-muted)", marginTop: 4 }}>
            {project.subtitle}
          </div>
        </div>
        <a
          href={project.href}
          className="hov"
          style={{
            fontSize: 12, letterSpacing: ".05em", color: "var(--fg-muted)",
            border: "1px solid var(--border)", padding: "8px 20px", borderRadius: 100,
            transition: "all .3s", whiteSpace: "nowrap",
            background: hov ? "var(--fg)" : "transparent",
            color: hov ? "var(--bg)" : "var(--fg-muted)",
            borderColor: hov ? "var(--fg)" : "var(--border)",
          }}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
        >
          View Project →
        </a>
      </div>

      {/* Browser Chrome */}
      <div
        className="hov"
        style={{
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid var(--border)",
          background: "#111",
          transition: "transform .5s cubic-bezier(.16,1,.3,1), box-shadow .5s",
          transform: hov ? "translateY(-6px) scale(1.005)" : "none",
          boxShadow: hov ? "0 24px 60px rgba(0,0,0,.5)" : "0 8px 30px rgba(0,0,0,.3)",
        }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        {/* Title bar */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "12px 16px",
            background: "#1a1a1a",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
          </div>
          <div
            style={{
              flex: 1, marginLeft: 12,
              background: "#0e0e0e", borderRadius: 6, padding: "6px 14px",
              fontSize: 11, color: "var(--fg-dim)", letterSpacing: ".02em",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            {project.title.toLowerCase()}.app
          </div>
        </div>

        {/* Screenshot */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <img
            src={project.image}
            alt={project.title}
            style={{
              width: "100%", display: "block",
              transition: "transform .6s cubic-bezier(.16,1,.3,1)",
              transform: hov ? "scale(1.03)" : "scale(1)",
            }}
          />
          {/* Subtle gradient overlay at bottom */}
          <div
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
              background: "linear-gradient(transparent, rgba(7,7,7,0.6))",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* Tags below */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
        {project.tags.map((t) => (
          <span
            key={t}
            style={{
              fontSize: 11, padding: "5px 12px",
              border: "1px solid var(--border)", borderRadius: 100,
              color: "var(--fg-dim)", letterSpacing: ".03em",
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Description */}
      <p style={{ fontSize: "clamp(13px, 1.4vw, 15px)", color: "var(--fg-muted)", marginTop: 14, lineHeight: 1.7, maxWidth: 560, fontWeight: 300 }}>
        {project.description}
      </p>
    </div>
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
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: "clamp(120px, 16vh, 180px) var(--px) clamp(40px, 6vh, 80px)",
          maxWidth: "var(--max-w)",
          margin: "0 auto",
          position: "relative",
        }}
      >
        <InteractiveCircles />

        {/* Decorative bottom line */}
        <div
          style={{
            position: "absolute", bottom: 0, left: "var(--px)", right: "var(--px)",
            height: 1, background: "var(--border)",
            transformOrigin: "left",
            animation: loaded ? "lineGrow 1.2s cubic-bezier(.16,1,.3,1) .8s both" : "none",
          }}
        />

        <div
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(40px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1) .2s",
            position: "relative", zIndex: 2,
          }}
        >
          {/* Status */}
          <div style={{ display: "flex", gap: "clamp(16px,4vw,48px)", marginBottom: "clamp(32px,5vw,56px)", flexWrap: "wrap" }}>
            <div style={{ fontSize: "clamp(11px,1.1vw,13px)", letterSpacing: ".06em", color: "var(--fg-muted)" }}>
              <span
                style={{
                  display: "inline-block", width: 7, height: 7, borderRadius: "50%",
                  background: "#4ade80", marginRight: 8, verticalAlign: "middle",
                  animation: "blink 2.5s ease-in-out infinite",
                }}
              />
              Available for work
            </div>
            <div style={{ fontSize: "clamp(11px,1.1vw,13px)", letterSpacing: ".06em", color: "var(--fg-muted)" }}>
              Computer Science — B.Sc. 6th Semester
            </div>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(38px, 7.5vw, 84px)",
              fontWeight: 600, letterSpacing: "-.04em", lineHeight: 1.05,
              marginBottom: "clamp(20px,3vw,32px)",
              minHeight: "clamp(46px, 9vw, 102px)",
            }}
          >
            {heroText}
            <span
              style={{
                display: "inline-block", width: "clamp(3px,.4vw,4px)",
                height: "clamp(38px,7.5vw,84px)", background: "var(--fg)",
                marginLeft: 4, verticalAlign: "text-bottom",
                animation: "blink 1s step-end infinite",
              }}
            />
          </h1>

          <p
            style={{
              fontSize: "clamp(14px,1.6vw,18px)", lineHeight: 1.7,
              color: "var(--fg-muted)", maxWidth: 560, fontWeight: 300,
            }}
          >
            A developer & designer crafting thoughtful digital experiences.
            Building full-stack tools and interactive web applications
            with a passion for clean code and modern UI.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 16, marginTop: "clamp(28px,4vw,48px)", flexWrap: "wrap" }}>
            <a
              href="#work"
              className="hov"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                fontSize: 13, letterSpacing: ".04em", fontWeight: 500,
                color: "var(--bg)", background: "var(--fg)",
                padding: "14px 30px", borderRadius: 100,
                transition: "all .3s cubic-bezier(.16,1,.3,1)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(240,237,232,.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              View Work <span style={{ fontSize: 16 }}>↓</span>
            </a>
            <a
              href="https://github.com/ahmetysfd"
              className="hov"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                fontSize: 13, letterSpacing: ".04em",
                color: "var(--fg)", border: "1px solid var(--border)",
                padding: "14px 30px", borderRadius: 100,
                transition: "all .3s cubic-bezier(.16,1,.3,1)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--fg)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              GitHub →
            </a>
          </div>
        </div>
      </section>

      {/* ━━━ FEATURED ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        style={{
          padding: "clamp(80px,12vw,160px) var(--px) clamp(40px,6vw,80px)",
          maxWidth: "var(--max-w)", margin: "0 auto",
        }}
      >
        <Reveal>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(11px,1.1vw,13px)", fontWeight: 500,
              letterSpacing: ".12em", textTransform: "uppercase",
              color: "var(--fg-muted)", marginBottom: "clamp(48px,7vw,80px)",
            }}
          >
            Featured
          </div>
        </Reveal>
        <FeaturedBrowserFrame />
      </section>

      {/* ━━━ PROJECTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="work"
        style={{
          padding: "clamp(80px,12vw,160px) var(--px)",
          maxWidth: "var(--max-w)", margin: "0 auto",
        }}
      >
        <Reveal>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(11px,1.1vw,13px)", fontWeight: 500,
              letterSpacing: ".12em", textTransform: "uppercase",
              color: "var(--fg-muted)", marginBottom: "clamp(48px,7vw,80px)",
            }}
          >
            Projects
          </div>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(72px,10vw,120px)" }}>
          {PROJECTS.map((p, i) => (
            <BrowserFrame key={i} project={p} index={i} />
          ))}
        </div>
      </section>

      {/* ━━━ ABOUT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="about"
        style={{
          padding: "clamp(60px,10vw,120px) var(--px)",
          maxWidth: "var(--max-w)", margin: "0 auto",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "clamp(40px,6vw,72px)",
          }}
        >
          <Reveal>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(11px,1.1vw,13px)", fontWeight: 500,
                letterSpacing: ".12em", textTransform: "uppercase",
                color: "var(--fg-muted)", marginBottom: 24,
              }}
            >
              About
            </h3>
            <p style={{ fontSize: "clamp(15px,1.8vw,20px)", lineHeight: 1.7, fontWeight: 300, letterSpacing: "-.01em" }}>
              Computer Science student in my 6th semester, focused on building
              things for the web with clean architecture, intuitive interfaces,
              and meaningful interactions. Passionate about turning complex problems
              into elegant solutions.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(11px,1.1vw,13px)", fontWeight: 500,
                letterSpacing: ".12em", textTransform: "uppercase",
                color: "var(--fg-muted)", marginBottom: 24,
              }}
            >
              Capabilities
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {SKILLS.map((s) => (
                <span
                  key={s}
                  className="hov"
                  style={{
                    fontSize: 12, padding: "8px 18px",
                    border: "1px solid var(--border)", borderRadius: 100,
                    color: "var(--fg-muted)", letterSpacing: ".02em",
                    transition: "all .3s",
                  }}
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

      {/* ━━━ FOOTER / CONTACT ━━━━━━━━━━━━━━━━━━━━━━ */}
      <footer
        id="contact"
        style={{
          padding: "clamp(60px,10vw,120px) var(--px)",
          maxWidth: "var(--max-w)", margin: "0 auto",
          borderTop: "1px solid var(--border)",
        }}
      >
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 48 }}>
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(11px,1.1vw,13px)", fontWeight: 500,
                  letterSpacing: ".12em", textTransform: "uppercase",
                  color: "var(--fg-muted)", marginBottom: 24,
                }}
              >
                Let's Connect
              </h3>
              <p
                style={{
                  fontSize: "clamp(24px,4vw,48px)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 500, letterSpacing: "-.03em", lineHeight: 1.2, maxWidth: 500,
                }}
              >
                Got a project in mind?{" "}
                <a
                  href="mailto:hello@ahmet.dev"
                  className="hov"
                  style={{
                    color: "var(--fg-muted)", borderBottom: "2px solid var(--border)",
                    paddingBottom: 2, transition: "color .3s, border-color .3s",
                  }}
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
                  style={{
                    fontSize: 13, letterSpacing: ".04em", color: "var(--fg-muted)",
                    display: "flex", alignItems: "center", gap: 8,
                    transition: "color .3s, transform .3s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--fg)"; e.currentTarget.style.transform = "translateX(6px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--fg-muted)"; e.currentTarget.style.transform = "translateX(0)"; }}
                >
                  → {s.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <div
          style={{
            marginTop: "clamp(60px,8vw,100px)", paddingTop: 24,
            borderTop: "1px solid var(--border)",
            display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
          }}
        >
          <span style={{ fontSize: 11, color: "var(--fg-dim)", letterSpacing: ".04em" }}>
            © {new Date().getFullYear()} Ahmet
          </span>
          <span style={{ fontSize: 11, color: "var(--fg-dim)", letterSpacing: ".04em" }}>
            Designed & Built by Ahmet
          </span>
        </div>
      </footer>
    </div>
  );
}
