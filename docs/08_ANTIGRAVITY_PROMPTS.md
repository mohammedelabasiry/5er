# 08_ANTIGRAVITY_PROMPTS.md

# Antigravity Prompt Bank

Use these prompts step by step.

Do not ask Antigravity to build the full product at once.

---

## Prompt 0: Repository Understanding

```text
You are working inside this repository.

First, read:
- PROJECT_RULES.md
- docs/01_PRD.md
- docs/02_TECHNICAL_ARCHITECTURE.md
- docs/03_DATABASE_DESIGN.md
- docs/04_API_SPEC.md
- docs/05_SPRINT_PLAN.md
- docs/06_SECURITY_MODEL.md
- docs/07_UI_UX_GUIDE.md

Do not code yet.

Summarize:
1. What this product is.
2. The main modules.
3. The privacy rules.
4. The monthly entitlement rules.
5. The financial ledger rules.
6. The recommended tech stack.
7. The sprint order.

Then wait for the sprint instruction.
```

---

## Sprint 1 Prompt: Project Foundation

```text
You are working inside this repository.

Read:
- PROJECT_RULES.md
- docs/01_PRD.md
- docs/02_TECHNICAL_ARCHITECTURE.md
- docs/05_SPRINT_PLAN.md

Implement Sprint 1 only.

Sprint 1 goal:
Create the initial project foundation.

Build:
1. Backend FastAPI app structure
2. Frontend Next.js app structure
3. Shared README setup notes
4. Docker Compose for local development
5. PostgreSQL with PostGIS service
6. Basic environment configuration
7. Backend health check endpoint
8. Basic modular monolith folder structure
9. Basic linting/formatting setup if practical

Do not build:
- Authentication
- Beneficiary profile
- Evaluation
- Donations
- Charity organizations
- Map
- Chat
- Ledger

Before coding:
- Create an implementation plan.
- List files you will create or modify.
- Explain assumptions.

After coding:
- Show changed files.
- Show how to run backend.
- Show how to run frontend.
- Show how to run database.
- Show health check verification.
```

---

## Sprint 2 Prompt: Authentication and Roles

```text
Now implement Sprint 2 only.

Sprint 2 goal:
Build authentication and role-based access foundation.

Build:
- User model
- Role enum
- User status enum
- Password hashing
- JWT login
- Register endpoint
- Login endpoint
- Current user endpoint
- Basic role-based dependency
- Alembic migration
- Seed platform admin user
- Tests for register/login/me

Roles:
- donor
- beneficiary
- charity_admin
- charity_staff
- finance_officer
- auditor
- platform_admin

Important:
- Only donor and beneficiary can self-register.
- Other roles should be created/invited later.
- Do not build beneficiary profile yet.
- Do not build organizations yet.
- Do not build donations yet.

Follow PROJECT_RULES.md.

After implementation, provide:
- Changed files
- Migration commands
- Test commands
- How to verify login flow
```

---

## Sprint 3 Prompt: Beneficiary Profile

```text
Implement Sprint 3 only.

Goal:
Build beneficiary profile foundation.

Build:
- BeneficiaryProfile model
- Public beneficiary code generation
- Private fields structure
- Beneficiary own profile create/update endpoint
- Beneficiary own profile get endpoint
- Application status field
- Privacy-safe schema foundation

Important privacy:
Donor must not access beneficiary private data.
Do not expose national ID, full name, documents, exact address, or exact location.

Frontend:
- Beneficiary onboarding page shell
- Profile form
- Draft save flow

Tests:
- Beneficiary can create own profile.
- Public code is unique.
- Donor cannot access private beneficiary profile.

Do not build:
- Evaluation
- Document upload
- Admin approval
```

---

## Sprint 4 Prompt: Document Upload

```text
Implement Sprint 4 only.

Goal:
Build secure document upload structure.

Build:
- BeneficiaryDocument model
- Upload endpoint
- File type and size validation
- Secure file path handling
- Admin-only document metadata endpoint
- Audit log entry when document is viewed

Frontend:
- Document upload step
- Upload progress
- Document list/status

Privacy:
Donors must never access documents.
Unrelated charities must not access documents.

Do not build OCR yet.
```

---

## Sprint 5 Prompt: Evaluation

