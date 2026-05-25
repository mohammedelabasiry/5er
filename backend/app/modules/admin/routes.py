from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.security import require_role
from app.modules.identity.schemas import UserResponse
from app.modules.admin import services as admin_services

router = APIRouter(prefix="/api/v1/admin", tags=["Admin Dashboard"])


@router.get("/dashboard")
def get_dashboard_endpoint(
    current_user=Depends(require_role(["platform_admin", "charity_admin"])),
    db: Session = Depends(get_db),
):
    return admin_services.get_dashboard_stats(db)


@router.get("/users", response_model=List[UserResponse])
def get_users_endpoint(
    role: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user=Depends(require_role(["platform_admin"])),
    db: Session = Depends(get_db),
):
    return admin_services.list_users(
        db, role=role, status=status, search=search, skip=skip, limit=limit
    )


@router.post("/users/{id}/block", response_model=UserResponse)
def block_user_endpoint(
    id: int,
    current_user=Depends(require_role(["platform_admin"])),
    db: Session = Depends(get_db),
):
    user = admin_services.set_user_status(db, id, "blocked")
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.post("/users/{id}/unblock", response_model=UserResponse)
def unblock_user_endpoint(
    id: int,
    current_user=Depends(require_role(["platform_admin"])),
    db: Session = Depends(get_db),
):
    user = admin_services.set_user_status(db, id, "active")
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user
