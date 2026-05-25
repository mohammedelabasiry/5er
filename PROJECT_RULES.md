# PROJECT_RULES.md

## Product Identity

This project is a scalable, governance-first, privacy-first, AI-ready charity platform.

It is not a simple donation CRUD application.

The platform connects:
- Beneficiaries
- Individual donors
- Charity organizations
- Charity staff
- Finance officers
- Auditors
- Platform admins

The platform must make every donation traceable, every beneficiary protected, every charity action auditable, and every monthly entitlement controlled to prevent duplicate support, fraud, and unfair distribution.

---

## Non-Negotiable Rules

### 1. Privacy First

Never expose sensitive beneficiary data to donors or unrelated organizations.

Donors must never see:
- National ID
- Full legal name
- Exact address
- Uploaded documents
- Children birth certificates
- Private notes
- Internal evaluation details
- Exact GPS coordinates
- Internal database IDs

Donors may only see:
- Public beneficiary code
- Privacy-safe alias
- Approximate area
- Support category
- Monthly required amount
- Received amount this month
- Remaining amount this month
- Family count
- Support types needed
- Privacy-safe story/summary

Use separate response schemas for:
- Donor view
- Beneficiary view
- Charity staff view
- Admin view
- Platform super admin view

---

### 2. Governance First

Every money or resource movement must be traceable.

Do not delete financial records.

If a financial mistake happens:
- Create a correction entry
- Or create a reversal entry

Never update or delete ledger history silently.

Every critical action must create an audit log.

---

### 3. Monthly Entitlement Logic

Each beneficiary has one approved monthly support entitlement.

Example:
- Monthly entitlement: 3000 EGP
- Charity A contributes 1000 EGP
- Charity B contributes 1000 EGP
- Individual donor contributes 1000 EGP

Total received = 3000 EGP  
Remaining = 0 EGP  
Status = fully_funded

When fully funded:
- Hide beneficiary from normal donor search for the current month
- Block extra normal support
- Allow extra support only through admin emergency override

Use database transactions and row-level locking or safe transactional logic to prevent overfunding when multiple donations happen at the same time.

---

### 4. Security Rules

Use:
- JWT authentication
- Password hashing
- Role-based access control
- Organization-level access control
- Object-level authorization
- Input validation
- File validation
- API rate limiting where appropriate
- Secure environment variables
- Audit logs
- Encrypted sensitive fields where possible

Do not:
- Store payment card details
- Expose raw document URLs
- Trust frontend authorization
- Put business rules only in frontend
- Use internal IDs in donor-facing URLs when public codes are needed

---

### 5. Architecture Rules

Use a Modular Monolith first.

Do not start with microservices.

The codebase must be organized into modules:
- identity
- beneficiaries
- evaluations
- entitlements
- donations
- organizations
- ledger
- campaigns
- geo
- chat
- admin
- reports
- audit
- ai

Keep business logic out of route files.

Use:
- Routes/controllers for HTTP only
- Services for business rules
- Repositories for database access
- Schemas/DTOs for API input/output
- Models for database entities
- Domain events for cross-module communication where useful

---

### 6. Implementation Rules for Antigravity

Do not build the whole project at once.

Follow sprint plan only.

Before each sprint:
- Read all docs
- Explain implementation plan
- List files to create or modify
- State assumptions

After each sprint:
- List changed files
- List commands run
- List tests run
- Explain how to verify manually
- Mention what was not implemented yet

If requirements conflict:
- Prefer privacy
- Prefer financial correctness
- Prefer auditability
- Prefer maintainability
- Ask for clarification only if truly blocked

---

### 7. UI/UX Rules

UI should feel like:
- A premium governance platform
- A fintech-grade money tracking system
- A respectful beneficiary support system
- A professional charity operations dashboard
- A map-based resource distribution platform

Use:
- Clean layout
- RTL-ready structure
- Modern cards
- Soft shadows
- Clear spacing
- Professional dashboards
- Beautiful map visualization
- Status badges
- Progress bars
- Loading skeletons
- Empty states
- Responsive design

Avoid:
- Humiliating language
- Childish colors
- Crowded pages
- Random UI patterns per page
- Showing sensitive data in donor pages

---

### 8. AI Rules

AI must be advisory only.

AI can:
- Recommend support category
- Extract document data with OCR
- Flag duplicate risk
- Summarize cases
- Suggest donation matching
- Detect anomalies
- Generate reports

AI must not:
- Approve a beneficiary alone
- Reject a beneficiary alone
- Block a beneficiary alone
- Decide final monthly entitlement alone
- Accuse someone of fraud as final truth

Every AI recommendation must include:
- Confidence
- Explanation
- Human review requirement
