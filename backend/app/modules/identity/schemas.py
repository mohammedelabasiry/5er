from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator


class UserRegister(BaseModel):
    email: str
    password: str
    phone: Optional[str] = None
    full_name: str
    role: str = "donor"

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        if v not in ("donor", "beneficiary"):
            raise ValueError("Role must be 'donor' or 'beneficiary'")
        return v

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        if "@" not in v:
            raise ValueError("Invalid email address")
        return v.lower().strip()


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    phone: Optional[str] = None
    full_name: str
    role: str
    status: str
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
