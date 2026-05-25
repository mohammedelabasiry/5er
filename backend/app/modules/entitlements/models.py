from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base


class MonthlyEntitlement(Base):
    __tablename__ = "monthly_entitlements"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    beneficiary_id = Column(Integer, ForeignKey("beneficiary_profiles.id"), nullable=False)
    month = Column(String, nullable=False)  # Format: YYYY-MM
    entitled_amount = Column(Float, nullable=False)
    received_amount = Column(Float, default=0.0, nullable=False)
    remaining_amount = Column(Float, nullable=False)
    is_fully_funded = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        UniqueConstraint("beneficiary_id", "month", name="uq_beneficiary_month"),
    )

    beneficiary = relationship("BeneficiaryProfile", backref="entitlements")
