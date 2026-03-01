import { CASES, getSolvedCases, isCaseUnlocked } from "../data/cases";

const DIFFICULTY_COLOR = {
  MODERADO: "#d4af70",
  DIFÍCIL: "#c87060",
  EXPERTO: "#c05050",
};

export default function CasesPage({ onSelectCase, onBack, sound }) {
  const solved = getSolvedCases();

  return (
    <div className="cases-page">
      <div className="cases-header">
        <button className="back-btn" onClick={() => { sound.playClick(); onBack(); }}>
          ← Volver
        </button>
        <div className="cases-header-center">
          <div className="page-eyebrow">SCOTLAND YARD — ARCHIVOS CLASIFICADOS</div>
          <h1 className="page-title">Expedientes Activos</h1>
        </div>
        <div className="progress-summary">
          <span className="solved-count">{solved.length}</span>
          <span className="solved-label">/ {CASES.length} resueltos</span>
        </div>
      </div>

      <div className="cases-grid">
        {CASES.map((c, i) => {
          const unlocked = isCaseUnlocked(c.id);
          const isSolved = solved.includes(c.id);

          return (
            <button
              key={c.id}
              className={`case-card ${!unlocked ? "locked" : ""} ${isSolved ? "solved" : ""}`}
              onClick={() => { if (unlocked) { sound.playClick(); onSelectCase(c.id); } }}
              style={{ animationDelay: `${i * 0.12}s` }}
              disabled={!unlocked}
            >
              <div className="case-card-inner">
                <div className="case-card-top">
                  <span className="case-number">CASO #{String(c.id).padStart(3, "0")}</span>
                  <div className="case-top-right">
                    {isSolved && <span className="solved-badge">✓ RESUELTO</span>}
                    <span
                      className="case-difficulty"
                      style={{ color: DIFFICULTY_COLOR[c.difficulty] || "#d4af70", borderColor: (DIFFICULTY_COLOR[c.difficulty] || "#d4af70") + "66" }}
                    >
                      {c.difficulty}
                    </span>
                  </div>
                </div>

                <h2 className="case-card-title">{c.title}</h2>
                <div className="case-card-subtitle">{c.subtitle}</div>
                <p className="case-card-tagline">{c.tagline}</p>

                <div className="case-card-divider" />

                <div className="case-card-stats">
                  <div className="stat">
                    <div className="stat-num">{c.suspects.length}</div>
                    <div className="stat-label">Sospechosos</div>
                  </div>
                  <div className="stat">
                    <div className="stat-num">{c.clues.length}</div>
                    <div className="stat-label">Pistas</div>
                  </div>
                  <div className="stat">
                    <div className="stat-num">1</div>
                    <div className="stat-label">Culpable</div>
                  </div>
                </div>

                {unlocked ? (
                  <div className="case-card-cta">
                    <span>{isSolved ? "Jugar de nuevo" : "Abrir expediente"}</span>
                    <span>→</span>
                  </div>
                ) : (
                  <div className="case-locked-msg">
                    🔒 Resuelve el caso anterior para desbloquear
                  </div>
                )}
              </div>

              {/* Corner decorations */}
              <div className="corner-tl" />
              <div className="corner-br" />

              {/* Lock overlay */}
              {!unlocked && <div className="lock-overlay"><span className="lock-icon">🔒</span></div>}
            </button>
          );
        })}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,500;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .cases-page {
          min-height: 100vh;
          background: #0d0d14;
          padding: 0 0 60px;
          font-family: 'Cinzel', serif;
        }

        .cases-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 48px;
          border-bottom: 1px solid #1e1e2e;
          position: sticky;
          top: 0;
          background: rgba(13,13,20,0.96);
          backdrop-filter: blur(10px);
          z-index: 10;
        }

        .back-btn {
          font-family: 'Cinzel', serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          color: #5a6080;
          background: transparent;
          border: 1px solid #2a2a3a;
          padding: 8px 16px;
          cursor: pointer;
          transition: all 0.2s;
          border-radius: 2px;
          white-space: nowrap;
        }
        .back-btn:hover { color: #d4af70; border-color: #d4af70; }

        .cases-header-center { text-align: center; }
        .page-eyebrow { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.35em; color: #3a3a5a; text-transform: uppercase; margin-bottom: 6px; }
        .page-title { font-family: 'Cinzel', serif; font-size: 22px; font-weight: 700; color: #f0e0c0; letter-spacing: 0.08em; }

        .progress-summary { text-align: right; white-space: nowrap; }
        .solved-count { font-family: 'Cinzel', serif; font-size: 28px; font-weight: 700; color: #d4af70; }
        .solved-label { font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.15em; color: #3a3a5a; margin-left: 4px; }

        .cases-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 28px;
          padding: 48px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .case-card {
          position: relative;
          background: transparent;
          border: 1px solid #2a2a3a;
          cursor: pointer;
          text-align: left;
          transition: all 0.3s ease;
          animation: fadeUp 0.5s ease both;
          overflow: hidden;
        }
        .case-card:hover:not(.locked) {
          border-color: #d4af70;
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(212,175,112,0.08);
        }
        .case-card.solved { border-color: #2a3a2a; }
        .case-card.solved:hover { border-color: #5a9a5a; }
        .case-card.locked { cursor: not-allowed; opacity: 0.45; }

        .case-card-inner { padding: 32px; position: relative; z-index: 2; }

        .case-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .case-number { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.3em; color: #4a4a6a; }
        .case-top-right { display: flex; align-items: center; gap: 10px; }
        .solved-badge { font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.2em; color: #5a9a5a; border: 1px solid #2a5a2a; padding: 3px 8px; border-radius: 1px; }
        .case-difficulty { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.2em; padding: 4px 10px; border: 1px solid; border-radius: 1px; }

        .case-card-title { font-family: 'Cinzel', serif; font-size: 22px; font-weight: 700; color: #f0e0c0; letter-spacing: 0.04em; margin-bottom: 6px; line-height: 1.2; }
        .case-card-subtitle { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.25em; color: #5a6080; margin-bottom: 18px; text-transform: uppercase; }
        .case-card-tagline { font-family: 'Cormorant Garamond', serif; font-size: 16px; font-style: italic; font-weight: 300; color: #9898b8; line-height: 1.7; margin-bottom: 24px; }
        .case-card-divider { height: 1px; background: linear-gradient(90deg, transparent, #2a2a3a, transparent); margin-bottom: 20px; }

        .case-card-stats { display: flex; gap: 24px; margin-bottom: 28px; }
        .stat { text-align: center; }
        .stat-num { font-family: 'Cinzel', serif; font-size: 26px; font-weight: 700; color: #d4af70; line-height: 1; }
        .stat-label { font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.15em; color: #4a4a6a; text-transform: uppercase; margin-top: 4px; }

        .case-card-cta { display: flex; justify-content: space-between; font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.2em; color: #d4af70; padding-top: 16px; border-top: 1px solid #1a1a2a; text-transform: uppercase; }
        .case-locked-msg { font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.1em; color: #3a3a5a; padding-top: 16px; border-top: 1px solid #1a1a2a; text-align: center; }

        .corner-tl, .corner-br { position: absolute; width: 16px; height: 16px; border-color: #d4af70; border-style: solid; opacity: 0; transition: opacity 0.3s; }
        .corner-tl { top: 8px; left: 8px; border-width: 1px 0 0 1px; }
        .corner-br { bottom: 8px; right: 8px; border-width: 0 1px 1px 0; }
        .case-card:hover:not(.locked) .corner-tl,
        .case-card:hover:not(.locked) .corner-br { opacity: 1; }

        .lock-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(13,13,20,0.6); z-index: 10; }
        .lock-icon { font-size: 40px; opacity: 0.5; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 600px) {
          .cases-header { padding: 20px 20px; }
          .cases-grid { padding: 24px 20px; grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
