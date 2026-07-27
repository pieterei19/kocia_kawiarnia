from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Float, JSON, DateTime
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class GameState(Base):
    __tablename__ = "game_states"

    user_id = Column(Integer, primary_key=True, index=True)
    hearts = Column(Float, default=20)
    owned_cats = Column(JSON, default=lambda: ["milus"])
    selected_cat = Column(String, default="milus")
    owned_decos = Column(JSON, default=list)
    click_level = Column(Integer, default=0)
    passive_level = Column(Integer, default=0)
    mini_last_day = Column(String, default=lambda: date.today().isoformat())
    mini_today = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
