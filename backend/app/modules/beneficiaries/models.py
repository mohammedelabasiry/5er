from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class BeneficiaryProfile(Base):
    __tablename__ = "beneficiary_profiles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    public_code = Column(String, unique=True, index=True, nullable=False)
    alias_name = Column(String, nullable=False)
    national_id_encrypted = Column(String, nullable=True)  # Store encrypted or hashed national ID to prevent duplicate registration
    category = Column(String, nullable=True)  # A, B, C, or D
    monthly_entitlement_amount = Column(Float, nullable=True)
    family_size = Column(Integer, nullable=True)
    children_count = Column(Integer, nullable=True)
    dependents_count = Column(Integer, nullable=True)
    monthly_income = Column(Float, nullable=True)
    monthly_rent = Column(Float, nullable=True)
    employment_status = Column(String, nullable=True)
    has_medical_needs = Column(Boolean, default=False)
    has_education_needs = Column(Boolean, default=False)
    has_housing_needs = Column(Boolean, default=False)
    area = Column(String, nullable=True)
    address_encrypted = Column(String, nullable=True)  # Store physical address encrypted
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    status = Column(String, default="pending")  # pending, approved, rejected, blocked
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", backref="profile")
