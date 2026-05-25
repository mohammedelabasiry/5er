from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.core.database import get_db
from app.core.security import get_current_user, require_role
from app.modules.donations import services as donation_services
from app.modules.donations.models import Donation

router = APIRouter(prefix="/api/v1/donations", tags=["Donations"])


class DonationCreateSchema(BaseModel):
    beneficiary_code: str
    amount: float
    message: Optional[str] = None


class DonationResponseSchema(BaseModel):
    id: int
    donor_id: int
    beneficiary_id: int
    amount: float
    status: str
    message: Optional[str] = None
    created_at: str
    beneficiary_code: Optional[str] = None
    beneficiary_alias: Optional[str] = None

    model_config = {"from_attributes": True}


@router.post("/pledge", response_model=DonationResponseSchema)
def create_pledge_endpoint(
    data: DonationCreateSchema,
    current_user=Depends(require_role(["donor"])),
    db: Session = Depends(get_db),
):
    try:
        donation = donation_services.create_pledge(
            db,
            donor_id=current_user.id,
            beneficiary_code=data.beneficiary_code,
            amount=data.amount,
            message=data.message,
        )
        return {
            "id": donation.id,
            "donor_id": donation.donor_id,
            "beneficiary_id": donation.beneficiary_id,
            "amount": donation.amount,
            "status": donation.status,
            "message": donation.message,
            "created_at": donation.created_at.isoformat(),
            "beneficiary_code": donation.beneficiary.public_code if donation.beneficiary else None,
            "beneficiary_alias": donation.beneficiary.alias_name if donation.beneficiary else None,
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/{id}/confirm", response_model=DonationResponseSchema)
def confirm_donation_endpoint(
    id: int,
    current_user=Depends(require_role(["donor"])),
    db: Session = Depends(get_db),
):
    try:
        donation = donation_services.confirm_donation(db, id)
        return {
            "id": donation.id,
            "donor_id": donation.donor_id,
            "beneficiary_id": donation.beneficiary_id,
            "amount": donation.amount,
            "status": donation.status,
            "message": donation.message,
            "created_at": donation.created_at.isoformat(),
            "beneficiary_code": donation.beneficiary.public_code if donation.beneficiary else None,
            "beneficiary_alias": donation.beneficiary.alias_name if donation.beneficiary else None,
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/my", response_model=List[DonationResponseSchema])
def get_my_donations_endpoint(
    skip: int = 0,
    limit: int = 100,
    current_user=Depends(require_role(["donor"])),
    db: Session = Depends(get_db),
):
    donations = donation_services.get_donor_donations(db, donor_id=current_user.id, skip=skip, limit=limit)
    results = []
    for d in donations:
        results.append({
            "id": d.id,
            "donor_id": d.donor_id,
            "beneficiary_id": d.beneficiary_id,
            "amount": d.amount,
            "status": d.status,
            "message": d.message,
            "created_at": d.created_at.isoformat(),
            "beneficiary_code": d.beneficiary.public_code if d.beneficiary else None,
            "beneficiary_alias": d.beneficiary.alias_name if d.beneficiary else None,
        })
    return results
