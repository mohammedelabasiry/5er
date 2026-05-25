from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.security import get_current_user, require_role
from app.modules.beneficiaries.schemas import (
    BeneficiaryCreateRequest,
    BeneficiaryPublicView,
    AdminApproveRequest,
    AdminRejectRequest,
    BeneficiaryProfileResponse,
)
from app.modules.beneficiaries import services as beneficiary_services
from app.modules.entitlements import services as entitlement_services

router = APIRouter(prefix="/api/v1/beneficiaries", tags=["Beneficiaries"])


@router.post("/profile", response_model=BeneficiaryProfileResponse)
def create_profile(
    data: BeneficiaryCreateRequest,
    current_user=Depends(require_role(["beneficiary"])),
    db: Session = Depends(get_db),
):
    try:
        profile = beneficiary_services.create_profile(db, current_user.id, data)
        return profile
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.put("/profile", response_model=BeneficiaryProfileResponse)
def update_profile(
    data: BeneficiaryCreateRequest,
    current_user=Depends(require_role(["beneficiary"])),
    db: Session = Depends(get_db),
):
    try:
        profile = beneficiary_services.update_profile(db, current_user.id, data)
        return profile
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/profile", response_model=BeneficiaryProfileResponse)
def get_own_profile(
    current_user=Depends(require_role(["beneficiary"])),
    db: Session = Depends(get_db),
):
    profile = beneficiary_services.get_profile_by_user(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
    return profile


@router.get("/public", response_model=List[BeneficiaryPublicView])
def get_public_list(
    category: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    return beneficiary_services.list_public_beneficiaries(
        db, category=category, search=search, skip=skip, limit=limit
    )


@router.get("/public/{code}", response_model=BeneficiaryPublicView)
def get_public_detail(code: str, db: Session = Depends(get_db)):
    detail = beneficiary_services.get_public_beneficiary_by_code(db, code)
    if not detail:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found")
    return detail


# Admin-specific routes
@router.get("/admin/list", response_model=List[BeneficiaryProfileResponse])
def get_admin_list(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user=Depends(require_role(["platform_admin", "charity_admin", "charity_staff"])),
    db: Session = Depends(get_db),
):
    return beneficiary_services.list_all_beneficiaries(db, status=status, skip=skip, limit=limit)


@router.post("/admin/{id}/approve", response_model=BeneficiaryProfileResponse)
def admin_approve(
    id: int,
    data: AdminApproveRequest,
    current_user=Depends(require_role(["platform_admin", "charity_admin"])),
    db: Session = Depends(get_db),
):
    profile = beneficiary_services.get_profile_by_id(db, id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Beneficiary profile not found")

    profile.status = "approved"
    profile.category = data.category
    profile.monthly_entitlement_amount = data.monthly_entitlement_amount
    db.commit()
    db.refresh(profile)

    # Initialize or update entitlement for the current month
    entitlement_services.create_or_update_entitlement(db, profile.id, data.monthly_entitlement_amount)

    return profile


@router.post("/admin/{id}/reject", response_model=BeneficiaryProfileResponse)
def admin_reject(
    id: int,
    data: AdminRejectRequest,
    current_user=Depends(require_role(["platform_admin", "charity_admin"])),
    db: Session = Depends(get_db),
):
    profile = beneficiary_services.get_profile_by_id(db, id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Beneficiary profile not found")

    profile.status = "rejected"
    profile.notes = data.reason
    db.commit()
    db.refresh(profile)
    return profile


@router.post("/admin/{id}/block", response_model=BeneficiaryProfileResponse)
def admin_block(
    id: int,
    current_user=Depends(require_role(["platform_admin"])),
    db: Session = Depends(get_db),
):
    profile = beneficiary_services.get_profile_by_id(db, id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Beneficiary profile not found")

    profile.status = "blocked"
    db.commit()
    db.refresh(profile)
    return profile
