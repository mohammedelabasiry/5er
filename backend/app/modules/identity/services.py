from sqlalchemy.orm import Session
from app.modules.identity.models import User
from app.modules.identity.schemas import UserRegister
from app.core.security import hash_password, verify_password


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email.lower().strip()).first()


def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def register_user(db: Session, user_data: UserRegister) -> User:
    hashed_pwd = hash_password(user_data.password)
    db_user = User(
        email=user_data.email.lower().strip(),
        phone=user_data.phone,
        full_name=user_data.full_name,
        hashed_password=hashed_pwd,
        role=user_data.role,
        status="active"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
