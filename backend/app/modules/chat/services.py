from sqlalchemy.orm import Session
from app.modules.chat.models import ChatThread, ChatMessage
from app.modules.beneficiaries.models import BeneficiaryProfile


def get_or_create_thread(db: Session, donor_id: int, beneficiary_id: int) -> ChatThread:
    thread = db.query(ChatThread).filter(
        ChatThread.donor_id == donor_id,
        ChatThread.beneficiary_id == beneficiary_id
    ).first()

    if not thread:
        thread = ChatThread(
            donor_id=donor_id,
            beneficiary_id=beneficiary_id,
            status="active"
        )
        db.add(thread)
        db.commit()
        db.refresh(thread)

    return thread


def send_message(db: Session, thread_id: int, sender_id: int, content: str) -> ChatMessage:
    msg = ChatMessage(
        thread_id=thread_id,
        sender_id=sender_id,
        content=content
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


def get_thread_messages(db: Session, thread_id: int):
    return db.query(ChatMessage).filter(ChatMessage.thread_id == thread_id).order_by(ChatMessage.created_at.asc()).all()


def get_user_threads(db: Session, user_id: int, role: str):
    if role == "donor":
        return db.query(ChatThread).filter(ChatThread.donor_id == user_id).all()
    elif role == "beneficiary":
        profile = db.query(BeneficiaryProfile).filter(BeneficiaryProfile.user_id == user_id).first()
        if not profile:
            return []
        return db.query(ChatThread).filter(ChatThread.beneficiary_id == profile.id).all()
    elif role in ("platform_admin", "charity_admin", "charity_staff"):
        # Admins can see all threads
        return db.query(ChatThread).all()
    return []
