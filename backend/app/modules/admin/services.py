from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone

from app.modules.identity.models import User
from app.modules.beneficiaries.models import BeneficiaryProfile
from app.modules.donations.models import Donation
from app.modules.entitlements.models import MonthlyEntitlement
from app.modules.entitlements import services as entitlement_services


def get_dashboard_stats(db: Session):
    total_beneficiaries = db.query(func.count(BeneficiaryProfile.id)).scalar() or 0
    total_donors = db.query(func.count(User.id)).filter(User.role == "donor").scalar() or 0

    month_key = entitlement_services.get_month_key()
    total_donations_this_month = db.query(func.count(Donation.id)).filter(
        Donation.status == "confirmed"
    ).scalar() or 0

    total_amount_donated = db.query(func.sum(Donation.amount)).filter(
        Donation.status == "confirmed"
    ).scalar() or 0.0

    fully_funded_count = db.query(func.count(MonthlyEntitlement.id)).filter(
        MonthlyEntitlement.month == month_key,
        MonthlyEntitlement.is_fully_funded == True
    ).scalar() or 0

    pending_applications = db.query(func.count(BeneficiaryProfile.id)).filter(
        BeneficiaryProfile.status == "pending"
    ).scalar() or 0

    return {
        "total_beneficiaries": total_beneficiaries,
        "total_donors": total_donors,
        "total_donations_this_month": total_donations_this_month,
        "total_amount_donated": float(total_amount_donated),
        "fully_funded_count": fully_funded_count,
        "pending_applications": pending_applications
    }


def list_users(db: Session, role: str | None = None, status: str | None = None, search: str | None = None, skip: int = 0, limit: int = 100):
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    if status:
        query = query.filter(User.status == status)
    if search:
        query = query.filter(
            User.email.ilike(f"%{search}%") | User.full_name.ilike(f"%{search}%")
        )
    return query.offset(skip).limit(limit).all()


def set_user_status(db: Session, user_id: int, status: str) -> User | None:
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.status = status
        db.commit()
        db.refresh(user)
    return user
