from typing import List
from pydantic import BaseModel, Field


USERNAME_PATTERN = r"^[a-zA-Z0-9_]+$"


class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=24, pattern=USERNAME_PATTERN)
    password: str = Field(min_length=6, max_length=100)


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class GameStateOut(BaseModel):
    hearts: float
    owned_cats: List[str]
    selected_cat: str
    owned_decos: List[str]
    click_level: int
    passive_level: int
    mini_last_day: str
    mini_today: int

    class Config:
        from_attributes = True


class GameStateIn(BaseModel):
    hearts: float
    owned_cats: List[str]
    selected_cat: str
    owned_decos: List[str]
    click_level: int
    passive_level: int
    mini_last_day: str
    mini_today: int
