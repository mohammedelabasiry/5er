# 01_PRD.md

# Product Requirements Document  
## Charity Governance Platform

## 1. Product Vision

Build a scalable, governance-first, privacy-first, AI-ready charity platform that coordinates aid between individual donors, verified charity organizations, and beneficiaries.

The platform ensures that:
- Every donation is traceable.
- Every beneficiary is protected.
- Every charity action is auditable.
- Every monthly support entitlement is controlled.
- Duplicate support and overfunding are prevented.
- Aid reaches eligible beneficiaries fairly.

The product should feel like a professional social-impact governance platform, not a simple donation application.

---

## 2. Problem Statement

Traditional charity distribution often suffers from:
- Duplicate support to the same person from multiple sources.
- Lack of visibility across charities.
- Weak tracking of where money went.
- No unified monthly entitlement control.
- Manual, paper-based beneficiary evaluation.
- Potential misuse or theft of donations.
- Beneficiary privacy concerns.
- Poor donor confidence.
- Weak reporting and auditing.

The platform solves this by creating a shared, privacy-safe, auditable aid coordination system.

---

## 3. Target Users

### 3.1 Beneficiary

A person or family applying to receive monthly or one-time charity support.

Needs:
- Respectful onboarding.
- Clear status tracking.
- Privacy protection.
- Easy document upload.
- Fair evaluation.
- Notifications when support is received.

### 3.2 Individual Donor

A person who wants to donate money, food, Eid packages, clothing, medical support, education support, or other resources.

Needs:
- Trust.
- Transparency.
- Easy discovery of eligible cases.
- Nearby support map.
- Anonymous beneficiary cards.
- Donation tracking.
- Confirmation and receipt.

### 3.3 Charity Organization

A verified organization that registers beneficiaries, distributes aid, manages funds, and reports activity.

Needs:
- Case management.
- Shared beneficiary registry.
- Monthly entitlement visibility.
- Finance workflow.
- Reports.
- Audit logs.

### 3.4 Charity Staff / Case Worker

A staff member who registers and verifies beneficiary cases.

Needs:
- Fast case registration.
- Document upload.
- Field visit notes.
- Evaluation forms.
- Support request creation.

### 3.5 Finance Officer

A staff member responsible for confirming money or resource disbursements.

Needs:
- Approved support requests.
- Payment confirmation.
- Receipt upload.
- Ledger entries.
- Reconciliation.

### 3.6 Auditor

A read-only governance user.

Needs:
- Financial records.
- Audit logs.
- Reports.
- Fraud alerts.
- No edit permissions.

### 3.7 Platform Admin

Central platform operator.

Needs:
- Verify organizations.
- Manage users.
- Review cases.
- Manage governance.
- View global ledger.
- Override monthly caps.
- Review fraud alerts.
- Export reports.

---

## 4. Core Product Principles

### 4.1 Privacy by Design

Beneficiaries must not be publicly exposed.

Donors only see:
- Public code
- Anonymous alias
- Approximate area
- Support category
- Monthly required amount
- Received amount this month
- Remaining amount this month
- Family count
- Support types needed

Donors must not see:
- Full legal name
- National ID
- Exact address
- Uploaded documents
- Children birth certificates
- Exact GPS coordinates
- Internal evaluation notes

### 4.2 Governance by Design

Every donation and disbursement must answer:
- Where did the money come from?
- Where did it go?
- Who approved it?
- Who received it?
- Was it within the monthly entitlement?
- Was it cash, transfer, or resource?
- Is there evidence or receipt?

### 4.3 Fair Distribution

Each beneficiary has a monthly entitlement.

Once total support reaches that entitlement, the beneficiary is marked as fully funded and hidden from normal support search until the next monthly cycle.

### 4.4 Human Review

The system may recommend categories, detect duplicates, and flag fraud, but final sensitive decisions must remain human-approved.

---

## 5. Main Roles and Permissions

### Beneficiary

Can:
- Register
- Complete profile
- Upload documents
- Submit application
- View application status
- View approved category
- View monthly support summary
- Receive notifications
- Chat only when allowed

