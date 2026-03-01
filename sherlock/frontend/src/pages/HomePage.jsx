import { useState, useEffect } from "react";

export default function HomePage({ onEnter, sound }) {
  const [phase, setPhase] = useState(0); // 0=loading, 1=title, 2=ready
  const [fog, setFog] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setFog((f) => (f + 1) % 100), 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page">
      {/* Animated fog/particles background */}
      <div className="fog-layer" />
      <div className="fog-layer fog-layer--2" />
      <div className="vignette" />

      {/* Top bar */}
      <div className={`home-topbar ${phase >= 1 ? "visible" : ""}`}>
        <span className="home-eyebrow">VICTORIAN DEDUCTION ENGINE — 1888</span>
        <button
          className="sound-toggle"
          onClick={() => { sound.playClick(); sound.toggle(); }}
          title={sound.enabled ? "Desactivar sonido" : "Activar sonido"}
        >
          {sound.enabled ? "🔊 SONIDO ON" : "🔇 SONIDO OFF"}
        </button>
      </div>

      {/* Center content */}
      <div className="home-center">
        <div className={`home-badge ${phase >= 1 ? "visible" : ""}`}>
          <span className="badge-icon">🎩</span>
        </div>

        <h1 className={`home-title ${phase >= 1 ? "visible" : ""}`}>
          <span className="title-line-1">SHERLOCK</span>
          <span className="title-line-2">DEDUCTION ENGINE</span>
        </h1>

        <div className={`home-divider ${phase >= 2 ? "visible" : ""}`}>
          <span className="divider-line" />
          <span className="divider-dot" />
          <span className="divider-line" />
        </div>

        <p className={`home-tagline ${phase >= 2 ? "visible" : ""}`}>
          "Cuando eliminas lo imposible, lo que queda,<br />
          por improbable que parezca, debe ser la verdad."
        </p>
        <p className={`home-author ${phase >= 2 ? "visible" : ""}`}>
          — Arthur Conan Doyle
        </p>

        <button
          className={`home-btn ${phase >= 2 ? "visible" : ""}`}
          onClick={() => { sound.playClick(); onEnter(); }}
        >
          <span>ABRIR EXPEDIENTE</span>
          <span className="btn-arrow">→</span>
        </button>
      </div>

      {/* Footer */}
      <div className={`home-footer ${phase >= 2 ? "visible" : ""}`}>
        <span>WHITECHAPEL · LONDRES · 1888</span>
        <span className="footer-sep">◆</span>
        <span>SCOTLAND YARD · CASE FILES</span>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,500;0,600;1,300;1,500&family=Cinzel+Decorative:wght@400;700&display=swap');

        .home-page {
          min-height: 100vh;
          background: #0d0d14;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'Cinzel', serif;
        }

        /* Fog background */
        .fog-layer {
          position: absolute;
          inset: -50%;
          background: radial-gradient(ellipse 80% 60% at 30% 40%, rgba(100,120,180,0.06) 0%, transparent 60%),
                      radial-gradient(ellipse 60% 80% at 70% 60%, rgba(80,100,160,0.04) 0%, transparent 60%);
          animation: fogDrift 20s ease-in-out infinite alternate;
          pointer-events: none;
        }
        .fog-layer--2 {
          background: radial-gradient(ellipse 70% 50% at 60% 30%, rgba(120,90,180,0.04) 0%, transparent 60%);
          animation: fogDrift2 28s ease-in-out infinite alternate;
        }
        @keyframes fogDrift { from{transform:translateX(-5%) translateY(-3%)} to{transform:translateX(5%) translateY(3%)} }
        @keyframes fogDrift2 { from{transform:translateX(3%) translateY(2%)} to{transform:translateX(-4%) translateY(-4%)} }

        .vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%);
          pointer-events: none;
        }

        /* Top bar */
        .home-topbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 40px;
          opacity: 0;
          transform: translateY(-8px);
          transition: all 0.6s ease;
          z-index: 10;
        }
        .home-topbar.visible { opacity: 1; transform: translateY(0); }

        .home-eyebrow {
          font-family: 'Cinzel', serif;
          font-size: 10px;
          letter-spacing: 0.3em;
          color: #5a6080;
          text-transform: uppercase;
        }

        .sound-toggle {
          font-family: 'Cinzel', serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #5a6080;
          background: transparent;
          border: 1px solid #2a2a3a;
          padding: 6px 14px;
          cursor: pointer;
          transition: all 0.2s;
          border-radius: 2px;
        }
        .sound-toggle:hover { color: #d4af70; border-color: #d4af70; }

        /* Center content */
        .home-center {
          position: relative;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          text-align: center;
          padding: 0 24px;
        }

        .home-badge {
          opacity: 0;
          transform: scale(0.7);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          margin-bottom: 32px;
        }
        .home-badge.visible { opacity: 1; transform: scale(1); }
        .badge-icon { font-size: 64px; filter: drop-shadow(0 0 30px rgba(212,175,112,0.4)); }

        .home-title {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s ease 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          margin-bottom: 32px;
        }
        .home-title.visible { opacity: 1; transform: translateY(0); }

        .title-line-1 {
          font-family: 'Cinzel Decorative', serif;
          font-size: clamp(40px, 8vw, 88px);
          font-weight: 700;
          color: #f0e0c0;
          letter-spacing: 0.2em;
          line-height: 1;
          text-shadow: 0 0 60px rgba(212,175,112,0.3), 0 2px 0 rgba(0,0,0,0.5);
        }
        .title-line-2 {
          font-family: 'Cinzel', serif;
          font-size: clamp(11px, 2vw, 18px);
          font-weight: 400;
          color: #d4af70;
          letter-spacing: 0.6em;
          text-transform: uppercase;
        }

        .home-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
          opacity: 0;
          transition: all 0.6s ease 0.5s;
          width: 300px;
        }
        .home-divider.visible { opacity: 1; }
        .divider-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, #d4af70, transparent); }
        .divider-dot { width: 6px; height: 6px; background: #d4af70; border-radius: 50%; }

        .home-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(16px, 2.2vw, 22px);
          font-style: italic;
          font-weight: 300;
          color: #b8b0c8;
          line-height: 1.8;
          max-width: 560px;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.6s ease 0.6s;
          margin-bottom: 8px;
        }
        .home-tagline.visible { opacity: 1; transform: translateY(0); }

        .home-author {
          font-family: 'Cinzel', serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          color: #5a6080;
          margin-bottom: 52px;
          opacity: 0;
          transition: all 0.6s ease 0.7s;
        }
        .home-author.visible { opacity: 1; }

        .home-btn {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 48px;
          background: transparent;
          border: 1px solid #d4af70;
          color: #d4af70;
          font-family: 'Cinzel', serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.6s ease 0.8s, transform 0.6s ease 0.8s, background 0.3s, color 0.3s, box-shadow 0.3s;
        }
        .home-btn.visible { opacity: 1; transform: translateY(0); }
        .home-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #d4af70;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .home-btn:hover::before { transform: scaleX(1); }
        .home-btn:hover { color: #0d0d14; }
        .home-btn span, .home-btn .btn-arrow { position: relative; z-index: 1; }
        .btn-arrow { font-size: 18px; transition: transform 0.2s; }
        .home-btn:hover .btn-arrow { transform: translateX(6px); }

        /* Footer */
        .home-footer {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          padding: 20px;
          font-family: 'Cinzel', serif;
          font-size: 9px;
          letter-spacing: 0.25em;
          color: #2e2e48;
          text-transform: uppercase;
          opacity: 0;
          transition: all 0.6s ease 1s;
        }
        .home-footer.visible { opacity: 1; }
        .footer-sep { color: #d4af70; font-size: 6px; }
      `}</style>
    </div>
  );
}
