from sqlalchemy.orm import Session
from app.models.models import Case, Suspect, Clue, GameSession
from typing import Optional


class GameLogicService:
    """
    Core deduction engine.
    Evaluates accusations, detects contradictions, and manages game state.
    """

    def evaluate_accusation(self, db: Session, session: GameSession, suspect_id: int) -> dict:
        """
        Evaluate if the accused suspect is guilty.
        Returns result dict with win/lose, explanation, and guilty suspect data.
        """
        case = db.query(Case).filter(Case.id == session.case_id).first()
        accused = db.query(Suspect).filter(
            Suspect.id == suspect_id,
            Suspect.case_id == session.case_id
        ).first()
        guilty_suspect = db.query(Suspect).filter(
            Suspect.id == case.solution_guilty_id,
            Suspect.case_id == session.case_id
        ).first()

        if not accused:
            return {"error": "Suspect not found"}

        is_correct = accused.guilty

        # Update session
        session.accused_suspect_id = suspect_id
        session.status = "won" if is_correct else "lost"
        db.commit()

        return {
            "result": "win" if is_correct else "lose",
            "message": (
                f"Correcto. {accused.name} es el culpable."
                if is_correct
                else f"Incorrecto. {accused.name} es inocente. El caso se cierra."
            ),
            "guilty_suspect": guilty_suspect,
            "explanation": case.solution_explanation,
        }

    def detect_contradictions(self, db: Session, case_id: int) -> list[dict]:
        """
        Analyze all suspects and clues in a case and return detected contradictions.
        This is the 'contradiction engine' — compares alibis with evidence.
        """
        contradictions = []
        suspects = db.query(Suspect).filter(Suspect.case_id == case_id).all()
        clues = db.query(Clue).filter(Clue.case_id == case_id).all()

        # Hard-coded contradiction rules for Case 1
        # In a full system, these would be extracted from structured alibi/time data
        contradiction_rules = [
            {
                "suspect_id": 1,
                "suspect_name": "Arthur Blackwell",
                "clue_id": 10,
                "clue_name": "Registro del Reform Club",
                "description": "Blackwell declara haber estado en el Reform Club hasta medianoche, pero el registro del portero muestra su salida a las 21:15 — antes del crimen.",
                "severity": "HIGH",
            },
            {
                "suspect_id": 4,
                "suspect_name": "Dr. Victor Ashmore",
                "clue_id": 7,
                "clue_name": "Guante de caballero",
                "description": "Ashmore siempre lleva guantes de cuero negro. Un guante con la inicial 'V' fue hallado a 10 metros del cuerpo. Ashmore afirma haber estado en Mayfair.",
                "severity": "HIGH",
            },
            {
                "suspect_id": 4,
                "suspect_name": "Dr. Victor Ashmore",
                "clue_id": 8,
                "clue_name": "Entrada de diario",
                "description": "Hartley escribió sobre 'V.' dos días antes del crimen, amenazando con denunciar una malversación. Ashmore es el único sospechoso cuyo nombre empieza por V.",
                "severity": "HIGH",
            },
            {
                "suspect_id": 2,
                "suspect_name": "Eleanor Hartley",
                "clue_id": 9,
                "clue_name": "Declaración de la doncella",
                "description": "La doncella admite que se retiró a las 21:00 y no puede confirmar la presencia de Eleanor en casa. Una vecina la vio salir a las 21:15.",
                "severity": "MEDIUM",
            },
        ]

        suspect_ids = {s.id for s in suspects}
        clue_ids = {c.id for c in clues}

        for rule in contradiction_rules:
            if rule["suspect_id"] in suspect_ids and rule["clue_id"] in clue_ids:
                contradictions.append(rule)

        return contradictions

    def get_session_progress(self, session: GameSession) -> dict:
        """Calculate investigation progress percentage."""
        found = len([x for x in session.found_clues.split(",") if x]) if session.found_clues else 0
        interviewed = len([x for x in session.interviewed.split(",") if x]) if session.interviewed else 0
        return {
            "found_clues": found,
            "interviewed": interviewed,
            "total_actions": found + interviewed,
        }


game_logic = GameLogicService()
