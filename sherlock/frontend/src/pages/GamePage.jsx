import { useState } from "react";
import { getCaseById } from "../data/cases";

const CAT_LABEL = { physical: "EVIDENCIA FÍSICA", document: "DOCUMENTO", testimony: "TESTIMONIO" };
const CAT_COLOR = { physical: "#c87941", document: "#7aaf6a", testimony: "#6a8abf" };

export default function GamePage({ caseId, onBack, onResult, sound }) {
  const caseData = getCaseById(caseId);
  const [tab, setTab] = useState("briefing");
  const [foundClues, setFoundClues] = useState([]);
  const [interviewed, setInterviewed] = useState([]);
  const [selectedClue, setSelectedClue] = useState(null);
  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [showAccuse, setShowAccuse] = useState(false);
  const [accuseTarget, setAccuseTarget] = useState(null);
  const [notes, setNotes] = useState([]);

  if (!caseData) return null;

  const progress = Math.round(
    ((foundClues.length + interviewed.length) / (caseData.clues.length + caseData.suspects.length)) * 100
  );

  const examineClue = (clue) => {
    sound.playReveal();
    if (!foundClues.includes(clue.id)) {
      setFoundClues((p) => [...p, clue.id]);
      setNotes((p) => [...p, { icon: "🔎", text: `Pista examinada: "${clue.name}"`, time: now() }]);
    }
    setSelectedClue(clue);
    setSelectedSuspect(null);
  };

  const interviewSuspect = (s) => {
    if (sound.setTheme) sound.setTheme("tension");
    sound.playReveal();
    if (!interviewed.includes(s.id)) {
      setInterviewed((p) => [...p, s.id]);
      setNotes((p) => [...p, { icon: "👤", text: `Interrogatorio: ${s.name}`, time: now() }]);
    }
    setSelectedSuspect(s);
    setSelectedClue(null);
  };

  const handleAccuse = () => {
    if (!accuseTarget) return;
    const suspect = caseData.suspects.find((s) => s.id === accuseTarget);
    sound.playClick();
    onResult({ win: suspect.guilty, suspect, caseData, stats: { foundClues: foundClues.length, interviewed: interviewed.length, total: { clues: caseData.clues.length, suspects: caseData.suspects.length }, progress } });
  };

  const switchTab = (t) => { sound.playClick(); setTab(t); setSelectedClue(null); setSelectedSuspect(null); };

  return (
    <div className="game-shell">
      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">🎩</span>
          <div>
            <div className="brand-name">V.D.E.</div>
            <div className="brand-sub">Deduction Engine</div>
          </div>
        </div>

        <button className="back-link" onClick={() => { sound.playClick(); onBack(); }}>← Casos</button>

        {/* Progress */}
        <div className="progress-block">
          <div className="progress-header">
            <span className="progress-label">INVESTIGACIÓN</span>
            <span className="progress-pct">{progress}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {[
            { key: "briefing", icon: "📋", label: "Expediente" },
            { key: "clues", icon: "🔎", label: "Pistas", count: `${foundClues.length}/${caseData.clues.length}` },
            { key: "suspects", icon: "👤", label: "Sospechosos", count: `${interviewed.length}/${caseData.suspects.length}` },
            { key: "notes", icon: "📓", label: "Cuaderno", count: notes.length > 0 ? notes.length : null },
          ].map((item) => (
            <button key={item.key} className={`nav-item ${tab === item.key ? "active" : ""}`} onClick={() => switchTab(item.key)}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.count != null && <span className="nav-count">{item.count}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-spacer" />

        <button className="accuse-btn" onClick={() => { sound.playClick(); setShowAccuse(true); }}>
          ⚖️ REALIZAR ACUSACIÓN
        </button>
      </aside>

      {/* ── MAIN ── */}
      <main className="game-main">
        <header className="game-header">
          <div>
            <div className="game-header-eyebrow">{caseData.subtitle}</div>
            <h1 className="game-header-title">{caseData.title}</h1>
          </div>
          <div className="case-status-badge">CASO ABIERTO</div>
        </header>

        <div className="game-content">

          {/* ── BRIEFING ── */}
          {tab === "briefing" && (
            <div className="tab-content">
              <div className="section-label">INFORME DEL INSPECTOR LESTRADE</div>
              <div className="card">
                <p className="brief-text">{caseData.description}</p>
                <div className="card-divider" />
                <div className="victim-grid">
                  {[
                    { l: "VÍCTIMA", v: caseData.victim.name, s: `${caseData.victim.age} años — ${caseData.victim.profession}` },
                    { l: "UBICACIÓN", v: caseData.victim.location, s: caseData.subtitle },
                    { l: "HORA DEL CRIMEN", v: caseData.victim.time_of_death, s: "Según reloj detenido" },
                    { l: "CAUSA DE MUERTE", v: caseData.victim.cause, s: "Informe forense pendiente" },
                  ].map((item) => (
                    <div key={item.l} className="victim-cell">
                      <div className="victim-label">{item.l}</div>
                      <div className="victim-val">{item.v}</div>
                      <div className="victim-sub">{item.s}</div>
                    </div>
                  ))}
                </div>
                <div className="card-divider" />
                <div className="instruction-box">
                  <div className="instruction-title">📜 Instrucciones del detective</div>
                  <p className="instruction-text">
                    Examine cada pista minuciosamente. Interrogue a todos los sospechosos. Busque
                    <strong> contradicciones</strong> entre coartadas y evidencia física. Cuando esté listo,
                    realice su acusación — pero tenga en cuenta:{" "}
                    <em>una acusación errónea cerrará el caso permanentemente.</em>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── CLUES LIST ── */}
          {tab === "clues" && !selectedClue && (
            <div className="tab-content">
              <div className="section-label">EVIDENCIAS DEL CASO — {caseData.clues.length} REGISTRADAS</div>
              <div className="clues-grid">
                {caseData.clues.map((clue) => {
                  const found = foundClues.includes(clue.id);
                  return (
                    <button key={clue.id} className={`clue-card ${found ? "found" : ""}`} onClick={() => examineClue(clue)}>
                      <div className="clue-card-top">
                        <span className="cat-badge" style={{ color: CAT_COLOR[clue.category], borderColor: CAT_COLOR[clue.category] + "55", background: CAT_COLOR[clue.category] + "15" }}>
                          {CAT_LABEL[clue.category]}
                        </span>
                        {found && <span className="found-indicator">✓ EXAMINADA</span>}
                      </div>
                      <div className="clue-name">{clue.name}</div>
                      <div className="clue-preview">
                        {found ? clue.description.slice(0, 90) + "…" : "Haga clic para examinar esta evidencia"}
                      </div>
                      <div className="clue-timestamp">{clue.timestamp}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── CLUE DETAIL ── */}
          {tab === "clues" && selectedClue && (
            <div className="tab-content">
              <button className="breadcrumb-btn" onClick={() => setSelectedClue(null)}>← Volver a pistas</button>
              <div className="section-label">EXAMINANDO EVIDENCIA</div>
              <div className="card detail-card">
                <span className="cat-badge" style={{ color: CAT_COLOR[selectedClue.category], borderColor: CAT_COLOR[selectedClue.category] + "55", background: CAT_COLOR[selectedClue.category] + "15", fontSize: 10 }}>
                  {CAT_LABEL[selectedClue.category]}
                </span>
                <h2 className="detail-title">{selectedClue.name}</h2>
                <div className="detail-meta">⏱ {selectedClue.timestamp}</div>
                <div className="card-divider" />
                <p className="detail-body">{selectedClue.description}</p>
                {selectedClue.suspect_link && (
                  <div className="link-note">
                    🔗 <strong>Nota del detective:</strong> Esta evidencia parece estar relacionada con uno de los sospechosos. Considere interrogar al respecto.
                  </div>
                )}
                {selectedClue.is_misleading && (
                  <div className="mislead-note">
                    ⚠️ <strong>Nota forense:</strong> Esta pista requiere análisis cuidadoso. Las apariencias pueden engañar.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── SUSPECTS LIST ── */}
          {tab === "suspects" && !selectedSuspect && (
            <div className="tab-content">
              <div className="section-label">SOSPECHOSOS IDENTIFICADOS — {caseData.suspects.length} PERSONAS</div>
              <div className="suspects-list">
                {caseData.suspects.map((s) => {
                  const done = interviewed.includes(s.id);
                  return (
                    <button key={s.id} className={`suspect-card ${done ? "interviewed" : ""}`} onClick={() => interviewSuspect(s)}>
                      <div className="suspect-avatar">
                        {s.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="suspect-info">
                        <div className="suspect-name">{s.name}</div>
                        <div className="suspect-role">{s.age} años — {s.profession}</div>
                        <div className="suspect-relation">{s.relation}</div>
                        <p className="suspect-desc">{s.description.slice(0, 110)}…</p>
                      </div>
                      <div className="suspect-arrow">{done ? "✓" : "→"}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── SUSPECT DETAIL ── */}
          {tab === "suspects" && selectedSuspect && (
            <div className="tab-content">
              <button className="breadcrumb-btn" onClick={() => setSelectedSuspect(null)}>← Volver a sospechosos</button>
              <div className="section-label">INTERROGATORIO EN CURSO</div>
              <div className="card detail-card">
                <div className="interrogation-header">
                  <div className="interrogation-avatar">
                    {selectedSuspect.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h2 className="detail-title" style={{ marginBottom: 6 }}>{selectedSuspect.name}</h2>
                    <div className="detail-meta">{selectedSuspect.age} años — {selectedSuspect.profession}</div>
                    <div className="detail-meta" style={{ marginTop: 4 }}>{selectedSuspect.relation}</div>
                  </div>
                </div>
                <div className="card-divider" />
                <div className="suspect-detail-grid">
                  {[
                    { label: "DESCRIPCIÓN PERSONAL", val: selectedSuspect.description },
                    { label: "COARTADA DECLARADA", val: selectedSuspect.alibi },
                    { label: "MOTIVO POSIBLE", val: selectedSuspect.motive },
                    { label: "COMPORTAMIENTO OBSERVADO", val: selectedSuspect.personality },
                    { label: "DETALLE AMBIGUO", val: selectedSuspect.ambiguity },
                  ].map((item) => (
                    <div key={item.label} className="suspect-field">
                      <div className="suspect-field-label">{item.label}</div>
                      <p className="suspect-field-val">{item.val}</p>
                    </div>
                  ))}
                </div>
                <div className="card-divider" />
                <div className="dialogue-box">
                  <div className="dialogue-label">RESPUESTA AL INTERROGATORIO</div>
                  <p className="dialogue-text">{selectedSuspect.interview}</p>
                </div>
              </div>
            </div>
          )}

          {/* ── NOTES ── */}
          {tab === "notes" && (
            <div className="tab-content">
              <div className="section-label">CUADERNO DEL DETECTIVE</div>
              {notes.length === 0 ? (
                <div className="empty-notes">
                  <p>Ninguna anotación aún.<br />Examine pistas e interrogue sospechosos para registrar su progreso.</p>
                </div>
              ) : (
                <div className="notes-list">
                  {notes.map((n, i) => (
                    <div key={i} className="note-entry">
                      <span className="note-icon">{n.icon}</span>
                      <span className="note-text">{n.text}</span>
                      <span className="note-time">{n.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ── ACCUSE MODAL ── */}
      {showAccuse && (
        <div className="modal-overlay" onClick={() => setShowAccuse(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-warning-bar">
              ⚠️ ADVERTENCIA — ACCIÓN IRREVERSIBLE
            </div>
            <h3 className="modal-title">Una acusación errónea cerrará el caso permanentemente.</h3>
            <p className="modal-sub">
              Seleccione al sospechoso que considera culpable del asesinato de <strong>{caseData.victim.name}</strong>.
            </p>
            <div className="modal-suspects">
              {caseData.suspects.map((s) => (
                <button
                  key={s.id}
                  className={`modal-suspect ${accuseTarget === s.id ? "selected" : ""}`}
                  onClick={() => setAccuseTarget(s.id)}
                >
                  <div className="modal-suspect-init">
                    {s.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="modal-suspect-info">
                    <div className="modal-suspect-name">{s.name}</div>
                    <div className="modal-suspect-role">{s.profession}</div>
                  </div>
                  {accuseTarget === s.id && <span className="modal-check">✓</span>}
                </button>
              ))}
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => { setShowAccuse(false); setAccuseTarget(null); }}>
                Cancelar
              </button>
              <button
                className={`modal-confirm ${!accuseTarget ? "disabled" : ""}`}
                onClick={handleAccuse}
                disabled={!accuseTarget}
              >
                ACUSAR FORMALMENTE
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,300;1,500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .game-shell {
          display: flex;
          min-height: 100vh;
          background: #0d0d14;
          font-family: 'Cinzel', serif;
          color: #e8dcc8;
        }

        /* ── SIDEBAR ── */
        .sidebar {
          width: 260px;
          flex-shrink: 0;
          background: #09090f;
          border-right: 1px solid #1e1e2e;
          display: flex;
          flex-direction: column;
          padding: 28px 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 0 24px 24px;
          border-bottom: 1px solid #1e1e2e;
          margin-bottom: 16px;
        }
        .brand-icon { font-size: 28px; }
        .brand-name {
          font-family: 'Cinzel', serif;
          font-size: 18px;
          font-weight: 700;
          color: #d4af70;
          letter-spacing: 0.1em;
        }
        .brand-sub {
          font-family: 'Cinzel', serif;
          font-size: 8px;
          letter-spacing: 0.25em;
          color: #3a3a5a;
          text-transform: uppercase;
          margin-top: 2px;
        }

        .back-link {
          font-family: 'Cinzel', serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #4a4a6a;
          background: transparent;
          border: none;
          padding: 8px 24px;
          cursor: pointer;
          text-align: left;
          transition: color 0.2s;
          margin-bottom: 12px;
        }
        .back-link:hover { color: #d4af70; }

        .progress-block { padding: 16px 24px; border-bottom: 1px solid #1a1a28; margin-bottom: 8px; }
        .progress-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .progress-label { font-size: 8px; letter-spacing: 0.3em; color: #3a3a5a; }
        .progress-pct { font-size: 10px; color: #d4af70; font-weight: 700; }
        .progress-track { height: 2px; background: #1e1e2e; border-radius: 1px; }
        .progress-bar { height: 100%; background: linear-gradient(90deg, #8a6a2a, #d4af70); border-radius: 1px; transition: width 0.6s ease; }

        .sidebar-nav { display: flex; flex-direction: column; padding: 8px 0; }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          background: transparent;
          border: none;
          color: #4a4a6a;
          font-family: 'Cinzel', serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          border-left: 2px solid transparent;
        }
        .nav-item:hover { color: #9898b8; }
        .nav-item.active { color: #d4af70; border-left-color: #d4af70; background: linear-gradient(90deg, rgba(212,175,112,0.08), transparent); }
        .nav-icon { font-size: 14px; width: 18px; text-align: center; }
        .nav-label { flex: 1; }
        .nav-count { font-size: 10px; color: #5a5a7a; }
        .nav-item.active .nav-count { color: #d4af70; }

        .sidebar-spacer { flex: 1; }

        .accuse-btn {
          margin: 16px;
          padding: 14px 16px;
          background: transparent;
          border: 1px solid #8a3a2a;
          color: #d07060;
          font-family: 'Cinzel', serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          cursor: pointer;
          transition: all 0.25s;
          border-radius: 2px;
        }
        .accuse-btn:hover { background: rgba(208,112,96,0.1); border-color: #d07060; box-shadow: 0 0 20px rgba(208,112,96,0.15); }

        /* ── MAIN ── */
        .game-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 28px 48px 22px;
          border-bottom: 1px solid #1e1e2e;
          position: sticky;
          top: 0;
          background: rgba(13,13,20,0.96);
          backdrop-filter: blur(10px);
          z-index: 5;
        }
        .game-header-eyebrow { font-size: 9px; letter-spacing: 0.3em; color: #3a3a5a; text-transform: uppercase; margin-bottom: 6px; }
        .game-header-title { font-size: 26px; font-weight: 700; color: #f0e0c0; letter-spacing: 0.05em; }
        .case-status-badge { padding: 6px 14px; border: 1px solid #2a5a2a; color: #5a9a5a; font-size: 9px; letter-spacing: 0.25em; border-radius: 2px; margin-top: 6px; }

        .game-content { flex: 1; padding: 40px 48px; overflow-y: auto; }
        .tab-content { animation: fadeUp 0.3s ease; }

        .section-label {
          font-size: 9px;
          letter-spacing: 0.35em;
          color: #3a3a5a;
          text-transform: uppercase;
          margin-bottom: 24px;
          padding-bottom: 12px;
          border-bottom: 1px solid #1a1a28;
        }

        /* ── CARDS ── */
        .card {
          background: #0f0f1a;
          border: 1px solid #1e1e2e;
          border-radius: 3px;
          padding: 36px 40px;
        }

        .brief-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 19px;
          font-style: italic;
          font-weight: 400;
          color: #c8c0d8;
          line-height: 2;
        }

        .card-divider { height: 1px; background: linear-gradient(90deg, transparent, #2a2a3a, transparent); margin: 28px 0; }

        .victim-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .victim-cell { padding: 16px 0; }
        .victim-label { font-size: 8px; letter-spacing: 0.3em; color: #3a3a5a; text-transform: uppercase; margin-bottom: 8px; }
        .victim-val { font-family: 'Cinzel', serif; font-size: 16px; font-weight: 600; color: #f0e0c0; margin-bottom: 4px; }
        .victim-sub { font-family: 'Cormorant Garamond', serif; font-size: 14px; color: #5a5a7a; }

        .instruction-box { background: #0a0a12; border: 1px solid #2a2a3a; border-left: 3px solid #d4af70; padding: 20px 24px; border-radius: 0 2px 2px 0; }
        .instruction-title { font-family: 'Cinzel', serif; font-size: 12px; font-weight: 700; color: #d4af70; letter-spacing: 0.1em; margin-bottom: 10px; }
        .instruction-text { font-family: 'Cormorant Garamond', serif; font-size: 16px; color: #7a7a9a; line-height: 1.9; }
        .instruction-text strong { color: #c8c0d8; font-weight: 600; }
        .instruction-text em { color: #c8785a; font-style: italic; }

        /* ── CLUES ── */
        .clues-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }

        .clue-card {
          background: #0f0f1a;
          border: 1px solid #1e1e2e;
          border-radius: 3px;
          padding: 22px;
          text-align: left;
          cursor: pointer;
          transition: all 0.25s;
        }
        .clue-card:hover { border-color: #3a3a5a; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.4); }
        .clue-card.found { border-color: #2a2a3a; background: #111118; }

        .clue-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .cat-badge { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.15em; padding: 3px 9px; border: 1px solid; border-radius: 1px; }
        .found-indicator { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.1em; color: #5a9a5a; }

        .clue-name { font-family: 'Cinzel', serif; font-size: 15px; font-weight: 700; color: #d4af70; margin-bottom: 10px; line-height: 1.3; }
        .clue-preview { font-family: 'Cormorant Garamond', serif; font-size: 14px; color: #5a5a7a; line-height: 1.7; margin-bottom: 12px; }
        .clue-timestamp { font-size: 9px; letter-spacing: 0.1em; color: #3a3a5a; }

        /* Detail */
        .detail-card { }
        .breadcrumb-btn { font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.15em; color: #5a5a7a; background: transparent; border: none; cursor: pointer; margin-bottom: 20px; transition: color 0.2s; padding: 0; }
        .breadcrumb-btn:hover { color: #d4af70; }
        .detail-title { font-family: 'Cinzel', serif; font-size: 24px; font-weight: 700; color: #f0e0c0; letter-spacing: 0.05em; margin: 12px 0 6px; line-height: 1.3; }
        .detail-meta { font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.15em; color: #4a4a6a; }
        .detail-body { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-style: italic; color: #c8c0d8; line-height: 2; }

        .link-note, .mislead-note {
          margin-top: 24px;
          padding: 14px 18px;
          background: #0a0a12;
          border: 1px solid #2a2a3a;
          border-radius: 2px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 15px;
          color: #7a7a9a;
          line-height: 1.7;
        }
        .link-note strong, .mislead-note strong { color: #d4af70; }
        .mislead-note { border-color: #3a2a1a; color: #8a6a5a; }

        /* ── SUSPECTS ── */
        .suspects-list { display: flex; flex-direction: column; gap: 14px; }

        .suspect-card {
          display: flex;
          align-items: center;
          gap: 22px;
          background: #0f0f1a;
          border: 1px solid #1e1e2e;
          border-radius: 3px;
          padding: 22px 26px;
          text-align: left;
          cursor: pointer;
          transition: all 0.25s;
        }
        .suspect-card:hover { border-color: #3a3a5a; transform: translateX(4px); }
        .suspect-card.interviewed { border-color: #2a2a3a; }

        .suspect-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #1a1a2a;
          border: 1px solid #2e2e48;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cinzel', serif;
          font-size: 14px;
          font-weight: 700;
          color: #7a7aaa;
          flex-shrink: 0;
        }
        .suspect-info { flex: 1; min-width: 0; }
        .suspect-name { font-family: 'Cinzel', serif; font-size: 17px; font-weight: 700; color: #d4af70; margin-bottom: 4px; }
        .suspect-role { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.2em; color: #4a4a6a; margin-bottom: 4px; }
        .suspect-relation { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.15em; color: #3a3a5a; margin-bottom: 8px; }
        .suspect-desc { font-family: 'Cormorant Garamond', serif; font-size: 15px; color: #5a5a7a; line-height: 1.6; }
        .suspect-arrow { font-size: 18px; color: #3a3a5a; font-family: 'Cinzel', serif; flex-shrink: 0; }
        .suspect-card.interviewed .suspect-arrow { color: #5a9a5a; }

        /* Suspect detail */
        .interrogation-header { display: flex; gap: 20px; align-items: flex-start; margin-bottom: 0; }
        .interrogation-avatar { width: 60px; height: 60px; border-radius: 50%; background: #1a1a2a; border: 1px solid #2e2e48; display: flex; align-items: center; justify-content: center; font-family: 'Cinzel', serif; font-size: 18px; font-weight: 700; color: #7a7aaa; flex-shrink: 0; }
        .suspect-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 0; }
        .suspect-field { padding: 0; }
        .suspect-field-label { font-size: 8px; letter-spacing: 0.3em; color: #3a3a5a; text-transform: uppercase; margin-bottom: 8px; }
        .suspect-field-val { font-family: 'Cormorant Garamond', serif; font-size: 16px; color: #9898b8; line-height: 1.8; }

        .dialogue-box { background: #0a0a12; border: 1px solid #2a2a3a; border-left: 3px solid #8a6a3a; padding: 22px 26px; border-radius: 0 2px 2px 0; }
        .dialogue-label { font-size: 8px; letter-spacing: 0.3em; color: #4a4a6a; text-transform: uppercase; margin-bottom: 12px; }
        .dialogue-text { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-style: italic; color: #c8c0d8; line-height: 2; }

        /* ── NOTES ── */
        .empty-notes { background: #0f0f1a; border: 1px dashed #1e1e2e; border-radius: 3px; padding: 60px; text-align: center; font-family: 'Cormorant Garamond', serif; font-size: 17px; font-style: italic; color: #3a3a5a; line-height: 1.8; }
        .notes-list { display: flex; flex-direction: column; gap: 10px; }
        .note-entry { display: flex; align-items: center; gap: 14px; background: #0f0f1a; border: 1px solid #1a1a28; border-radius: 2px; padding: 14px 18px; }
        .note-icon { font-size: 16px; }
        .note-text { flex: 1; font-family: 'Cormorant Garamond', serif; font-size: 15px; color: #7a7a9a; }
        .note-time { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.1em; color: #3a3a5a; flex-shrink: 0; }

        /* ── MODAL ── */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 24px; }
        .modal { background: #0d0d18; border: 1px solid #3a2a1a; border-radius: 4px; padding: 0; max-width: 520px; width: 100%; animation: fadeUp 0.3s ease; overflow: hidden; }

        .modal-warning-bar { background: rgba(208,112,96,0.15); border-bottom: 1px solid #4a2a1a; padding: 14px 32px; font-family: 'Cinzel', serif; font-size: 10px; font-weight: 700; letter-spacing: 0.3em; color: #d07060; text-align: center; }

        .modal-title { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 700; color: #f0e0c0; line-height: 1.4; padding: 28px 32px 10px; }
        .modal-sub { font-family: 'Cormorant Garamond', serif; font-size: 16px; color: #6a6a8a; padding: 0 32px 24px; line-height: 1.7; }
        .modal-sub strong { color: #c8c0d8; }

        .modal-suspects { display: flex; flex-direction: column; gap: 8px; padding: 0 32px 24px; }
        .modal-suspect { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border: 1px solid #1e1e2e; border-radius: 2px; background: #0a0a12; text-align: left; cursor: pointer; transition: all 0.15s; }
        .modal-suspect:hover { border-color: #3a3a5a; }
        .modal-suspect.selected { border-color: #8a6a3a; background: #131020; }
        .modal-suspect-init { width: 38px; height: 38px; border-radius: 50%; background: #1a1a2a; border: 1px solid #2a2a3a; display: flex; align-items: center; justify-content: center; font-family: 'Cinzel', serif; font-size: 12px; font-weight: 700; color: #7a7aaa; flex-shrink: 0; }
        .modal-suspect-name { font-family: 'Cinzel', serif; font-size: 14px; font-weight: 600; color: #e0d0b0; }
        .modal-suspect-role { font-family: 'Cormorant Garamond', serif; font-size: 13px; color: #5a5a7a; margin-top: 2px; }
        .modal-check { margin-left: auto; color: #d4af70; font-size: 16px; font-weight: 700; flex-shrink: 0; }

        .modal-actions { display: flex; gap: 0; border-top: 1px solid #1e1e2e; }
        .modal-cancel { flex: 1; padding: 16px; background: transparent; border: none; border-right: 1px solid #1e1e2e; color: #5a5a7a; font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.2em; cursor: pointer; transition: color 0.2s; }
        .modal-cancel:hover { color: #9898b8; }
        .modal-confirm { flex: 1; padding: 16px; background: transparent; border: none; color: #d07060; font-family: 'Cinzel', serif; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; cursor: pointer; transition: all 0.2s; }
        .modal-confirm:hover:not(.disabled) { background: rgba(208,112,96,0.1); }
        .modal-confirm.disabled { opacity: 0.3; cursor: not-allowed; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

        @media (max-width: 768px) {
          .sidebar { width: 220px; }
          .game-header { padding: 20px 24px; }
          .game-content { padding: 28px 24px; }
          .victim-grid { grid-template-columns: 1fr; }
          .suspect-detail-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

function now() {
  return new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}
