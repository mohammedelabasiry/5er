# 02_TECHNICAL_ARCHITECTURE.md

# Technical Architecture Document

## 1. Architecture Style

Use a Modular Monolith with Clean Architecture principles.

Do not start with microservices.

Reason:
- Faster MVP delivery.
- Easier local development.
- Easier deployment.
- Lower operational complexity.
- Still scalable if internal modules are well separated.

Each module should own its:
- Models
- Schemas
- Services
- Repositories
- Routes
- Permissions
- Tests

The system should be designed so that future extraction into microservices is possible.

---

## 2. Recommended Stack

### Backend
- FastAPI
- Python 3.11+
- PostgreSQL
- PostGIS
- SQLAlchemy or SQLModel
- Alembic
- Pydantic
- PyJWT or python-jose
- Passlib/bcrypt
- Redis later
- Celery/RQ later

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui style components
- TanStack Query
- React Hook Form
- Zod
- Mapbox or Google Maps abstraction
- Recharts or ECharts
- Framer Motion for subtle animations

### Infrastructure
- Docker
- Docker Compose
- Azure App Service / Azure Container Apps later
- Managed PostgreSQL later
- Azure Blob Storage or S3 later

---

## 3. High-Level Components

1. Web Frontend
2. Backend API
3. PostgreSQL + PostGIS
4. File Storage
5. Redis Cache later
6. Background Worker later
7. External Payment Provider later
8. Notification Provider later
9. AI Services later

---

## 4. Backend Modules

### 4.1 Identity Module
Responsibilities:
- Registration
- Login
- Password hashing
- JWT generation
- User roles
- Permissions
- Current user
- Account status

### 4.2 Beneficiary Module
Responsibilities:
- Beneficiary profile
- Sensitive data
- Public code
- Documents
- Privacy-safe DTOs
- Application status

### 4.3 Evaluation Module
Responsibilities:
- Evaluation questions
- Evaluation answers
- Weighted scoring
- Category recommendation
- Admin approval

### 4.4 Entitlement Module
Responsibilities:
- Monthly entitlement
- Received amount
- Remaining amount
- Fully funded status
- Monthly reset
- Override logic

### 4.5 Donation Module
Responsibilities:
- Donor pledge
- Donation creation
- Donation confirmation
- Mock payment
- Support type handling

### 4.6 Organization Module
Responsibilities:
- Charity onboarding
- Verification
- Staff management
- Organization roles
- Organization funds

### 4.7 Ledger Module
Responsibilities:
- Append-only ledger
- Financial movements
- Resource estimated value
- Reversal/correction
- Hash-chain audit

### 4.8 Campaign Module
Responsibilities:
- Campaign creation
- Campaign donations
- Allocation to beneficiaries
- Campaign reporting

### 4.9 Geo Module
Responsibilities:
- Location storage
- Nearby search
- Radius filtering
- Approximate donor-facing location
- PostGIS queries

### 4.10 Chat Module
Responsibilities:
- Chat threads
- Messages
- Eligibility checks
- Reporting
- Privacy warnings

### 4.11 Admin/Governance Module
Responsibilities:
- Admin dashboards
- User management
- Organization verification
- Override requests
- Fraud alerts

### 4.12 Audit Module
Responsibilities:
- Admin action logs
- Sensitive access logs
- Before/after values
- Reason tracking

### 4.13 Reports Module
Responsibilities:
- Monthly reports
- Organization reports
- Ledger exports
- Beneficiary coverage analytics

### 4.14 AI Module
Responsibilities:
- OCR later
- Duplicate detection later
- Fraud risk scoring later
- Case summarization later
- Recommendation engine later

---

## 5. Backend Folder Structure

Suggested:

```text
backend/
  app/
    main.py
    core/
      config.py
      security.py
      database.py
      permissions.py
      exceptions.py
      logging.py
    modules/
      identity/
        models.py
        schemas.py
        routes.py
        services.py
        repositories.py
        permissions.py
        tests/
      beneficiaries/
      evaluations/
      entitlements/
      donations/
      organizations/
      ledger/
      campaigns/
      geo/
      chat/
      admin/
      audit/
      reports/
      ai/
    shared/
      enums.py
      pagination.py
      events.py
      utils.py
  alembic/
  tests/
  requirements.txt
  Dockerfile
```

