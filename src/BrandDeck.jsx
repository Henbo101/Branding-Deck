import { useState, useEffect, useRef, useCallback } from "react";

const PHASES = [
  {
    num: "01",
    title: "Discovery",
    duration: "1 Week",
    color: "var(--phase-1)",
    tasks: [
      "Development / stakeholder interviews",
      "Competitor analysis",
      "Brand positioning exploration",
    ],
    deliverable: "Brand Strategy Document",
    payment: "20% upfront deposit",
    description:
      "I start by getting a proper understanding of your business, through conversations and research, to figure out where your brand should sit in the market.",
  },
  {
    num: "02",
    title: "Concept Development",
    duration: "2 Weeks",
    color: "var(--phase-2)",
    tasks: [
      "2–3 brand directions presented",
      "Logo concepts",
      "Exploration of visual systems",
    ],
    deliverable: "Concept Presentation (2–3 Routes)",
    payment: "20% on completion",
    description:
      "I'll present 2–3 genuinely different brand directions, not variations on the same idea, but distinct approaches you can choose between.",
  },
  {
    num: "03",
    title: "Identity Development",
    duration: "2 Weeks",
    color: "var(--phase-3)",
    tasks: [
      "Final logo refinement",
      "Typographic system",
      "Colour palette",
      "Visual language & art direction",
      "Mockups across key touchpoints",
    ],
    deliverable: "Complete Visual Identity System",
    payment: null,
    description:
      "The chosen direction gets built out into a complete identity system. Type, colour, imagery, and layout all working together and ready to use across any format.",
  },
  {
    num: "04",
    title: "Guidelines & Assets",
    duration: "2 Weeks",
    color: "var(--phase-4)",
    tasks: [
      "Brand book / guidelines",
      "Asset delivery (all formats)",
      "Template files for ongoing use",
    ],
    deliverable: "Brand Book + Production Assets",
    payment: "60% final balance",
    description:
      "Everything handed over so your team can use the brand confidently from day one: files, templates, and guidelines included.",
  },
];

const TIMELINE_WEEKS = 7;
const TOTAL_SLIDES = 8;
const SLIDE_LABELS = ["Intro", "01", "02", "03", "04", "Timeline", "Payment", "Next"];

