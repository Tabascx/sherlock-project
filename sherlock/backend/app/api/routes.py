from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.schemas import (
    CaseSummary, CaseDetail, VictimSchema,
    SuspectPublic, CluePublic,
    SessionCreate, SessionState, AccuseRequest, AccuseResponse
)
from app.repositories.repositories import case_repo, session_repo
from app.services.game_logic import game_logic

router = APIRouter()


# ── CASES ──────────────────────────────────────────────────────────────────
@router.get("/cases", response_model=List[CaseSummary])
def list_cases(db: Session = Depends(get_db)):
    """List all available cases (summary view for case selection screen)."""
    cases = case_repo.get_all(db)
    return [
        {
            "id": c.id,
            "title": c.title,
            "subtitle": c.subtitle,
            "tagline": c.tagline,
            "difficulty": c.difficulty,
            "status": c.status,
            "suspect_count": len(c.suspects),
            "clue_count": len(c.clues),
        }
        for c in cases
    ]


@router.get("/cases/{case_id}", response_model=CaseDetail)
def get_case(case_id: int, db: Session = Depends(get_db)):
    """Get full case details for the game view."""
    case = case_repo.get_by_id(db, case_id)
    if not case:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")

    suspects = case_repo.get_suspects(db, case_id)
    clues = case_repo.get_clues(db, case_id)

    return {
        "id": case.id,
        "title": case.title,
        "subtitle": case.subtitle,
        "tagline": case.tagline,
        "description": case.description,
        "difficulty": case.difficulty,
        "status": case.status,
        "victim": {
            "name": case.victim_name,
            "age": case.victim_age,
            "profession": case.victim_profession,
            "location": case.victim_location,
            "time_of_death": case.victim_time_of_death,
            "cause": case.victim_cause,
        },
        "suspects": [
            {
                "id": s.id,
                "case_id": s.case_id,
                "name": s.name,
                "age": s.age,
                "profession": s.profession,
                "relation": s.relation,
                "description": s.description,
                "alibi": s.alibi,
                "motive": s.motive,
                "personality": s.personality,
                "ambiguity": s.ambiguity,
                "interview": s.interview,
                # NOTE: guilty is intentionally NOT included
            }
            for s in suspects
        ],
        "clues": [
            {
                "id": c.id,
                "case_id": c.case_id,
                "name": c.name,
                "category": c.category,
                "description": c.description,
                "timestamp": c.timestamp,
                "suspect_link": c.suspect_link,
                "is_misleading": c.is_misleading,
            }
            for c in clues
        ],
    }


@router.get("/cases/{case_id}/contradictions")
def get_contradictions(case_id: int, db: Session = Depends(get_db)):
    """
    Return detected contradictions for a case.
    Used by the detective notebook / analysis view.
    """
    case = case_repo.get_by_id(db, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return {"case_id": case_id, "contradictions": game_logic.detect_contradictions(db, case_id)}


# ── SESSIONS ───────────────────────────────────────────────────────────────
@router.post("/sessions")
def create_session(body: SessionCreate, db: Session = Depends(get_db)):
    """Start a new game session for a case."""
    case = case_repo.get_by_id(db, body.case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    session = session_repo.create(db, body.case_id)
    return {"session_id": session.id, "case_id": session.case_id, "status": session.status}


@router.get("/sessions/{session_id}")
def get_session(session_id: int, db: Session = Depends(get_db)):
    """Get current session state."""
    session = session_repo.get_by_id(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    found = [int(x) for x in session.found_clues.split(",") if x]
    interviewed = [int(x) for x in session.interviewed.split(",") if x]
    return {
        "id": session.id,
        "case_id": session.case_id,
        "found_clues": found,
        "interviewed": interviewed,
        "status": session.status,
        "accused_suspect_id": session.accused_suspect_id,
    }


@router.post("/sessions/{session_id}/clues/{clue_id}")
def examine_clue(session_id: int, clue_id: int, db: Session = Depends(get_db)):
    """Mark a clue as examined in a session."""
    session = session_repo.get_by_id(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.status != "active":
        raise HTTPException(status_code=400, detail="Session is no longer active")
    updated = session_repo.mark_clue_found(db, session, clue_id)
    found = [int(x) for x in updated.found_clues.split(",") if x]
    return {"session_id": session_id, "found_clues": found}


@router.post("/sessions/{session_id}/suspects/{suspect_id}")
def interview_suspect(session_id: int, suspect_id: int, db: Session = Depends(get_db)):
    """Mark a suspect as interviewed in a session."""
    session = session_repo.get_by_id(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.status != "active":
        raise HTTPException(status_code=400, detail="Session is no longer active")
    updated = session_repo.mark_suspect_interviewed(db, session, suspect_id)
    interviewed = [int(x) for x in updated.interviewed.split(",") if x]
    return {"session_id": session_id, "interviewed": interviewed}


@router.post("/sessions/{session_id}/accuse", response_model=AccuseResponse)
def accuse_suspect(session_id: int, body: AccuseRequest, db: Session = Depends(get_db)):
    """
    Make a formal accusation. This is the final action — closes the session.
    Returns win/lose result with the explanation of the true culprit.
    """
    session = session_repo.get_by_id(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.status != "active":
        raise HTTPException(status_code=400, detail="This session has already concluded")

    result = game_logic.evaluate_accusation(db, session, body.suspect_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])

    guilty = result["guilty_suspect"]
    return {
        "result": result["result"],
        "message": result["message"],
        "guilty_suspect": {
            "id": guilty.id,
            "case_id": guilty.case_id,
            "name": guilty.name,
            "age": guilty.age,
            "profession": guilty.profession,
            "relation": guilty.relation,
            "description": guilty.description,
            "alibi": guilty.alibi,
            "motive": guilty.motive,
            "personality": guilty.personality,
            "ambiguity": guilty.ambiguity,
            "interview": guilty.interview,
        },
        "explanation": result["explanation"],
    }