---

## 6. Frontend Folder Structure

```text
frontend/
  app/
    page.tsx
    login/
    register/
    dashboard/
    donor/
    beneficiary/
    charity/
    admin/
  components/
    ui/
    layout/
    maps/
    charts/
    forms/
  features/
    auth/
    donor/
    beneficiary/
    charity/
    admin/
    ledger/
    maps/
    chat/
  services/
    api-client.ts
    auth-service.ts
  hooks/
  stores/
  types/
  lib/
  design-system/
  public/
```

---

## 7. Permission Model

Permissions are based on:

1. Role
2. Organization membership
3. Object ownership
4. Case assignment
5. Resource status

Examples:
- Donor can view public beneficiary card only.
- Beneficiary can view own full profile.
- Charity case worker can view beneficiaries assigned to their organization.
- Charity finance officer can confirm approved support requests for their organization.
- Platform admin can view full system.
- Auditor can view logs but cannot edit.

---

## 8. API Versioning

Use:

```text
/api/v1/...
```

---

## 9. Data Privacy Architecture

Use separate schemas:

- BeneficiaryPrivateSchema
- BeneficiaryPublicDonorSchema
- BeneficiaryCharitySchema
- BeneficiaryAdminSchema
- BeneficiaryPlatformAdminSchema

Never reuse admin schema for donor responses.

Store:
- national_id_hash for duplicate detection
- national_id_encrypted for admin-only access
- exact coordinates privately
- approximate area publicly

---

## 10. File Storage Strategy

MVP:
- Local secure storage

Future:
- Azure Blob Storage or S3

Rules:
- Store file metadata in DB.
- Do not expose raw file path.
- Use signed URLs for admin access.
- Audit document views.
- Validate file type and size.

---

## 11. Geo Strategy

Use PostgreSQL + PostGIS.

Store exact beneficiary coordinates privately.

For donor:
- Backend calculates distance.
- Backend returns approximate location only.
- Markers should be jittered or generalized.

Indexes:
- GiST index on beneficiary location geometry.
- Index on visibility status.
- Index on month key.

---

## 12. Monthly Entitlement Update Strategy

All confirmed donations/disbursements must update monthly entitlement inside a database transaction.

Pseudo-flow:
1. Lock entitlement row.
2. Check remaining amount.
3. If requested amount > remaining amount, reject or reduce based on rule.
4. Create donation/support record.
5. Create ledger entry.
6. Update received and remaining amount.
7. If remaining <= 0, mark fully funded.
8. Commit.

---

## 13. Financial Ledger Strategy

Ledger is append-only.

Each entry has:
- previous_entry_hash
- entry_hash

Hash source should include:
- entry type
- source
- destination
- amount
- timestamp
- previous hash
- created by

Corrections are separate entries.

---

## 14. Audit Log Strategy

Audit all:
- Admin overrides
- Document views
- Beneficiary approval/rejection
- Organization verification
- Ledger corrections
- User blocking
- Role changes
- Sensitive exports

Audit fields:
- actor_user_id
- actor_role
- organization_id
- action_type
- target_type
- target_id
- old_value
- new_value
- reason
- ip_address
- user_agent
- created_at

---

## 15. Testing Strategy

Required tests:
- Auth login/register
- RBAC permission tests
- Donor cannot see sensitive data
- Monthly cap prevents overfunding
- Ledger entries cannot be deleted
- Charity cannot access unrelated private case
- Admin override requires reason
- Duplicate detection creates alert
- Nearby search returns eligible cases only

---

## 16. Deployment Strategy

MVP local:
- Docker Compose
- FastAPI backend
- Next.js frontend
- PostgreSQL + PostGIS

Production later:
- Azure Container Apps or App Service
- Azure Database for PostgreSQL
- Azure Blob Storage
- Redis
- Background worker
- Monitoring and logging

Required endpoints:
- `/health`
- `/ready`
- `/api/v1/health`

---

## 17. Scalability Notes

Use:
- Pagination
- Cursor pagination for ledger
- DB indexes
- Caching for lookups
- Background jobs for heavy work
- Async notification pipeline
- Lazy-loaded dashboards
- Virtualized tables

Do not load all beneficiaries or ledger entries at once.
