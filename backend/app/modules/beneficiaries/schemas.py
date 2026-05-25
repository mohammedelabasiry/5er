from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class BeneficiaryCreateRequest(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    national_id: Optional[str] = None
    family_size: Optional[int] = None
    children_count: Optional[int] = None
    dependents_count: Optional[int] = None
    monthly_income: Optional[float] = None
    monthly_rent: Optional[float] = None
    employment_status: Optional[str] = None
    has_medical_needs: Optional[bool] = None
    has_education_needs: Optional[bool] = None
    has_housing_needs: Optional[bool] = None
    area: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    notes: Optional[str] = None


class BeneficiaryPublicView(BaseModel):
    public_code: str
    alias_name: str
    area: Optional[str] = None
    category: Optional[str] = None
    monthly_entitlement_amount: Optional[float] = None
    received_this_month: float = 0.0
    remaining_amount: float = 0.0
    family_size: Optional[int] = None
    children_count: Optional[int] = None

    model_config = {"from_attributes": True}


class AdminApproveRequest(BaseModel):
    category: str
    monthly_entitlement_amount: float


class AdminRejectRequest(BaseModel):
    reason: str


class BeneficiaryProfileResponse(BaseModel):
    id: int
    user_id: int
    public_code: str
    alias_name: str
    national_id_encrypted: Optional[str] = None
    category: Optional[str] = None
    monthly_entitlement_amount: Optional[float] = None
    family_size: Optional[int] = None
    children_count: Optional[int] = None
    dependents_count: Optional[int] = None
    monthly_income: Optional[float] = None
    monthly_rent: Optional[float] = None
    employment_status: Optional[Optional[str]] = None
    has_medical_needs: bool
    has_education_needs: bool
    has_housing_needs: bool
    area: Optional[str] = None
    address_encrypted: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