Cannot:
- Edit approved sensitive data without re-review
- See donor private data
- See other beneficiaries

### Donor

Can:
- Register
- Browse anonymous eligible cases
- Filter by distance, category, support type, remaining amount
- View map
- Donate or pledge support
- Chat after donation relation exists
- View donation history

Cannot:
- See sensitive beneficiary details
- See exact location
- Access documents
- Overfund a fully funded case

### Charity Admin

Can:
- Manage organization profile
- Manage staff
- Register and verify beneficiaries
- Approve internal support requests
- View organization reports
- View organization ledger

Cannot:
- See unrelated sensitive records unless authorized
- Delete ledger entries

### Case Worker

Can:
- Add beneficiary cases
- Upload documents
- Add evaluation answers
- Request support

Cannot:
- Approve final money release alone
- Modify financial ledger

### Finance Officer

Can:
- Confirm approved payments
- Confirm resource delivery
- Upload receipt
- Reconcile organization funds

Cannot:
- Change evaluation category alone
- Delete transactions

### Auditor

Can:
- View reports
- View ledger
- View audit logs

Cannot:
- Edit data

### Platform Admin

Can:
- Verify organizations
- Suspend organizations
- Manage system settings
- Override monthly entitlement
- View global analytics
- Resolve fraud alerts
- View full audit logs

---

## 6. Beneficiary Journey

1. Beneficiary creates account.
2. Beneficiary completes onboarding wizard.
3. Beneficiary enters family, income, housing, medical, education, and address data.
4. Beneficiary uploads documents.
5. Beneficiary submits application.
6. System calculates preliminary evaluation score.
7. Case worker or admin reviews documents.
8. Admin approves or rejects.
9. Approved beneficiary receives:
   - Category A/B/C/D
   - Monthly entitlement
   - Support status
10. Beneficiary appears anonymously to donors and charities.
11. When fully funded for the month, beneficiary is hidden from normal support search.
12. At the start of next month, monthly entitlement resets if still active.

---

## 7. Evaluation System

The evaluation system calculates a score based on configurable factors:

- Monthly income
- Number of dependents
- Number of children
- Rent burden
- Employment status
- Medical needs
- Disability/special needs
- Education expenses
- Housing stability
- Debt/urgent commitments
- Existing support sources
- Widow/orphan/family vulnerability

Suggested categories:

| Category | Meaning | Example Monthly Amount |
|---|---|---|
| A | Very critical need | 7000 EGP |
| B | High need | 5000 EGP |
| C | Medium need | 3000 EGP |
| D | Low need / needs review | 1500 EGP |

Important:
- Amounts must be configurable.
- AI/rules recommend only.
- Admin approves final category and monthly amount.

---

## 8. Donor Journey

1. Donor registers.
2. Donor opens dashboard.
3. Donor enables location or selects area.
4. Donor sees nearby eligible cases on a privacy-safe map.
5. Donor filters by:
   - Distance
   - Category
   - Remaining amount
   - Family size
   - Support type
   - Urgency
6. Donor opens anonymous case card.
7. Donor chooses donation amount or resource.
8. System checks remaining monthly entitlement.
9. Donation is created as pledge or payment.
10. Monthly received amount is updated after confirmation.
11. If beneficiary reaches entitlement, case becomes fully funded.
12. Donor tracks history and receipt.

---

## 9. Charity Organization Journey

1. Organization registers.
2. Uploads legal documents.
3. Platform admin verifies organization.
4. Organization adds staff.
5. Case worker registers beneficiaries.
6. Organization links beneficiaries to shared registry.
7. Organization creates support requests.
8. System checks beneficiary remaining entitlement.
9. Charity admin approves.
10. Finance officer confirms payment or delivery.
11. Ledger entry is created.
12. Monthly entitlement is updated.
13. Reports become available.

---

## 10. Monthly Entitlement Logic

Each beneficiary has a monthly entitlement record:

- approved_monthly_entitlement
- received_cash_amount
- received_resource_estimated_value
- total_received_amount
- remaining_amount
- status

Statuses:
- open
- partially_funded
- fully_funded
- suspended
- overridden

