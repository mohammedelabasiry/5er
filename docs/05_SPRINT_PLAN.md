# 05_SPRINT_PLAN.md

# Implementation Sprint Plan

## General Rule

Do not build the full project in one sprint.

Each sprint should be small, verifiable, and safe.

After every sprint:
- Run tests.
- Verify manually.
- Review with ChatGPT.
- Fix issues before continuing.

---

## Sprint 1: Project Foundation

Goal:
Create initial full-stack foundation.

Backend:
- FastAPI app
- Health endpoint
- Config management
- Database connection structure
- Modular folders

Frontend:
- Next.js app
- Tailwind setup
- Basic layout
- Health/status page

Infrastructure:
- Docker Compose
- PostgreSQL + PostGIS
- .env.example
- README setup

Do not build:
- Auth
- Beneficiaries
- Donations
- Map
- Chat

Acceptance Criteria:
- Backend runs.
- Frontend runs.
- Database starts.
- Health endpoint works.
- Project folder structure follows architecture.

---

## Sprint 2: Authentication and Roles

Goal:
Build identity foundation.

Backend:
- User model
- Role enum
- Status enum
- Password hashing
- JWT login
- Register endpoint
- Login endpoint
- Me endpoint
- Role-based dependency
- Seed platform admin

Frontend:
- Login page
- Register page
- Basic auth state

Tests:
- Register donor
- Register beneficiary
- Login
- Get current user
- Invalid password fails

Do not build:
- Beneficiary profile
- Organizations
- Donations

Acceptance Criteria:
- User can register and login.
- JWT works.
- Role is stored.
- Protected endpoint works.

---

## Sprint 3: Beneficiary Profile

Goal:
Allow beneficiary to complete profile.

Backend:
- Beneficiary profile model
- Public code generation
- Private fields structure
- Profile create/update
- Own profile endpoint
- Application status

Frontend:
- Beneficiary onboarding wizard
- Basic profile form
- Draft save

Tests:
- Beneficiary creates profile.
- Donor cannot access private profile.
- Public code is unique.

Do not build:
- Evaluation scoring
- Document upload
- Admin approval

---

## Sprint 4: Documents Upload Structure

Goal:
Support secure document metadata and upload.

Backend:
- Beneficiary documents model
- Upload endpoint
- File validation
- Admin-only retrieval structure
- Audit log on document access

Frontend:
- Document upload step
- Upload progress
- Document status list

Tests:
- Beneficiary uploads document.
- Donor cannot access document.
- Admin can list documents.

Do not build:
- OCR
- AI extraction

---

## Sprint 5: Evaluation System

Goal:
Build configurable evaluation and category recommendation.

Backend:
- Evaluation questions
- Evaluation answers
- Weighted scoring service
- Category recommendation
- Admin configurable questions

Frontend:
- Evaluation form
- Score preview for admin only

Tests:
- Score calculated correctly.
- Category recommended.
- Beneficiary cannot approve own category.

Do not build:
- Final admin approval yet if too large

---

## Sprint 6: Admin Approval and Monthly Entitlement

Goal:
Admin approves beneficiary and creates monthly entitlement.

Backend:
- Admin beneficiary list
- Approve endpoint
- Reject endpoint
- Block endpoint
- Monthly entitlement table
- Create current month entitlement on approval
- Audit logs

Frontend:
- Admin dashboard shell
- Applications review table
- Beneficiary review page
- Approval form

Tests:
- Admin approves beneficiary.
- Monthly entitlement created.
- Rejection requires reason.
- Audit log created.

---

## Sprint 7: Donor Anonymous Browsing

Goal:
Donor can browse eligible cases without sensitive data.

Backend:
- Donor beneficiary listing
- Donor public beneficiary detail by public code
- Privacy-safe schema
- Hide fully funded / hidden cases

Frontend:
- Donor dashboard
- Case cards
- Filters
- Progress bars

Tests:
- Donor response excludes sensitive fields.
- Fully funded cases hidden.
- Only approved visible beneficiaries shown.

---

## Sprint 8: Map Nearby Beneficiaries

