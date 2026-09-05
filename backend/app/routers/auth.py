from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.schemas.schemas import LoginRequest, TokenResponse, UserResponse
from backend.app.security.auth import verify_password, create_access_token

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    # If role is explicitly provided in the request (e.g. from demo switcher/login dropdown)
    if payload.role:
        user = db.query(User).filter(User.role == payload.role).first()
        if not user:
            user = db.query(User).filter(User.email == payload.email).first()
    else:
        user = db.query(User).filter(User.email == payload.email).first()

    if not user:
        # Fallback to creating or defaulting to first admin
        user = db.query(User).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(data={"sub": user.email, "role": user.role, "name": user.name})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_me(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.role == "Administrator").first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
