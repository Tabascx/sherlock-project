import { useState } from "react";
import HomePage from "./pages/HomePage";
import CasesPage from "./pages/CasesPage";
import GamePage from "./pages/GamePage";
import ResultPage from "./pages/ResultPage";
import { useSoundManager } from "./hooks/useSoundManager";

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedCase, setSelectedCase] = useState(null);
  const [result, setResult] = useState(null);
  const sound = useSoundManager();

  const navigate = (to, data = {}) => {
    if (data.caseId !== undefined) setSelectedCase(data.caseId);
    if (data.result !== undefined) setResult(data.result);
    setPage(to);
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { min-height: 100vh; background: #0d0d14; }
        body { overflow-x: hidden; }
        button { cursor: pointer; font-family: inherit; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #09090f; }
        ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #3a3a5a; }
      `}</style>

      {page === "home" && (
        <HomePage onEnter={() => navigate("cases")} sound={sound} />
      )}
      {page === "cases" && (
        <CasesPage
          onSelectCase={(id) => navigate("game", { caseId: id })}
          onBack={() => navigate("home")}
          sound={sound}
        />
      )}
      {page === "game" && selectedCase !== null && (
        <GamePage
          caseId={selectedCase}
          onBack={() => navigate("cases")}
          onResult={(res) => navigate("result", { result: res })}
          sound={sound}
        />
      )}
      {page === "result" && result && (
        <ResultPage
          result={result}
          onReplay={() => navigate("game")}
          onCases={() => navigate("cases")}
          onMenu={() => navigate("home")}
          sound={sound}
        />
      )}
    </>
  );
}
