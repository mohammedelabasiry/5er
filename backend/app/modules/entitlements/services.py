from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.modules.entitlements.models import MonthlyEntitlement
from app.modules.beneficiaries.models import BeneficiaryProfile


def get_month_key() -> str:
    # Returns YYYY-MM based on UTC/local time
    return datetime.now(timezone.utc).strftime("%Y-%m")


def get_current_entitlement(db: Session, beneficiary_id: int) -> MonthlyEntitlement | None:
    month_key = get_month_key()
    entitlement = db.query(MonthlyEntitlement).filter(
        MonthlyEntitlement.beneficiary_id == beneficiary_id,
        MonthlyEntitlement.month == month_key
    ).first()

    if not entitlement:
        # Check if beneficiary is approved and has an entitlement amount
        profile = db.query(BeneficiaryProfile).filter(BeneficiaryProfile.id == beneficiary_id).first()
        if profile and profile.status == "approved" and profile.monthly_entitlement_amount:
            # Auto-create for the current month
            entitlement = MonthlyEntitlement(
                beneficiary_id=beneficiary_id,
                month=month_key,
                entitled_amount=profile.monthly_entitlement_amount,
                received_amount=0.0,
                remaining_amount=profile.monthly_entitlement_amount,
                is_fully_funded=False
            )
            db.add(entitlement)
            db.commit()
            db.refresh(entitlement)

    return entitlement


def create_or_update_entitlement(db: Session, beneficiary_id: int, entitled_amount: float) -> MonthlyEntitlement:
    month_key = get_month_key()
    entitlement = db.query(MonthlyEntitlement).filter(
        MonthlyEntitlement.beneficiary_id == beneficiary_id,
        MonthlyEntitlement.month == month_key
    ).first()

    if entitlement:
        # Update entitled amount and recalculate remaining
        entitlement.entitled_amount = entitled_amount
        entitlement.remaining_amount = max(0.0, entitled_amount - entitlement.received_amount)
        entitlement.is_fully_funded = entitlement.remaining_amount <= 0
    else:
        entitlement = MonthlyEntitlement(
            beneficiary_id=beneficiary_id,
            month=month_key,
            entitled_amount=entitled_amount,
            received_amount=0.0,
            remaining_amount=entitled_amount,
            is_fully_funded=False
        )
        db.add(entitlement)

    db.commit()
    db.refresh(entitlement)
    return entitlement
