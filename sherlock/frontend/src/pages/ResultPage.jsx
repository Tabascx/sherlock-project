import { useEffect } from "react";
import { markCaseSolved, CASES, isCaseUnlocked } from "../data/cases";

export default function ResultPage({ result, onReplay, onCases, onMenu, sound }) {
  const { win, suspect, caseData, stats } = result;
  const guilty = caseData.suspects.find((s) => s.guilty);
  const nextCase = CASES.find((c) => c.id === caseData.id + 1);
  const nextUnlocked = nextCase && isCaseUnlocked(nextCase.id);

  useEffect(() => {
    if (win) {
      sound.playWin();
      markCaseSolved(caseData.id);
      if (sound.setTheme) sound.setTheme("resolve");
    } else {
      sound.playLose();
      if (sound.setTheme) sound.setTheme("tension");
    }
    return () => { if (sound.setTheme) sound.setTheme("main"); };
  }, []);

  return (
    <div className={`result-page ${win ? "win" : "lose"}`}>
      <div className="result-bg" />
      <div className="vignette" />

      <div className="result-content">
        <div className="result-icon">{win ? "⚖️" : "💀"}</div>
        <div className="result-status">{win ? "CASO RESUELTO" : "CASO FALLIDO"}</div>
        <h1 className="result-headline">
          {win ? "Ha deducido correctamente." : "Su acusación fue incorrecta."}
        </h1>

        <div className="result-divider">
          <span className="div-line" /><span className="div-diamond">◆</span><span className="div-line" />
        </div>

        <div className="result-card">
          <div className="result-card-header">
            <div className="guilty-avatar">{guilty.name.split(" ").map((n) => n[0]).join("")}</div>
            <div>
              <div className="guilty-label">{win ? "EL CULPABLE ERA" : "EL VERDADERO CULPABLE"}</div>
              <div className="guilty-name">{guilty.name}</div>
              <div className="guilty-role">{guilty.profession}</div>
            </div>
          </div>
          <div className="result-divider-sm" />
          <p className="result-explanation">{caseData.solution.explanation}</p>

          {!win && (
            <div className="wrong-box">
              <div className="wrong-label">SU ACUSACIÓN</div>
              <p className="wrong-text">Acusó a <strong>{suspect.name}</strong>. {suspect.motive}</p>
            </div>
          )}

          {win && nextCase && !nextUnlocked && (
            <div className="unlock-box">
              <div className="unlock-label">🔓 NUEVO CASO DESBLOQUEADO</div>
              <div className="unlock-title">{nextCase.title}</div>
              <div className="unlock-sub">{nextCase.subtitle} — {nextCase.difficulty}</div>
            </div>
          )}
        </div>

        <div className="result-stats">
          {[
            { n: `${stats.foundClues}/${stats.total.clues}`, l: "Pistas examinadas" },
            { n: `${stats.interviewed}/${stats.total.suspects}`, l: "Interrogados" },
            { n: `${stats.progress}%`, l: "Investigación" },
          ].map((s) => (
            <div key={s.l} className="stat-box">
              <div className="stat-n">{s.n}</div>
              <div className="stat-l">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="result-actions">
          <button className="result-btn secondary" onClick={onMenu}>Menú principal</button>
          <button className="result-btn secondary" onClick={onCases}>Ver casos</button>
          <button className="result-btn primary" onClick={onReplay}>Reintentar →</button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .result-page {
          min-height: 100vh;
          background: #0d0d14;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cinzel', serif;
          position: relative;
          padding: 40px 24px;
          overflow-y: auto;
        }
        .result-bg { position: fixed; inset: 0; pointer-events: none; }
        .win .result-bg { background: radial-gradient(ellipse at center top, rgba(80,140,60,0.07) 0%, transparent 60%); }
        .lose .result-bg { background: radial-gradient(ellipse at center top, rgba(160,50,30,0.09) 0%, transparent 60%); }
        .vignette { position: fixed; inset: 0; background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.82) 100%); pointer-events: none; }

        .result-content {
          position: relative; z-index: 5;
          display: flex; flex-direction: column; align-items: center;
          max-width: 680px; width: 100%; text-align: center;
          animation: fadeUp 0.6s ease;
        }

        .result-icon { font-size: 60px; margin-bottom: 24px; filter: drop-shadow(0 0 30px rgba(212,175,112,0.35)); }
        .result-status { font-family: 'Cinzel', serif; font-size: 11px; font-weight: 700; letter-spacing: 0.5em; margin-bottom: 14px; }
        .win .result-status { color: #5a9a5a; }
        .lose .result-status { color: #c05050; }
        .result-headline { font-family: 'Cinzel', serif; font-size: clamp(22px, 4vw, 34px); font-weight: 700; color: #f0e0c0; letter-spacing: 0.04em; line-height: 1.3; margin-bottom: 28px; }

        .result-divider { display: flex; align-items: center; gap: 16px; width: 280px; margin-bottom: 36px; }
        .div-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, #d4af70, transparent); }
        .div-diamond { font-size: 7px; color: #d4af70; }

        .result-card { background: #0f0f1a; border: 1px solid #2a2a3a; border-radius: 3px; padding: 32px 36px; width: 100%; margin-bottom: 32px; text-align: left; }
        .result-card-header { display: flex; gap: 20px; align-items: center; }
        .guilty-avatar { width: 56px; height: 56px; border-radius: 50%; background: #1a1a2a; border: 1px solid #3a3a5a; display: flex; align-items: center; justify-content: center; font-family: 'Cinzel', serif; font-size: 16px; font-weight: 700; color: #9898b8; flex-shrink: 0; }
        .guilty-label { font-size: 8px; letter-spacing: 0.3em; color: #4a4a6a; text-transform: uppercase; margin-bottom: 6px; }
        .guilty-name { font-family: 'Cinzel', serif; font-size: 20px; font-weight: 700; color: #d4af70; margin-bottom: 4px; }
        .guilty-role { font-family: 'Cormorant Garamond', serif; font-size: 15px; color: #5a5a7a; }
        .result-divider-sm { height: 1px; background: linear-gradient(90deg, transparent, #2a2a3a, transparent); margin: 24px 0; }
        .result-explanation { font-family: 'Cormorant Garamond', serif; font-size: 17px; color: #9898b8; line-height: 2; }

        .wrong-box { margin-top: 20px; padding: 16px 20px; background: rgba(160,50,30,0.08); border: 1px solid #4a2a1a; border-radius: 2px; }
        .wrong-label { font-size: 8px; letter-spacing: 0.3em; color: #8a4a3a; margin-bottom: 8px; }
        .wrong-text { font-family: 'Cormorant Garamond', serif; font-size: 16px; color: #8a6a5a; line-height: 1.7; }
        .wrong-text strong { color: #c87060; }

        .unlock-box { margin-top: 20px; padding: 18px 22px; background: rgba(80,140,60,0.08); border: 1px solid #2a4a2a; border-radius: 2px; }
        .unlock-label { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.3em; color: #5a9a5a; margin-bottom: 8px; font-weight: 700; }
        .unlock-title { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 700; color: #d4af70; margin-bottom: 4px; }
        .unlock-sub { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.2em; color: #4a6a4a; }

        .result-stats { display: flex; gap: 16px; margin-bottom: 36px; flex-wrap: wrap; justify-content: center; }
        .stat-box { padding: 16px 22px; border: 1px solid #1e1e2e; border-radius: 2px; background: #0f0f1a; text-align: center; min-width: 110px; }
        .stat-n { font-family: 'Cinzel', serif; font-size: 24px; font-weight: 700; color: #d4af70; line-height: 1; }
        .stat-l { font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.15em; color: #4a4a6a; text-transform: uppercase; margin-top: 6px; }

        .result-actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
        .result-btn { padding: 13px 28px; font-family: 'Cinzel', serif; font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; transition: all 0.25s; border-radius: 2px; }
        .result-btn.secondary { background: transparent; border: 1px solid #2a2a3a; color: #5a5a7a; }
        .result-btn.secondary:hover { border-color: #5a5a7a; color: #9898b8; }
        .result-btn.primary { background: transparent; border: 1px solid #d4af70; color: #d4af70; }
        .result-btn.primary:hover { background: #d4af70; color: #0d0d14; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
