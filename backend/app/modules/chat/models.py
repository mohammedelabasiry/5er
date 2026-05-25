from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class ChatThread(Base):
    __tablename__ = "chat_threads"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    donor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    beneficiary_id = Column(Integer, ForeignKey("beneficiary_profiles.id"), nullable=False)
    status = Column(String, default="active", nullable=False)  # active, closed
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    donor = relationship("User", backref="threads")
    beneficiary = relationship("BeneficiaryProfile", backref="threads")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    thread_id = Column(Integer, ForeignKey("chat_threads.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    thread = relationship("ChatThread", backref="messages")
    sender = relationship("User")
