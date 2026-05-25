from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    donor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    beneficiary_id = Column(Integer, ForeignKey("beneficiary_profiles.id"), nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String, default="pledged", nullable=False)  # pledged, confirmed, cancelled
    message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    donor = relationship("User", backref="donations")
    beneficiary = relationship("BeneficiaryProfile", backref="donations")
