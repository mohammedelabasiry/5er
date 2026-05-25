from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.security import get_current_user, require_role
from app.modules.entitlements.models import MonthlyEntitlement
from app.modules.entitlements import services as entitlement_services
from app.modules.beneficiaries import services as beneficiary_services

router = APIRouter(prefix="/api/v1/entitlements", tags=["Entitlements"])


@router.get("/current")
def get_current_entitlement_endpoint(
    current_user=Depends(require_role(["beneficiary"])),
    db: Session = Depends(get_db),
):
    profile = beneficiary_services.get_profile_by_user(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Beneficiary profile not found")

    entitlement = entitlement_services.get_current_entitlement(db, profile.id)
    if not entitlement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No active entitlement found for this month")

    return entitlement


@router.get("/admin/list", response_model=List[dict])
def get_admin_list(
    month: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user=Depends(require_role(["platform_admin", "charity_admin", "charity_staff"])),
    db: Session = Depends(get_db),
):
    query = db.query(MonthlyEntitlement)
    if month:
        query = query.filter(MonthlyEntitlement.month == month)

    entitlements = query.offset(skip).limit(limit).all()
    results = []

    for ent in entitlements:
        results.append({
            "id": ent.id,
            "beneficiary_id": ent.beneficiary_id,
            "month": ent.month,
            "entitled_amount": ent.entitled_amount,
            "received_amount": ent.received_amount,
            "remaining_amount": ent.remaining_amount,
            "is_fully_funded": ent.is_fully_funded,
            "beneficiary_code": ent.beneficiary.public_code if ent.beneficiary else None,
            "beneficiary_alias": ent.beneficiary.alias_name if ent.beneficiary else None,
        })

    return results