Rules:
- Confirmed support reduces remaining amount.
- If remaining amount reaches zero, status becomes fully funded.
- Fully funded beneficiaries are hidden from donor browsing.
- Extra support requires admin override.
- Monthly reset reopens active beneficiaries.

---

## 11. Financial Ledger Logic

Every money/resource movement creates a ledger entry.

Ledger entry types:
- donation_in
- charity_fund_in
- campaign_fund_in
- beneficiary_disbursement_out
- resource_distribution_out
- admin_adjustment
- refund
- reversal
- correction_entry
- transfer_between_funds

Ledger must be append-only.

No delete.

Corrections must be separate entries.

Each entry should include:
- transaction reference
- source
- destination
- amount
- currency
- status
- organization
- beneficiary
- campaign
- created by
- approved by
- confirmed by
- receipt
- timestamp
- previous hash
- current hash

---

## 12. Map-Based Nearby Support Feature

Donor map should show:
- Donor location
- Radius circle: 500m, 1km, 3km, 5km, 10km
- Nearby eligible beneficiaries
- Approximate markers only
- Marker clustering
- Filter sidebar
- Anonymous case cards
- Progress bar per case

Privacy:
- Exact beneficiary coordinates must not be sent to donor frontend.
- Backend calculates distance.
- Frontend receives approximate location only.

Admin map can show more detailed views depending on permission.

---

## 13. Chat Feature

Chat is allowed only when:
- Donor has donation relation with beneficiary
- Or admin permits it
- Or charity staff is assigned to the case

Rules:
- Add privacy warning.
- Do not allow document/card sharing in chat without review.
- Support message reporting.
- Admin can review reported threads.
- Chat should not expose sensitive data automatically.

---

## 14. Dashboards

### Donor Dashboard
- Nearby cases
- Donation history
- Suggested cases
- Fully/partially funded progress
- Receipts

### Beneficiary Dashboard
- Application status
- Approved monthly amount
- Received this month
- Remaining amount
- Notifications
- Messages

### Charity Dashboard
- Total beneficiaries
- Pending support requests
- This month disbursed
- Available funds
- Cases fully funded
- Duplicate alerts
- Ledger summary

### Platform Admin Dashboard
- Total money in
- Total money out
- Total remaining need
- Verified charities
- Pending organizations
- Fully funded beneficiaries
- Fraud alerts
- Overfunding attempts
- Manual overrides
- Heatmap by district

---

## 15. MVP Scope

MVP should include:
1. Auth and roles
2. Beneficiary registration
3. Document upload structure
4. Evaluation scoring
5. Admin approval
6. Monthly entitlement
7. Anonymous donor browsing
8. Nearby map API
9. Donation pledge
10. Charity organization onboarding
11. Charity support request
12. Financial ledger MVP
13. Audit logs
14. Basic dashboards

Not in MVP:
- Real payment gateway
- Advanced AI
- Mobile app
- Government integration
- Blockchain
- Complex OCR

---

## 16. Future Roadmap

Future features:
- Real payment gateways
- AI duplicate detection
- OCR extraction
- Fraud anomaly detection
- WhatsApp notifications
- Mobile app
- Campaigns
- Recurring donations
- Zakat calculator
- Orphan sponsorship
- Medical case workflow
- Education fees workflow
- External audit exports
- Advanced heatmaps
- Route planning for resource delivery

---

## 17. Risks and Mitigations

### Privacy Leakage
Mitigation:
- Separate schemas.
- Strict RBAC.
- Object-level permissions.
- No exact location to donors.

### Overfunding
Mitigation:
- Monthly entitlement transaction locking.
- Backend checks only.
- No frontend-only logic.

### Insider Fraud
Mitigation:
- Approval workflow.
- Audit logs.
- Ledger immutability.
- Role separation.

### Duplicate Beneficiaries
Mitigation:
- National ID hash.
- Phone hash.
- Address similarity.
- Admin review.

### Poor Maintainability
Mitigation:
- Modular monolith.
- Service layer.
- Repository layer.
- Tests.
- Documentation.
