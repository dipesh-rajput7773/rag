import hashlib
import secrets

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User
from app.middleware.auth import create_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

PASSWORD_ITERATIONS = 260_000


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

    @field_validator("name", "email")
    @classmethod
    def strip_text(cls, value: str) -> str:
        return value.strip()

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters")
        return value


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    plan: str


class AuthResponse(BaseModel):
    token: str
    user: UserResponse


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode(),
        salt.encode(),
        PASSWORD_ITERATIONS,
    ).hex()
    return f"pbkdf2_sha256${PASSWORD_ITERATIONS}${salt}${digest}"


def verify_password(password: str, stored_hash: str) -> bool:
    if stored_hash.startswith("pbkdf2_sha256$"):
        _, iterations, salt, expected = stored_hash.split("$", 3)
        digest = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode(),
            salt.encode(),
            int(iterations),
        ).hex()
        return secrets.compare_digest(digest, expected)

    legacy_hash = hashlib.sha256(password.encode()).hexdigest()
    return secrets.compare_digest(legacy_hash, stored_hash)


def user_response(user: User) -> UserResponse:
    return UserResponse(id=user.id, name=user.name, email=user.email, plan=user.plan)


@router.post("/register", response_model=AuthResponse)
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    email = request.email.lower()
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(409, "Email already registered")

    user = User(
        name=request.name,
        email=email,
        password_hash=hash_password(request.password),
        plan="free",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return AuthResponse(token=create_token(user.id), user=user_response(user))


@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(401, "Invalid email or password")

    if not user.password_hash.startswith("pbkdf2_sha256$"):
        user.password_hash = hash_password(request.password)
        db.commit()

    return AuthResponse(token=create_token(user.id), user=user_response(user))


@router.get("/me", response_model=AuthResponse)
async def get_me(user: User = Depends(get_current_user)):
    return AuthResponse(token="", user=user_response(user))
