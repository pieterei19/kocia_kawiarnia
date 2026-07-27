import os
from pathlib import Path

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from . import models, schemas
from .auth import create_access_token, get_current_user, hash_password, verify_password
from .database import Base, SessionLocal, engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Kocia Kawiarnia API")

# Frontend may be hosted on GitHub Pages (a different origin than the API),
# so CORS must explicitly allow it. Local dev serves same-origin and needs no entry.
DEFAULT_ORIGINS = [
    "https://pieterei19.github.io",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]
extra_origins = os.environ.get("CORS_ORIGINS", "")
allowed_origins = DEFAULT_ORIGINS + [o.strip() for o in extra_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = FastAPI()


def default_game_state(user_id: int) -> models.GameState:
    return models.GameState(user_id=user_id)


@api.post("/auth/register", response_model=schemas.TokenResponse)
def register(payload: schemas.RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Konto z tym adresem e-mail już istnieje.")

    user = models.User(email=payload.email, password_hash=hash_password(payload.password))
    db.add(user)
    db.flush()

    db.add(default_game_state(user.id))
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id)
    return schemas.TokenResponse(access_token=token)


@api.post("/auth/login", response_model=schemas.TokenResponse)
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Nieprawidłowy e-mail lub hasło.")

    token = create_access_token(user.id)
    return schemas.TokenResponse(access_token=token)


@api.get("/state", response_model=schemas.GameStateOut)
def get_state(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    state = db.get(models.GameState, current_user.id)
    if state is None:
        state = default_game_state(current_user.id)
        db.add(state)
        db.commit()
        db.refresh(state)
    return state


@api.put("/state", response_model=schemas.GameStateOut)
def put_state(
    payload: schemas.GameStateIn,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    state = db.get(models.GameState, current_user.id)
    if state is None:
        state = models.GameState(user_id=current_user.id)
        db.add(state)

    for field, value in payload.model_dump().items():
        setattr(state, field, value)

    db.commit()
    db.refresh(state)
    return state


app.mount("/api", api)

FRONTEND_DIR = Path(__file__).resolve().parent.parent.parent / "frontend"
app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")
