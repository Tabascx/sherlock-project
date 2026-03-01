from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship, DeclarativeBase
from datetime import datetime


class Base(DeclarativeBase):
    pass


class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    subtitle = Column(String(200))
    tagline = Column(String(400))
    description = Column(Text, nullable=False)
    difficulty = Column(String(20), default="MODERADO")
    status = Column(String(20), default="open")
    created_at = Column(DateTime, default=datetime.utcnow)

    suspects = relationship("Suspect", back_populates="case", cascade="all, delete-orphan")
    clues = relationship("Clue", back_populates="case", cascade="all, delete-orphan")
    sessions = relationship("GameSession", back_populates="case")

    # Victim info (flattened)
    victim_name = Column(String(100))
    victim_age = Column(Integer)
    victim_profession = Column(String(100))
    victim_location = Column(String(200))
    victim_time_of_death = Column(String(50))
    victim_cause = Column(String(200))

    # Solution
    solution_guilty_id = Column(Integer)
    solution_explanation = Column(Text)


class Suspect(Base):
    __tablename__ = "suspects"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    name = Column(String(100), nullable=False)
    age = Column(Integer)
    profession = Column(String(100))
    relation = Column(String(200))
    description = Column(Text)
    alibi = Column(Text)
    motive = Column(Text)
    personality = Column(Text)
    ambiguity = Column(Text)
    interview = Column(Text)
    guilty = Column(Boolean, default=False)

    case = relationship("Case", back_populates="suspects")


class Clue(Base):
    __tablename__ = "clues"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    name = Column(String(200), nullable=False)
    category = Column(String(50))  # physical | document | testimony
    description = Column(Text)
    timestamp = Column(String(200))
    suspect_link = Column(Integer, nullable=True)  # suspect id it relates to
    is_misleading = Column(Boolean, default=False)

    case = relationship("Case", back_populates="clues")


class GameSession(Base):
    __tablename__ = "game_sessions"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    found_clues = Column(Text, default="")   # comma-separated clue ids
    interviewed = Column(Text, default="")   # comma-separated suspect ids
    status = Column(String(20), default="active")  # active | won | lost
    accused_suspect_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    case = relationship("Case", back_populates="sessions")
