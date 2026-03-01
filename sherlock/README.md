# 🎩 Sherlock Deduction Engine

**A Victorian crime investigation game built as a full-stack web application.**

![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-red?style=flat-square)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)

*London, 1888. Three cases. One killer. No second chances.*

---

## ▶ Live Demo

- 🎮 **Play now:** https://sherlock-deduction-engine.vercel.app  
- 📘 **API Docs:** https://sherlock-api.onrender.com/docs  

---

## What is this?

Sherlock Deduction Engine is a browser-based deduction game set in Victorian London.

The player investigates crime scenes, examines physical evidence, interrogates suspects, and makes a formal accusation — knowing that a wrong choice closes the case permanently.

The core of the project is a **rule-based contradiction engine**. The backend evaluates each suspect's declared alibi against physical evidence and testimony, detecting logical inconsistencies that guide the player toward the truth.

The `guilty` field is never exposed to the client.

---

## Cases

| # | Title | Setting | Suspects | Difficulty |
|---|-------|---------|----------|------------|
| 1 | **Sombras en Whitechapel** | Whitechapel, 1888 | 4 | Moderate |
| 2 | **La Bestia de Mayfair** | Mayfair, 1889 | 5 | Hard |
| 3 | **El Veneno del Támesis** | Southwark, 1889 | 5 | Expert |

Cases unlock sequentially — the next case becomes available only after solving the current one.

Progress is persisted in `localStorage`.

---

## Tech Stack

### Backend
- FastAPI with clean architecture (models → repositories → services → routes)
- SQLAlchemy ORM — SQLite locally, PostgreSQL in production
- Pydantic schemas with separate public/internal models
- Alembic for database migrations

### Frontend
- React 18 + Vite
- Zero UI libraries — all styles written from scratch
- Web Audio API for procedurally generated Victorian ambient music:
  - Synthesized strings
  - Piano
  - Cello
  - Rain and wind layers
  - Westminster-style bell patterns
- Music theme changes dynamically based on game state (interrogation triggers tension mode, win triggers resolution mode)

No external audio files. No UI component libraries.

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
│       │   └── case_repository.py
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
| GET | `/api/v1/cases` | List all cases |
| GET | `/api/v1/cases/{id}` | Full case detail (no guilty field) |
| GET | `/api/v1/cases/{id}/contradictions` | Contradiction engine output |
| POST | `/api/v1/sessions` | Start a new game session |
| GET | `/api/v1/sessions/{id}` | Current session state |
| POST | `/api/v1/sessions/{id}/clues/{clue_id}` | Mark clue as examined |
| POST | `/api/v1/sessions/{id}/suspects/{suspect_id}` | Mark suspect as interviewed |
| POST | `/api/v1/sessions/{id}/accuse` | Submit accusation → returns win/lose |

Interactive documentation is available at `/docs` when running locally.

---

## Running Locally

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

API available at:  
http://localhost:8000

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at:  
http://localhost:5173

The backend seeds the database automatically on first startup.

---

## Deployment

### Backend → Render
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Environment variable:
  - `DATABASE_URL` → PostgreSQL connection string

### Frontend → Vercel
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable:
  - `VITE_API_URL` → your Render backend URL

---

## How the Contradiction Engine Works

Each suspect has:
- A declared alibi (time + location)

Each clue contains:
- Verified time
- Verified location
- Evidence metadata

The `GameLogicService` cross-references these values server-side:

```
Blackwell declares: Reform Club until midnight
Club register shows: departed at 21:15
→ Contradiction flagged (severity: HIGH)
```

The frontend never receives the `guilty` boolean.

The player must deduce the truth through evidence and logical reasoning.

---

## Key Engineering Decisions

- Separation between internal domain models and public API schemas
- No exposure of sensitive fields
- Modular service layer for rule evaluation
- Database abstraction via repositories
- Dynamic procedural audio generation instead of static assets
- Sequential progression logic enforced client-side

---

## Future Improvements

- Unit tests for contradiction engine (pytest)
- Docker support for full environment replication
- CI/CD pipeline
- Persistent user accounts
- Additional historical cases

---

<div align="center">
<sub>Built with FastAPI, React, SQLAlchemy, and the Web Audio API.</sub>
</div>
