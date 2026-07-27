from typing import List
from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=100)


class LoginRequest(BaseModel):
    email: EmailStr
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
