from enum import Enum

class UserRole(str, Enum):
    DONOR = "donor"
    BENEFICIARY = "beneficiary"
    CHARITY_ADMIN = "charity_admin"
    CHARITY_STAFF = "charity_staff"
    FINANCE_OFFICER = "finance_officer"
    AUDITOR = "auditor"
    PLATFORM_ADMIN = "platform_admin"

class EvaluationCategory(str, Enum):
    A = "A"  # 7000 EGP (Very critical)
    B = "B"  # 5000 EGP (High need)
    C = "C"  # 3000 EGP (Medium need)
    D = "D"  # 1500 EGP (Low need)

class EntitlementStatus(str, Enum):
    OPEN = "open"
    PARTIALLY_FUNDED = "partially_funded"
    FULLY_FUNDED = "fully_funded"
    SUSPENDED = "suspended"
    OVERRIDDEN = "overridden"

class SupportType(str, Enum):
    CASH = "cash"
    FOOD_BOX = "food_box"
    CLOTHING = "clothing"
    MEDICAL = "medical"
    EDUCATION = "education"

class ApplicationStatus(str, Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    IN_REVIEW = "in_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    BLOCKED = "blocked"