export default function BrandDeck() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [entering, setEntering] = useState(true);
  const [direction, setDirection] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const touchRef = useRef({ startX: 0, startY: 0 });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const navigate = useCallback(
    (to) => {
      if (to < 0 || to >= TOTAL_SLIDES || to === activeSlide) return;
      setDirection(to > activeSlide ? 1 : -1);
      setEntering(false);
      setTimeout(() => {
        setActiveSlide(to);
        setEntering(true);
      }, 280);
    },
    [activeSlide]
  );

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") navigate(activeSlide + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") navigate(activeSlide - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeSlide, navigate]);

  const onTouchStart = (e) => {
    touchRef.current.startX = e.touches[0].clientX;
    touchRef.current.startY = e.touches[0].clientY;
  };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchRef.current.startX;
    const dy = e.changedTouches[0].clientY - touchRef.current.startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      navigate(dx < 0 ? activeSlide + 1 : activeSlide - 1);
    }
  };

  const renderSlide = () => {
    if (activeSlide === 0) return <IntroSlide m={isMobile} />;
    if (activeSlide >= 1 && activeSlide <= 4)
      return <PhaseSlide phase={PHASES[activeSlide - 1]} index={activeSlide - 1} m={isMobile} />;
    if (activeSlide === 5) return <TimelineSlide m={isMobile} />;
    if (activeSlide === 6) return <PaymentSlide m={isMobile} />;
    if (activeSlide === 7) return <ClosingSlide m={isMobile} />;
    return null;
  };

  return (
    <div className="deck-root" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

        :root {
          --bg: #141414;
          --surface: #1C1C1E;
          --border: #2C2C2E;
          --text-primary: #F5F5F0;
          --text-secondary: #AEAEB2;
          --text-muted: #8E8E93;
          --text-faint: #7A7A7E;
          --accent: #C9A96E;
          --phase-1: #C9A96E;
          --phase-2: #7EAAA2;
          --phase-3: #A87CB2;
          --phase-4: #D4785C;
          --font-display: 'Playfair Display', Georgia, serif;
          --font-body: 'DM Sans', system-ui, sans-serif;
          --body-size: 16px;
          --label-size: 11px;
          --radius: 8px;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .deck-root {
          font-family: var(--font-body);
          background: var(--bg);
          width: 100%; height: 100vh;
          display: flex; flex-direction: column;
          overflow: hidden; color: var(--text-primary);
        }

        .slide-area {
          flex: 1; padding: 32px 24px; overflow: hidden;
          transition: opacity 0.28s ease, transform 0.28s ease;
        }
        .slide-area.out-up { opacity: 0; transform: translateY(-14px); }
        .slide-area.out-down { opacity: 0; transform: translateY(14px); }
        .slide-area.in { opacity: 1; transform: translateY(0); }

        .ri { opacity: 0; transform: translateX(-10px); }
        .ri.go { animation: riIn 0.4s ease forwards; }
        @keyframes riIn { to { opacity: 1; transform: translateX(0); } }

        .ru { opacity: 0; transform: translateY(10px); }
        .ru.go { animation: ruIn 0.45s ease forwards; }
        @keyframes ruIn { to { opacity: 1; transform: translateY(0); } }

        .tl-bar { transform-origin: left; transform: scaleX(0); }
        .tl-bar.go { animation: gx 0.7s ease forwards; }
        @keyframes gx { to { transform: scaleX(1); } }

        .nav-bar {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 28px; border-top: 1px solid var(--border); gap: 12px;
        }
        .nav-dots { display: flex; gap: 5px; align-items: center; }
        .nav-sep { width: 1px; height: 12px; background: var(--border); margin: 0 3px; }

        .ndot {
          width: 8px; height: 8px; border-radius: 50%;
          border: 1.5px solid var(--text-faint); background: transparent;
          cursor: pointer; transition: all 0.25s ease; outline: none;
        }
        .ndot:hover, .ndot:focus-visible {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(201,169,110,0.2);
        }
        .ndot.on {
          background: var(--accent); border-color: var(--accent);
          width: 22px; border-radius: 4px;
        }

        .btn-nav {
          background: none; border: 1px solid var(--border);
          color: var(--text-secondary); padding: 8px 18px; border-radius: 4px;
          cursor: pointer; font-family: var(--font-body);
          font-size: 12px; letter-spacing: 0.5px;
          transition: all 0.2s ease; white-space: nowrap; outline: none;
        }
        .btn-nav:hover, .btn-nav:focus-visible { border-color: var(--accent); color: var(--accent); }
        .btn-nav:disabled { opacity: 0.2; cursor: default; pointer-events: none; }

        .card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 24px;
        }

        .lbl { font-size: var(--label-size); letter-spacing: 2.5px; color: var(--accent); font-weight: 500; }
        .lbl-m { font-size: 10px; letter-spacing: 2px; color: var(--text-faint); }
        .hd { font-family: var(--font-display); font-weight: 400; color: var(--text-primary); line-height: 1.15; }
        .bd { font-size: var(--body-size); color: var(--text-muted); line-height: 1.7; }

        .phase-grid { display: flex; height: 100%; gap: 5%; }
        .phase-l { flex: 0 0 45%; display: flex; flex-direction: column; justify-content: center; }
        .phase-r { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .meta-row { display: flex; gap: 14px; margin-top: 14px; }
        .meta-row > div { flex: 1; }

        .pp { display: flex; gap: 4px; }
        .pp-seg { height: 3px; flex: 1; border-radius: 2px; transition: all 0.4s ease; }

        @media (max-width: 767px) {
          :root { --body-size: 15px; }
          .slide-area { padding: 20px 16px; }
          .nav-bar { padding: 12px 16px; }
          .btn-nav { padding: 8px 12px; font-size: 11px; }
          .phase-grid { flex-direction: column; gap: 20px; overflow-y: auto; }
          .phase-l { flex: none; }
          .phase-r { flex: none; }
          .meta-row { flex-direction: column; gap: 10px; }
          .tl-head { display: none; }
          .tl-mob { display: block !important; }
          .stat-row-inner { flex-direction: column; gap: 16px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ri.go, .ru.go, .tl-bar.go { animation: none; opacity: 1; transform: none; }
          .slide-area, .ndot, .btn-nav, .pp-seg { transition: none; }
        }
      `}</style>

      <div
        className={`slide-area ${entering ? "in" : direction > 0 ? "out-up" : "out-down"}`}
        key={activeSlide}
      >
        {renderSlide()}
      </div>

      <nav className="nav-bar" role="navigation" aria-label="Slide navigation">
        <button className="btn-nav" disabled={activeSlide === 0} onClick={() => navigate(activeSlide - 1)} aria-label="Previous slide">
          ← PREV
        </button>
        <div className="nav-dots" role="tablist" aria-label="Slides">
          {SLIDE_LABELS.map((label, i) => {
            const sep = i === 1 || i === 5;
            return (
              <span key={i} style={{ display: "contents" }}>
                {sep && <div className="nav-sep" />}
                <button
                  className={`ndot ${activeSlide === i ? "on" : ""}`}
                  onClick={() => navigate(i)}
                  role="tab"
                  aria-selected={activeSlide === i}
                  aria-label={`Slide: ${label}`}
                />
              </span>
            );
          })}
        </div>
        <button className="btn-nav" disabled={activeSlide === TOTAL_SLIDES - 1} onClick={() => navigate(activeSlide + 1)} aria-label="Next slide">
          NEXT →
        </button>
      </nav>
    </div>
  );
}

/* ═══ INTRO ═══ */
function IntroSlide({ m }) {
  const stats = [
    { val: "4", label: "Phases" },
    { val: "~7", label: "Weeks" },
    { val: "3", label: "Payment stages" },
  ];
  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: m ? "0 4%" : "0 10%" }}>
      <div style={{ position: "absolute", top: 0, right: 0, textAlign: "right" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text-secondary)", letterSpacing: "0.05em" }}>Henry Killick</div>
        <div className="lbl-m" style={{ marginTop: 3 }}>Triband Studio</div>
      </div>
      <div className="lbl ri go" style={{ marginBottom: 16 }}>EDGECRAFT & STARTUP · BRANDING PROCESS</div>
      <h1 className="hd" style={{ fontSize: m ? 32 : "clamp(36px, 5vw, 54px)", marginBottom: 20 }}>
        From strategy to<br />
        <span style={{ fontStyle: "italic", color: "var(--accent)" }}>complete identity</span>
      </h1>
      <p className="bd" style={{ maxWidth: 520, marginBottom: 36 }}>
        A four-phase process, typically around 7 weeks, taking you from initial research through to a finished brand system with full guidelines and assets.
      </p>
      <div className="stat-row-inner" style={{ display: "flex", gap: 36 }}>
        {stats.map((s, i) => (
          <div key={i} className="ru go" style={{ animationDelay: `${0.25 + i * 0.12}s` }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "var(--text-primary)" }}>{s.val}</div>
            <div className="lbl-m" style={{ marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══ PHASE ═══ */
function PhaseSlide({ phase, index, m }) {
  return (
    <div className="phase-grid">
      <div className="phase-l">
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: m ? 38 : 46, color: phase.color, fontWeight: 400, lineHeight: 1 }}>
            {phase.num}
          </span>
          <span className="lbl-m">/ {phase.duration.toUpperCase()}</span>
        </div>
        <h2 className="hd" style={{ fontSize: m ? 26 : "clamp(26px, 3.5vw, 36px)", marginBottom: 16 }}>
          {phase.title}
        </h2>
        <p className="bd" style={{ maxWidth: 420, marginBottom: 24 }}>{phase.description}</p>
        <div className="pp" style={{ marginBottom: 8 }}>
          {PHASES.map((_, i) => (
            <div key={i} className="pp-seg" style={{ background: i <= index ? phase.color : "var(--border)", opacity: i <= index ? 1 : 0.35 }} />
          ))}
        </div>
        <div className="lbl-m" style={{ fontSize: 10 }}>PHASE {index + 1} OF 4</div>
      </div>

      <div className="phase-r">
        <div className="card">
          <div className="lbl-m" style={{ marginBottom: 14 }}>SCOPE</div>
          {phase.tasks.map((task, i) => (
            <div
              key={i}
              className="ri go"
              style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                padding: "10px 0",
                borderBottom: i < phase.tasks.length - 1 ? "1px solid var(--border)" : "none",
                animationDelay: `${0.12 + i * 0.08}s`,
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: phase.color, marginTop: 7, flexShrink: 0 }} />
              <span style={{ fontSize: "var(--body-size)", color: "var(--text-secondary)", lineHeight: 1.55 }}>{task}</span>
            </div>
          ))}
        </div>
        <div className="meta-row">
          <div className="card" style={!phase.payment ? { flex: 1 } : {}}>
            <div className="lbl-m" style={{ marginBottom: 6 }}>DELIVERABLE</div>
            <div style={{ fontSize: 14, color: "var(--text-primary)", fontWeight: 500 }}>{phase.deliverable}</div>
          </div>
          {phase.payment && (
          <div className="card" style={{ borderColor: `color-mix(in srgb, ${phase.color} 30%, transparent)` }}>
            <div className="lbl-m" style={{ marginBottom: 6 }}>PAYMENT</div>
            <div style={{ fontSize: 14, color: phase.color, fontWeight: 500 }}>{phase.payment}</div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══ TIMELINE ═══ */
function TimelineSlide({ m }) {
  const weeks = Array.from({ length: TIMELINE_WEEKS }, (_, i) => i + 1);
  const bars = [
    { p: 0, s: 0, e: 1 }, { p: 1, s: 1, e: 3 },
    { p: 2, s: 3, e: 5 }, { p: 3, s: 5, e: 7 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: m ? "0 4%" : "0 6%" }}>
      <div className="lbl" style={{ marginBottom: 12 }}>TIMELINE</div>
      <h2 className="hd" style={{ fontSize: m ? 26 : "clamp(26px, 3.5vw, 36px)", marginBottom: 6 }}>
        7-week delivery schedule
      </h2>
      <p style={{ fontSize: 14, color: "var(--text-faint)", marginBottom: 36 }}>
        From kickoff to final asset delivery
      </p>

      <div className="tl-head" style={{ display: "flex", marginBottom: 10, paddingLeft: 140 }}>
        {weeks.map((w) => (
          <div key={w} style={{ flex: 1, textAlign: "center", fontSize: 10, color: "var(--text-faint)", letterSpacing: 0.5 }}>WK {w}</div>
        ))}
      </div>

      {bars.map(({ p, s, e }, i) => (
        <div
          key={i}
          className="ru go"
          style={{
            display: "flex", alignItems: m ? "flex-start" : "center",
            flexDirection: m ? "column" : "row",
            marginBottom: m ? 16 : 10, animationDelay: `${i * 0.12}s`,
          }}
        >
          <div style={{
            width: m ? "auto" : 140, fontSize: 13, color: "var(--text-secondary)",
            fontWeight: 500, paddingRight: 16, textAlign: m ? "left" : "right", marginBottom: m ? 4 : 0,
          }}>
            {PHASES[p].title}
            <span className="tl-mob" style={{ display: "none", fontSize: 11, color: "var(--text-faint)", fontWeight: 400, marginLeft: 8 }}>
              Wk {s + 1}–{e}
            </span>
          </div>
          <div style={{ flex: 1, position: "relative", height: 32, width: "100%" }}>
            <div style={{ position: "absolute", inset: 0, display: "flex" }}>
              {weeks.map((_, wi) => <div key={wi} style={{ flex: 1, borderLeft: "1px solid var(--border)" }} />)}
            </div>
            <div
              className="tl-bar go"
              style={{
                position: "absolute", top: 8,
                left: `${(s / TIMELINE_WEEKS) * 100}%`,
                width: `${((e - s) / TIMELINE_WEEKS) * 100}%`,
                height: 16, background: PHASES[p].color, borderRadius: 3,
                animationDelay: `${0.25 + i * 0.18}s`,
              }}
            />
          </div>
        </div>
      ))}

      <div className="tl-head" style={{ display: "flex", paddingLeft: 140, marginTop: 14 }}>
        {["Kickoff", "Concepts", "Identity", "Delivery"].map((l, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", margin: "0 auto 6px" }} />
            <div style={{ fontSize: 10, color: "var(--accent)", letterSpacing: 0.5 }}>{l}</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 13, color: "var(--text-faint)", marginTop: 28, fontStyle: "italic" }}>
        These timelines can be expedited depending on project scope and how quickly feedback is turned around.
      </p>
    </div>
  );
}

/* ═══ PAYMENT ═══ */
function PaymentSlide({ m }) {
  const pays = [
    { label: "Upfront Deposit", pct: 20, when: "On engagement", c: "var(--phase-1)" },
    { label: "Phase 2 Completion", pct: 20, when: "End of Concept Development", c: "var(--phase-2)" },
    { label: "Final Balance", pct: 60, when: "End of project", c: "var(--phase-4)" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: m ? "0 4%" : "0 8%" }}>
      <div className="lbl" style={{ marginBottom: 12 }}>COMMERCIAL</div>
      <h2 className="hd" style={{ fontSize: m ? 26 : "clamp(26px, 3.5vw, 36px)", marginBottom: 6 }}>Payment structure</h2>
      <p style={{ fontSize: 14, color: "var(--text-faint)", marginBottom: 32 }}>
        Staged payments aligned to deliverable milestones
      </p>

      <div style={{ display: "flex", height: 40, borderRadius: 6, overflow: "hidden", marginBottom: 28 }}>
        {pays.map((p, i) => (
          <div key={i} className="tl-bar go" style={{
            flex: p.pct, background: p.c, display: "flex", alignItems: "center", justifyContent: "center",
            animationDelay: `${0.15 + i * 0.12}s`,
            borderRight: i < 3 ? "2px solid var(--bg)" : "none",
          }}>
            <span style={{ fontSize: 12, color: "var(--surface)", fontWeight: 700 }}>{p.pct}%</span>
          </div>
        ))}
      </div>

      {pays.map((p, i) => (
        <div key={i} className="ru go" style={{
          display: "flex", alignItems: "center", padding: "13px 0",
          borderBottom: "1px solid var(--border)", animationDelay: `${0.35 + i * 0.1}s`,
          flexWrap: m ? "wrap" : "nowrap",
        }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: p.c, marginRight: 14, flexShrink: 0 }} />
          <div style={{ flex: 1, fontSize: 15, color: "var(--text-primary)", fontWeight: 500 }}>{p.label}</div>
          {!m && <div style={{ fontSize: 14, color: "var(--text-muted)", marginRight: 24, minWidth: 120 }}>{p.when}</div>}
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: p.c, minWidth: 50, textAlign: "right" }}>{p.pct}%</div>
          {m && <div style={{ width: "100%", fontSize: 12, color: "var(--text-faint)", marginTop: 2, paddingLeft: 24 }}>{p.when}</div>}
        </div>
      ))}

      <div style={{ marginTop: 18, fontSize: 13, color: "var(--text-faint)", fontStyle: "italic" }}>
        Exact fee confirmed once priority project is scoped. All payments invoiced in advance of each phase.
      </div>
    </div>
  );
}

/* ═══ CLOSING / CTA ═══ */
function ClosingSlide({ m }) {
  const steps = [
    { n: "01", t: "Gain further insights on the Fintech Startup", s: "Begin establishing a position for it (and name it!)" },
    { n: "02", t: "Share the NDA", s: "So I can discuss the fintech opportunity in more detail" },
    { n: "03", t: "Review any existing materials", s: "Pitch decks, product documentation, etc." },
  ];

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: m ? "0 4%" : "0 10%" }}>
      <div style={{ position: "absolute", top: 0, right: 0, textAlign: "right" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text-secondary)", letterSpacing: "0.05em" }}>Henry Killick</div>
        <div className="lbl-m" style={{ marginTop: 3 }}>Triband Studio</div>
      </div>
      <div className="lbl" style={{ marginBottom: 16 }}>WHAT HAPPENS NEXT</div>
      <h2 className="hd" style={{ fontSize: m ? 28 : "clamp(30px, 4vw, 44px)", marginBottom: 8 }}>
        Three steps to <span style={{ fontStyle: "italic", color: "var(--accent)" }}>get started</span>
      </h2>
      <p className="bd" style={{ maxWidth: 480, marginBottom: 40 }}>
        Once the priority project is confirmed, I can move quickly. Discovery typically begins within a week of engagement.
      </p>

      {steps.map((s, i) => (
        <div key={i} className="ru go" style={{
          display: "flex", alignItems: "flex-start", gap: 20,
          padding: "20px 0",
          borderBottom: i < steps.length - 1 ? "1px solid var(--border)" : "none",
          animationDelay: `${0.2 + i * 0.15}s`,
        }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--accent)", lineHeight: 1, flexShrink: 0, width: 36 }}>
            {s.n}
          </span>
          <div>
            <div style={{ fontSize: 17, color: "var(--text-primary)", fontWeight: 500, marginBottom: 3 }}>{s.t}</div>
            <div style={{ fontSize: 14, color: "var(--text-muted)" }}>{s.s}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
