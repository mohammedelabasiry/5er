from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.core.database import get_db
from app.core.security import get_current_user, require_role
from app.modules.chat import services as chat_services
from app.modules.chat.models import ChatThread
from app.modules.beneficiaries import services as beneficiary_services

router = APIRouter(prefix="/api/v1/chat", tags=["Chat"])


class ThreadCreateSchema(BaseModel):
    beneficiary_code: str


class SendMessageSchema(BaseModel):
    content: str


class MessageResponseSchema(BaseModel):
    id: int
    thread_id: int
    sender_id: int
    content: str
    created_at: str

    model_config = {"from_attributes": True}


class ThreadResponseSchema(BaseModel):
    id: int
    donor_id: int
    beneficiary_id: int
    beneficiary_code: Optional[str] = None
    beneficiary_alias: Optional[str] = None
    status: str
    created_at: str
    last_message: Optional[str] = None

    model_config = {"from_attributes": True}


@router.post("/threads", response_model=ThreadResponseSchema)
def create_thread_endpoint(
    data: ThreadCreateSchema,
    current_user=Depends(require_role(["donor"])),
    db: Session = Depends(get_db),
):
    profile = beneficiary_services.get_profile_by_code(db, data.beneficiary_code)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Beneficiary profile not found")

    thread = chat_services.get_or_create_thread(db, donor_id=current_user.id, beneficiary_id=profile.id)
    return {
        "id": thread.id,
        "donor_id": thread.donor_id,
        "beneficiary_id": thread.beneficiary_id,
        "beneficiary_code": profile.public_code,
        "beneficiary_alias": profile.alias_name,
        "status": thread.status,
        "created_at": thread.created_at.isoformat(),
        "last_message": ""
    }


@router.get("/threads", response_model=List[ThreadResponseSchema])
def get_threads_endpoint(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    threads = chat_services.get_user_threads(db, user_id=current_user.id, role=current_user.role)
    results = []
    for t in threads:
        # Get last message
        msgs = chat_services.get_thread_messages(db, t.id)
        last_msg = msgs[-1].content if msgs else ""
        results.append({
            "id": t.id,
            "donor_id": t.donor_id,
            "beneficiary_id": t.beneficiary_id,
            "beneficiary_code": t.beneficiary.public_code if t.beneficiary else None,
            "beneficiary_alias": t.beneficiary.alias_name if t.beneficiary else None,
            "status": t.status,
            "created_at": t.created_at.isoformat(),
            "last_message": last_msg
        })
    return results


@router.get("/threads/{thread_id}/messages", response_model=List[MessageResponseSchema])
def get_messages_endpoint(
    thread_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Verify user has access to thread
    thread = db.query(ChatThread).filter(ChatThread.id == thread_id).first()
    if not thread:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Thread not found")

    if current_user.role == "donor" and thread.donor_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    elif current_user.role == "beneficiary":
        # Check if beneficiary owns the profile linked to the thread
        from app.modules.beneficiaries.models import BeneficiaryProfile
        profile = db.query(BeneficiaryProfile).filter(BeneficiaryProfile.user_id == current_user.id).first()
        if not profile or thread.beneficiary_id != profile.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    msgs = chat_services.get_thread_messages(db, thread_id)
    results = []
    for m in msgs:
        results.append({
            "id": m.id,
            "thread_id": m.thread_id,
            "sender_id": m.sender_id,
            "content": m.content,
            "created_at": m.created_at.isoformat()
        })
    return results


@router.post("/threads/{thread_id}/messages", response_model=MessageResponseSchema)
def send_message_endpoint(
    thread_id: int,
    data: SendMessageSchema,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    thread = db.query(ChatThread).filter(ChatThread.id == thread_id).first()
    if not thread:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Thread not found")

    if current_user.role == "donor" and thread.donor_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    elif current_user.role == "beneficiary":
        from app.modules.beneficiaries.models import BeneficiaryProfile
        profile = db.query(BeneficiaryProfile).filter(BeneficiaryProfile.user_id == current_user.id).first()
        if not profile or thread.beneficiary_id != profile.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    msg = chat_services.send_message(db, thread_id=thread_id, sender_id=current_user.id, content=data.content)
    return {
        "id": msg.id,
        "thread_id": msg.thread_id,
        "sender_id": msg.sender_id,
        "content": msg.content,
        "created_at": msg.created_at.isoformat()
    }
