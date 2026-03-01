from sqlalchemy.orm import Session
from app.models.models import Case, Suspect, Clue, GameSession
from typing import Optional, List


class CaseRepository:

    def get_all(self, db: Session) -> List[Case]:
        return db.query(Case).all()

    def get_by_id(self, db: Session, case_id: int) -> Optional[Case]:
        return db.query(Case).filter(Case.id == case_id).first()

    def get_suspects(self, db: Session, case_id: int) -> List[Suspect]:
        return db.query(Suspect).filter(Suspect.case_id == case_id).all()

    def get_clues(self, db: Session, case_id: int) -> List[Clue]:
        return db.query(Clue).filter(Clue.case_id == case_id).all()


class SessionRepository:

    def create(self, db: Session, case_id: int) -> GameSession:
        session = GameSession(case_id=case_id, found_clues="", interviewed="", status="active")
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    def get_by_id(self, db: Session, session_id: int) -> Optional[GameSession]:
        return db.query(GameSession).filter(GameSession.id == session_id).first()

    def mark_clue_found(self, db: Session, session: GameSession, clue_id: int) -> GameSession:
        found = set(x for x in session.found_clues.split(",") if x)
        found.add(str(clue_id))
        session.found_clues = ",".join(found)
        db.commit()
        db.refresh(session)
        return session

    def mark_suspect_interviewed(self, db: Session, session: GameSession, suspect_id: int) -> GameSession:
        done = set(x for x in session.interviewed.split(",") if x)
        done.add(str(suspect_id))
        session.interviewed = ",".join(done)
        db.commit()
        db.refresh(session)
        return session


case_repo = CaseRepository()
session_repo = SessionRepository()
