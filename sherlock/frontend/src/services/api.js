const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json();
}

export const api = {
  getCases: () => request("/cases"),
  getCase: (id) => request(`/cases/${id}`),
  createSession: (caseId) => request("/sessions", { method: "POST", body: JSON.stringify({ case_id: caseId }) }),
  examineClue: (sessionId, clueId) => request(`/sessions/${sessionId}/clues/${clueId}`, { method: "POST" }),
  interviewSuspect: (sessionId, suspectId) => request(`/sessions/${sessionId}/suspects/${suspectId}`, { method: "POST" }),
  accuse: (sessionId, suspectId) => request(`/sessions/${sessionId}/accuse`, { method: "POST", body: JSON.stringify({ suspect_id: suspectId }) }),
  getSession: (sessionId) => request(`/sessions/${sessionId}`),
};
