from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# ── SUSPECT ────────────────────────────────────────────────────────────────
class SuspectBase(BaseModel):
    name: str
    age: int
    profession: str
    relation: str
    description: str
    alibi: str
    motive: str
    personality: str
    ambiguity: str
    interview: str


class SuspectPublic(SuspectBase):
    """Returned to client — no guilty field exposed"""
    id: int
    case_id: int

    class Config:
        from_attributes = True


class SuspectAdmin(SuspectBase):
    """Internal use only — includes guilty"""
    id: int
    case_id: int
    guilty: bool

    class Config:
        from_attributes = True


# ── CLUE ───────────────────────────────────────────────────────────────────
class ClueBase(BaseModel):
    name: str
    category: str
    description: str
    timestamp: str
    suspect_link: Optional[int] = None
    is_misleading: bool = False


class CluePublic(ClueBase):
    id: int
    case_id: int

    class Config:
        from_attributes = True


# ── VICTIM ─────────────────────────────────────────────────────────────────
class VictimSchema(BaseModel):
    name: str
    age: int
    profession: str
    location: str
    time_of_death: str
    cause: str


# ── CASE ───────────────────────────────────────────────────────────────────
class CaseSummary(BaseModel):
    id: int
    title: str
    subtitle: str
    tagline: str
    difficulty: str
    status: str
    suspect_count: int
    clue_count: int

    class Config:
        from_attributes = True


class CaseDetail(BaseModel):
    id: int
    title: str
    subtitle: str
    tagline: str
    description: str
    difficulty: str
    status: str
    victim: VictimSchema
    suspects: List[SuspectPublic]
    clues: List[CluePublic]

    class Config:
        from_attributes = True


# ── SESSION ────────────────────────────────────────────────────────────────
class SessionCreate(BaseModel):
    case_id: int


class SessionState(BaseModel):
    id: int
    case_id: int
    found_clues: List[int]
    interviewed: List[int]
    status: str
    accused_suspect_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AccuseRequest(BaseModel):
    suspect_id: int


class AccuseResponse(BaseModel):
    result: str  # "win" | "lose"
    message: str
    guilty_suspect: SuspectPublic
    explanation: str