```text
Implement Sprint 5 only.

Goal:
Build configurable beneficiary evaluation system.

Build:
- EvaluationQuestion model
- EvaluationAnswer model
- CRUD for admin evaluation questions
- Beneficiary answer submission
- Weighted score calculation service
- Category recommendation A/B/C/D
- System settings for category thresholds and default amounts

Important:
The automatic score is recommendation only.
Admin approval is still required.

Tests:
- Score calculation works.
- Category recommendation works.
- Beneficiary cannot approve own category.
```

---

## Sprint 6 Prompt: Admin Approval and Monthly Entitlement

```text
Implement Sprint 6 only.

Goal:
Admin can approve beneficiary and create monthly entitlement.

Build:
- Admin beneficiary review list
- Admin beneficiary detail
- Approve endpoint
- Reject endpoint
- Block endpoint
- MonthlyBeneficiaryEntitlement model
- Create current month entitlement on approval
- Audit logs for approval/rejection/block

Rules:
- Approval requires category and monthly entitlement amount.
- Rejection requires reason.
- Block requires reason.

Tests:
- Admin approves beneficiary.
- Monthly entitlement created.
- Rejection without reason fails.
- Audit log created.
```

---

## Sprint 7 Prompt: Donor Anonymous Browsing

```text
Implement Sprint 7 only.

Goal:
Donor can browse approved visible beneficiaries anonymously.

Build:
- Donor beneficiary list endpoint
- Donor beneficiary detail by public_code
- Privacy-safe donor response schema
- Filtering by category, support type, remaining amount
- Hide fully funded beneficiaries
- Hide blocked/suspended beneficiaries

Frontend:
- Donor dashboard
- Case cards
- Progress bars
- Filters

Tests:
- Donor response does not include sensitive fields.
- Fully funded cases are hidden.
- Only approved visible beneficiaries appear.
```

---

## Sprint 8 Prompt: Map Nearby Beneficiaries

```text
Implement Sprint 8 only.

Goal:
Build privacy-safe nearby beneficiary search.

Build:
- PostGIS location support
- Nearby endpoint with lat/lng/radius
- Radius filters: 500m, 1km, 3km, 5km, 10km
- Approximate coordinates in donor response
- Do not return exact beneficiary coordinates
- Marker clustering support if practical

Frontend:
- Map page
- Radius selector
- Filter sidebar
- Case marker preview
- List/map toggle

Tests:
- Nearby endpoint returns eligible cases.
- Exact coordinates are not returned.
- Hidden/fully funded cases are not returned.
```

---

## Sprint 9 Prompt: Donation Pledge and Cap Logic

```text
Implement Sprint 9 only.

Goal:
Donor can create donation pledge and system prevents overfunding.

Build:
- Donation model
- Create donation pledge endpoint
- Mock confirm payment endpoint
- Entitlement update service using database transaction
- Prevent donations above remaining amount unless override
- Mark beneficiary fully funded when remaining reaches zero
- Ledger entry stub or integration if ledger exists
- Audit log for overfunding attempt

Frontend:
- Donation modal
- Amount input
- Confirmation state
- My donations page

Tests:
- Donation reduces remaining amount.
- Donation exceeding remaining is blocked.
- Fully funded status is set.
- Donor cannot donate to hidden beneficiary.
```

---

## Sprint 10 Prompt: Charity Organization Onboarding

```text
Implement Sprint 10 only.

Goal:
Build charity organization onboarding.

Build:
- Organization model
- Organization registration endpoint
- Organization documents
- Organization users
- Platform admin verify/reject organization
- Organization dashboard shell

Rules:
- Only verified organizations can support cases.
- Staff roles belong to organization.

Tests:
- Organization registers.
- Admin verifies organization.
- Unverified organization cannot create support request.
```

---

## General Review Prompt for ChatGPT After Each Sprint

```text
Review this sprint implementation.

Check:
- Does it follow PROJECT_RULES.md?
- Does it match the architecture?
- Is it scalable and maintainable?
- Are there privacy or security mistakes?
- Are business rules in the right layer?
- Are there missing tests?
- Is anything over-engineered?
- What must be fixed before the next sprint?

Here is the Antigravity summary:
[PASTE SUMMARY HERE]
```
