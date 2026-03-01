<div align="center">

# 🎩 Sherlock Deduction Engine

**A Victorian crime investigation game built as a full-stack web application.**

![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-red?style=flat-square)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)

*London, 1888. Three cases. One killer. No second chances.*

<div align="center">

# 🎩 Sherlock Deduction Engine

**[▶ Jugar ahora](https://sherlock-deduction-engine.vercel.app)** · **[API Docs](https://sherlock-api.onrender.com/docs)**

</div>

---

## What is this?

A browser-based deduction game set in Victorian London. The player investigates crime scenes, examines physical evidence, interrogates suspects, and makes a formal accusation — knowing that a wrong choice closes the case permanently.

The core of the project is a **rule-based contradiction engine**: the backend evaluates each suspect's declared alibi against physical evidence and testimony, detecting logical inconsistencies that guide the player toward the truth. The guilty field is never exposed to the client.

---

## Cases

| # | Title | Setting | Suspects | Difficulty |
|---|-------|---------|----------|------------|
| 1 | **Sombras en Whitechapel** | Whitechapel, 1888 | 4 | Moderate |
| 2 | **La Bestia de Mayfair** | Mayfair, 1889 | 5 | Hard |
| 3 | **El Veneno del Támesis** | Southwark, 1889 | 5 | Expert |

Cases unlock sequentially — the next case becomes available only after solving the current one. Progress is persisted in `localStorage`.

---

## Tech Stack

**Backend**
- FastAPI with clean architecture (models → repositories → services → routes)
- SQLAlchemy ORM — SQLite locally, PostgreSQL in production
- Pydantic schemas with separate public/internal models (the `guilty` flag is never serialized to the client)
- Alembic for database migrations

**Frontend**
- React 18 + Vite
- Zero UI libraries — all styles written from scratch with CSS-in-JS
- Web Audio API for procedurally generated Victorian ambient music: synthesized strings, piano, cello, rain, wind, and Westminster bell patterns — no audio files, no external dependencies
- Music theme changes dynamically based on game state (interrogation triggers tension mode, win triggers resolution mode)

---

## Project Structure

```text
sherlock/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── app/
│       ├── core/
│       │   ├── config.py
│       │   └── database.py
│       ├── models/
│       │   └── models.py
│       ├── schemas/
│       │   └── schemas.py
│       ├── services/
│       │   └── game_logic.py
│       ├── repositories/
│       └── api/
│           └── routes.py
│
└── frontend/
    └── src/
        ├── App.jsx
        ├── data/
        │   └── cases.js
        ├── hooks/
        │   └── useSoundManager.js
        ├── services/
        │   └── api.js
        └── pages/
            ├── HomePage.jsx
            ├── CasesPage.jsx
            ├── GamePage.jsx
            └── ResultPage.jsx
```
---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/cases` | List all cases |
| `GET` | `/api/v1/cases/{id}` | Full case detail (no guilty field) |
| `GET` | `/api/v1/cases/{id}/contradictions` | Contradiction engine output |
| `POST` | `/api/v1/sessions` | Start a new game session |
| `GET` | `/api/v1/sessions/{id}` | Current session state |
| `POST` | `/api/v1/sessions/{id}/clues/{clue_id}` | Mark clue as examined |
| `POST` | `/api/v1/sessions/{id}/suspects/{suspect_id}` | Mark suspect as interviewed |
| `POST` | `/api/v1/sessions/{id}/accuse` | Submit accusation → returns win/lose |

Interactive docs available at `/docs` when running locally.

---

## Running locally

**Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```
→ API running at `http://localhost:8000`

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
→ App running at `http://localhost:5173`

The backend seeds the database automatically on first startup.

---

## Deployment

**Backend → [Render](https://render.com)**
- Build: `pip install -r requirements.txt`
- Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Add env var: `DATABASE_URL` → PostgreSQL connection string from Render

**Frontend → [Vercel](https://vercel.com)**
- Root directory: `frontend`
- Build: `npm run build` / Output: `dist`
- Add env var: `VITE_API_URL` → your Render backend URL

---

## How the contradiction engine works

Each suspect has a declared alibi with a time and location. Each clue has a verified time and location derived from physical evidence. The `GameLogicService` in `game_logic.py` cross-references these:

```
Blackwell declares: Reform Club until midnight
Club register shows: departed at 21:15
→ contradiction flagged, severity: HIGH
```

This logic runs server-side and is exposed via `/api/v1/cases/{id}/contradictions`. The frontend never receives the `guilty` boolean — the player has to reach the conclusion through evidence alone.

---

<div align="center">
<sub>Built with FastAPI, React, and the Web Audio API · No external audio files · No UI component libraries</sub>
</div>

## Deployment

| Service | URL |
|---------|-----|
| Frontend | https://sherlock-deduction-engine.vercel.app |
| Backend API | https://sherlock-api.onrender.com |
| API Docs | https://sherlock-api.onrender.com/docs |
