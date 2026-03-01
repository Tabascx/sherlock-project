# 🎩 Sherlock Deduction Engine

> Victorian crime investigation game. Full-stack web application.
> Backend: FastAPI · Frontend: React + Vite · Deploy: Render + Vercel

---

## 📁 Project Structure

```
sherlock/
├── backend/                    ← FastAPI API
│   ├── main.py                 ← App entry point + CORS + lifespan
│   ├── requirements.txt
│   └── app/
│       ├── core/
│       │   ├── config.py       ← Settings (env vars, CORS origins)
│       │   └── database.py     ← SQLAlchemy engine + seed data
│       ├── models/
│       │   └── models.py       ← Case, Suspect, Clue, GameSession
│       ├── schemas/
│       │   └── schemas.py      ← Pydantic schemas (request/response)
│       ├── services/
│       │   └── game_logic.py   ← Contradiction engine + accusation eval
│       ├── repositories/
│       │   └── repositories.py ← Data access layer
│       └── api/
│           └── routes.py       ← All API endpoints
│
└── frontend/                   ← React + Vite
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx            ← React entry point
        ├── App.jsx             ← Page router
        ├── data/
        │   └── cases.js        ← Local case data (used while offline)
        ├── hooks/
        │   └── useSoundManager.js  ← Web Audio API: ambient + SFX
        ├── services/
        │   └── api.js          ← Fetch wrapper for FastAPI
        └── pages/
            ├── HomePage.jsx    ← Landing screen with cinematic intro
            ├── CasesPage.jsx   ← Case selection grid
            ├── GamePage.jsx    ← Main investigation interface
            └── ResultPage.jsx  ← Win/lose reveal screen
```

---

## 🚀 Local Development

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/cases` | List all cases |
| GET | `/api/v1/cases/{id}` | Get full case detail |
| GET | `/api/v1/cases/{id}/contradictions` | Contradiction engine output |
| POST | `/api/v1/sessions` | Start new game session |
| GET | `/api/v1/sessions/{id}` | Get session state |
| POST | `/api/v1/sessions/{id}/clues/{clue_id}` | Mark clue as examined |
| POST | `/api/v1/sessions/{id}/suspects/{suspect_id}` | Mark suspect as interviewed |
| POST | `/api/v1/sessions/{id}/accuse` | Make formal accusation |

---

## 🧠 Architecture Highlights (CV-ready)

- **Clean Architecture**: models → repositories → services → routes
- **Rule-Based Contradiction Engine**: `game_logic.py` detects inconsistencies between suspect alibis and physical evidence
- **Entity Relational Model**: Case → Suspects + Clues, Sessions track player state
- **Security**: guilty field never exposed to frontend via public schemas
- **Dual storage**: SQLite locally, PostgreSQL on Render
- **Web Audio API**: procedurally generated Victorian ambient sound (no external files)

---

## ☁️ Deployment

### Backend → Render

1. Push to GitHub
2. New Web Service on Render
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add env var: `DATABASE_URL` = your PostgreSQL connection string

### Frontend → Vercel

1. Push to GitHub
2. Import project on Vercel
3. Root directory: `frontend`
4. Build: `npm run build`, Output: `dist`
5. Add env var: `VITE_API_URL` = your Render backend URL

---

## 🎮 Cases

| # | Title | Suspects | Clues | Difficulty |
|---|-------|----------|-------|------------|
| 1 | Sombras en Whitechapel | 4 | 10 | MODERADO |
| 2 | La Bestia de Mayfair | — | — | DIFÍCIL (próximo) |

---

## 📄 CV Description

> **Sherlock Deduction Engine** — Full Stack Web Application  
> Designed and implemented a RESTful API with FastAPI following Clean Architecture principles.  
> Modeled a rule-based deduction system with relational entities (cases, suspects, clues, sessions).  
> Built a contradiction detection engine to evaluate suspect alibis against physical evidence.  
> Developed an immersive Victorian-themed React frontend with procedural Web Audio ambient sound.  
> Deployed backend on Render (PostgreSQL) and frontend on Vercel.
