from sqlalchemy.orm import Session
from app.modules.identity.models import User
from app.modules.beneficiaries.models import BeneficiaryProfile
from app.modules.entitlements.models import MonthlyEntitlement
from app.core.security import hash_password
from app.modules.beneficiaries import services as beneficiary_services
from app.modules.entitlements import services as entitlement_services


def seed_data(db: Session):
    # Check if admin already exists
    admin = db.query(User).filter(User.email == "admin@charity.gov").first()
    if admin:
        return  # Already seeded

    print("Seeding database...")

    # 1. Create Platform Admin
    admin = User(
        email="admin@charity.gov",
        phone="01000000001",
        full_name="المدير العام للمنصة",
        hashed_password=hash_password("admin123"),
        role="platform_admin",
        status="active"
    )
    db.add(admin)

    # 2. Create Donors
    donor1 = User(
        email="donor1@gmail.com",
        phone="01111111111",
        full_name="أحمد المحسن",
        hashed_password=hash_password("password123"),
        role="donor",
        status="active"
    )
    donor2 = User(
        email="donor2@gmail.com",
        phone="01222222222",
        full_name="فاطمة الخير",
        hashed_password=hash_password("password123"),
        role="donor",
        status="active"
    )
    db.add_all([donor1, donor2])
    db.commit()

    # 3. Create Beneficiary Users & Profiles
    beneficiaries_data = [
        {
            "email": "beneficiary1@gmail.com",
            "full_name": "محمد حسن علي",
            "category": "A",
            "amount": 7000.0,
            "family_size": 5,
            "children_count": 3,
            "status": "approved",
            "area": "المعادي",
            "has_medical": True
        },
        {
            "email": "beneficiary2@gmail.com",
            "full_name": "سيد محمود عبد الرحمن",
            "category": "B",
            "amount": 5000.0,
            "family_size": 4,
            "children_count": 2,
            "status": "approved",
            "area": "مصر الجديدة",
            "has_education": True
        },
        {
            "email": "beneficiary3@gmail.com",
            "full_name": "عزة إبراهيم محمد",
            "category": "C",
            "amount": 3000.0,
            "family_size": 3,
            "children_count": 1,
            "status": "approved",
            "area": "مدينة نصر",
            "has_housing": True
        },
        {
            "email": "beneficiary4@gmail.com",
            "full_name": "حسين عبد الله سعيد",
            "category": "D",
            "amount": 1500.0,
            "family_size": 2,
            "children_count": 0,
            "status": "approved",
            "area": "الجيزة",
            "has_medical": False
        },
        {
            "email": "beneficiary5@gmail.com",
            "full_name": "أمينة مصطفى كمال",
            "category": None,
            "amount": None,
            "family_size": 6,
            "children_count": 4,
            "status": "pending",
            "area": "إمبابة",
            "has_medical": True
        }
    ]

    for idx, b in enumerate(beneficiaries_data):
        user = User(
            email=b["email"],
            phone=f"015555555{idx}1",
            full_name=b["full_name"],
            hashed_password=hash_password("password123"),
            role="beneficiary",
            status="active"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        profile = BeneficiaryProfile(
            user_id=user.id,
            public_code=f"CASE-{''.join(str(idx)*5)}",  # e.g. CASE-00000
            alias_name=beneficiary_services.generate_alias_name(),
            national_id_encrypted=f"HASH-{hash(user.email)}",
            category=b["category"],
            monthly_entitlement_amount=b["amount"],
            family_size=b["family_size"],
            children_count=b["children_count"],
            dependents_count=b["family_size"] - 1,
            monthly_income=1200.0 if b["category"] else None,
            monthly_rent=800.0 if b["category"] else None,
            employment_status="غير موظف",
            has_medical_needs=b.get("has_medical", False),
            has_education_needs=b.get("has_education", False),
            has_housing_needs=b.get("has_housing", False),
            area=b["area"],
            address_encrypted="العنوان الافتراضي المشفر",
            latitude=30.0444 + (idx * 0.01),
            longitude=31.2357 + (idx * 0.01),
            status=b["status"],
            notes="ملاحظات افتراضية للتدقيق والمتابعة."
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

        # Seed entitlement for approved ones
        if b["status"] == "approved" and b["amount"]:
            ent = MonthlyEntitlement(
                beneficiary_id=profile.id,
                month=entitlement_services.get_month_key(),
                entitled_amount=b["amount"],
                received_amount=0.0,
                remaining_amount=b["amount"],
                is_fully_funded=False
            )
            db.add(ent)
            db.commit()

    print("Seeding database complete!")