Goal:
Map-based nearby search.

Backend:
- PostGIS location setup
- Nearby endpoint
- Radius filtering
- Approximate coordinates
- Privacy-safe map response

Frontend:
- Map page
- Radius selector
- Marker cards
- List/map toggle

Tests:
- Nearby endpoint works.
- Exact coordinates not returned.
- Hidden cases not returned.

---

## Sprint 9: Donation Pledge and Monthly Cap

Goal:
Donor can pledge donation and entitlement updates safely.

Backend:
- Donation model
- Create pledge endpoint
- Confirm mock payment endpoint
- Monthly entitlement transaction logic
- Prevent overfunding
- Audit log

Frontend:
- Donation modal/page
- Confirmation state
- My donations page

Tests:
- Donation reduces remaining.
- Donation exceeding remaining is blocked or adjusted.
- Concurrent donation scenario is protected.
- Fully funded status set.

---

## Sprint 10: Charity Organization Onboarding

Goal:
Add organizations.

Backend:
- Organization model
- Organization registration
- Organization documents
- Platform admin verification
- Organization users

Frontend:
- Organization onboarding
- Admin organization review page
- Organization dashboard shell

Tests:
- Organization registers.
- Admin verifies.
- Unverified organization cannot support cases.

---

## Sprint 11: Charity Support Requests

Goal:
Charity can request and approve support.

Backend:
- Support request model
- Create request
- Approve/reject
- Finance confirm payment/delivery
- Entitlement check
- Ledger entry creation

Frontend:
- Support request form
- Approval queue
- Finance confirmation page

Tests:
- Case worker cannot confirm payment.
- Finance officer can confirm approved request.
- Entitlement updates.
- Ledger created.

---

## Sprint 12: Financial Ledger MVP

Goal:
Create strong append-only ledger.

Backend:
- Ledger model
- Hash generation
- Correction entries
- Reversal entries
- Ledger listing
- No delete route
- Audit integration

Frontend:
- Ledger table
- Entry details
- Correction request UI

Tests:
- Ledger entry created.
- Delete impossible.
- Correction creates new entry.
- Hash chain exists.

---

## Sprint 13: Chat MVP

Goal:
Allow controlled chat.

Backend:
- Chat threads
- Chat messages
- Eligibility rules
- Report message

Frontend:
- Chat page
- Thread list
- Message UI
- Privacy warning

Tests:
- Donor can chat only after donation relation.
- Unrelated user cannot read thread.
- Report works.

---

## Sprint 14: Dashboards and Reports

Goal:
Basic dashboards.

Backend:
- Donor summary
- Beneficiary summary
- Charity summary
- Platform admin KPIs
- Monthly report endpoint

Frontend:
- KPI cards
- Charts
- Tables
- Progress visuals

Tests:
- KPIs correct.
- Organization cannot see other organization private dashboard.

---

## Sprint 15: Audit Logs and Fraud Alerts

Goal:
Governance visibility.

Backend:
- Audit log service integration
- Fraud alert model
- Duplicate national ID hash check
- Overfunding attempt alert
- Admin fraud queue

Frontend:
- Audit timeline
- Fraud alerts page

Tests:
- Duplicate creates alert.
- Override creates audit.
- Sensitive document view creates audit.

---

## Sprint 16: UI Polish and RTL

Goal:
Professional UX.

Frontend:
- Design system components
- RTL-ready layout
- Better dashboard layout
- Loading states
- Empty states
- Responsive UI
- Map polish
- Status badges

Do not change business logic unless needed.

Acceptance Criteria:
- UI feels clean, premium, and consistent.
- Mobile and desktop work.
- Arabic RTL can be enabled later easily.

---

## Sprint 17: Security Review and Deployment Prep

Goal:
Prepare for deployment.

Tasks:
- Review permissions
- Add rate limiting
- Add CORS config
- Add Docker production files
- Add health/readiness endpoints
- Add deployment guide
- Add backup notes
- Add test coverage for critical rules

Acceptance Criteria:
- Local deployment works.
- Security issues documented.
- Production readiness checklist exists.
