import random
import string
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.modules.beneficiaries.models import BeneficiaryProfile
from app.modules.beneficiaries.schemas import BeneficiaryCreateRequest
from app.modules.entitlements import services as entitlement_services
from app.modules.entitlements.models import MonthlyEntitlement


def generate_public_code(db: Session) -> str:
    while True:
        chars = "".join(random.choices(string.ascii_uppercase + string.digits, k=5))
        code = f"CASE-{chars}"
        # Check uniqueness
        exists = db.query(BeneficiaryProfile).filter(BeneficiaryProfile.public_code == code).first()
        if not exists:
            return code


def generate_alias_name() -> str:
    prefixes = ["عائلة", "أسرة", "بيت", "مستفيد"]
    attributes = ["الأمل", "الكرامة", "الرضا", "التكافل", "الياسمين", "الخير", "الصبر", "الإيمان"]
    num = random.randint(100, 999)
    return f"{random.choice(prefixes)} {random.choice(attributes)} {num}"


def get_profile_by_user(db: Session, user_id: int) -> BeneficiaryProfile | None:
    return db.query(BeneficiaryProfile).filter(BeneficiaryProfile.user_id == user_id).first()


def get_profile_by_code(db: Session, public_code: str) -> BeneficiaryProfile | None:
    return db.query(BeneficiaryProfile).filter(BeneficiaryProfile.public_code == public_code).first()


def get_profile_by_id(db: Session, profile_id: int) -> BeneficiaryProfile | None:
    return db.query(BeneficiaryProfile).filter(BeneficiaryProfile.id == profile_id).first()


def create_profile(db: Session, user_id: int, data: BeneficiaryCreateRequest) -> BeneficiaryProfile:
    existing = get_profile_by_user(db, user_id)
    if existing:
        raise ValueError("Profile already exists for this user")

    # Generate hash/encryption representation for national ID to prevent duplicates
    national_id_enc = None
    if data.national_id:
        # Check for duplicates using basic matching (in real production, use actual encryption/hash)
        national_id_enc = f"HASH-{hash(data.national_id.strip())}"
        dup = db.query(BeneficiaryProfile).filter(BeneficiaryProfile.national_id_encrypted == national_id_enc).first()
        if dup:
            raise ValueError("National ID already registered in the system")

    profile = BeneficiaryProfile(
        user_id=user_id,
        public_code=generate_public_code(db),
        alias_name=generate_alias_name(),
        national_id_encrypted=national_id_enc,
        family_size=data.family_size,
        children_count=data.children_count,
        dependents_count=data.dependents_count,
        monthly_income=data.monthly_income,
        monthly_rent=data.monthly_rent,
        employment_status=data.employment_status,
        has_medical_needs=data.has_medical_needs or False,
        has_education_needs=data.has_education_needs or False,
        has_housing_needs=data.has_housing_needs or False,
        area=data.area,
        address_encrypted=data.address,  # Mock encrypted representation
        latitude=data.latitude,
        longitude=data.longitude,
        status="pending",
        notes=data.notes
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def update_profile(db: Session, user_id: int, data: BeneficiaryCreateRequest) -> BeneficiaryProfile:
    profile = get_profile_by_user(db, user_id)
    if not profile:
        # Create profile if it does not exist
        return create_profile(db, user_id, data)

    # Update only fields that are provided
    for field, value in data.model_dump(exclude_unset=True).items():
        if field == "national_id" and value:
            profile.national_id_encrypted = f"HASH-{hash(value.strip())}"
        elif field == "address" and value:
            profile.address_encrypted = value
        elif value is not None:
            setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile


def list_public_beneficiaries(
    db: Session,
    category: str | None = None,
    search: str | None = None,
    skip: int = 0,
    limit: int = 100
):
    query = db.query(BeneficiaryProfile).filter(BeneficiaryProfile.status == "approved")

    if category:
        query = query.filter(BeneficiaryProfile.category == category)

    if search:
        query = query.filter(
            or_(
                BeneficiaryProfile.public_code.ilike(f"%{search}%"),
                BeneficiaryProfile.area.ilike(f"%{search}%"),
                BeneficiaryProfile.alias_name.ilike(f"%{search}%")
            )
        )

    profiles = query.offset(skip).limit(limit).all()
    results = []

    for p in profiles:
        ent = entitlement_services.get_current_entitlement(db, p.id)
        # If it has an entitlement, check if it's already fully funded
        if ent and ent.is_fully_funded:
            continue  # Exclude fully funded cases from public listing

        received = ent.received_amount if ent else 0.0
        remaining = ent.remaining_amount if ent else (p.monthly_entitlement_amount or 0.0)

        results.append({
            "public_code": p.public_code,
            "alias_name": p.alias_name,
            "area": p.area,
            "category": p.category,
            "monthly_entitlement_amount": p.monthly_entitlement_amount,
            "received_this_month": received,
            "remaining_amount": remaining,
            "family_size": p.family_size,
            "children_count": p.children_count
        })

    return results


def get_public_beneficiary_by_code(db: Session, public_code: str):
    p = get_profile_by_code(db, public_code)
    if not p or p.status != "approved":
        return None

    ent = entitlement_services.get_current_entitlement(db, p.id)
    received = ent.received_amount if ent else 0.0
    remaining = ent.remaining_amount if ent else (p.monthly_entitlement_amount or 0.0)

    return {
        "public_code": p.public_code,
        "alias_name": p.alias_name,
        "area": p.area,
        "category": p.category,
        "monthly_entitlement_amount": p.monthly_entitlement_amount,
        "received_this_month": received,
        "remaining_amount": remaining,
        "family_size": p.family_size,
        "children_count": p.children_count
    }


def list_all_beneficiaries(db: Session, status: str | None = None, skip: int = 0, limit: int = 100):
    query = db.query(BeneficiaryProfile)
    if status:
        query = query.filter(BeneficiaryProfile.status == status)
    return query.offset(skip).limit(limit).all()
