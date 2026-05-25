from sqlalchemy.orm import Session
from app.modules.donations.models import Donation
from app.modules.beneficiaries.models import BeneficiaryProfile
from app.modules.entitlements.models import MonthlyEntitlement
from app.modules.entitlements import services as entitlement_services


def create_pledge(db: Session, donor_id: int, beneficiary_code: str, amount: float, message: str | None = None) -> Donation:
    profile = db.query(BeneficiaryProfile).filter(BeneficiaryProfile.public_code == beneficiary_code).first()
    if not profile:
        raise ValueError("Beneficiary code not found")
    if profile.status != "approved":
        raise ValueError("Beneficiary case is not approved for donations")

    ent = entitlement_services.get_current_entitlement(db, profile.id)
    if not ent:
        raise ValueError("No active monthly entitlement found for this beneficiary")

    if ent.is_fully_funded or ent.remaining_amount <= 0:
        raise ValueError("Beneficiary is already fully funded for this month")

    if amount <= 0:
        raise ValueError("Donation amount must be greater than zero")

    if amount > ent.remaining_amount:
        raise ValueError(f"Donation amount exceeds the remaining monthly limit of {ent.remaining_amount} EGP")

    donation = Donation(
        donor_id=donor_id,
        beneficiary_id=profile.id,
        amount=amount,
        status="pledged",
        message=message
    )
    db.add(donation)
    db.commit()
    db.refresh(donation)
    return donation


def confirm_donation(db: Session, donation_id: int) -> Donation:
    # Use database transactions with explicit row locking
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise ValueError("Donation record not found")
    if donation.status != "pledged":
        raise ValueError(f"Donation is already {donation.status}")

    # Start transaction with row lock
    # Get current entitlement and lock it
    ent = db.query(MonthlyEntitlement).filter(
        MonthlyEntitlement.beneficiary_id == donation.beneficiary_id,
        MonthlyEntitlement.month == entitlement_services.get_month_key()
    ).with_for_update().first()

    if not ent:
        raise ValueError("No active monthly entitlement found")

    if ent.is_fully_funded or ent.remaining_amount <= 0:
        donation.status = "cancelled"
        db.commit()
        raise ValueError("Beneficiary is already fully funded for this month. Donation cancelled.")

    if donation.amount > ent.remaining_amount:
        # Option: Cap the donation or reject. We'll adjust the donation amount to the remaining
        # and refund/ignore the rest, or just raise an error. Let's raise an error to let the user choose.
        raise ValueError(f"Donation exceeds remaining monthly limit of {ent.remaining_amount} EGP. Please adjust your contribution.")

    # Update entitlement values
    ent.received_amount += donation.amount
    ent.remaining_amount = max(0.0, ent.entitled_amount - ent.received_amount)
    if ent.remaining_amount <= 0:
        ent.is_fully_funded = True

    # Update donation status
    donation.status = "confirmed"

    db.commit()
    db.refresh(donation)
    return donation


def get_donor_donations(db: Session, donor_id: int, skip: int = 0, limit: int = 100):
    return db.query(Donation).filter(Donation.donor_id == donor_id).order_by(Donation.created_at.desc()).offset(skip).limit(limit).all()
