# 04_API_SPEC.md

# REST API Specification

Base path:

```text
/api/v1
```

All endpoints require authentication unless marked public.

Use role-based and object-level authorization.

---

## 1. Auth APIs

### POST /auth/register

Allowed:
- Public

Request:
```json
{
  "email": "user@example.com",
  "phone": "01000000000",
  "password": "StrongPassword123",
  "role": "donor"
}
```

Allowed roles for self-registration:
- donor
- beneficiary

Other roles must be invited or created by admin.

Response:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "phone": "01000000000",
  "role": "donor",
  "status": "active"
}
```

---

### POST /auth/login

Request:
```json
{
  "identifier": "user@example.com",
  "password": "StrongPassword123"
}
```

Response:
```json
{
  "access_token": "jwt",
  "refresh_token": "jwt",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "role": "donor",
    "status": "active"
  }
}
```

---

### GET /auth/me

Allowed:
- Authenticated users

Response:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "phone": "01000000000",
  "role": "donor",
  "status": "active"
}
```

---

## 2. Beneficiary APIs

### GET /beneficiary/me

Allowed:
- beneficiary

Returns full own profile.

Privacy:
- Only owner can access.

---

### PUT /beneficiary/profile

Allowed:
- beneficiary

Request includes:
- family data
- financial data
- address
- support needs

Sensitive edits after approval should set profile to needs review.

---

### POST /beneficiary/documents

Allowed:
- beneficiary

Upload:
- document_type
- file

Rules:
- Validate type and size.
- Store securely.
- Do not expose to donors.

---

### POST /beneficiary/submit-application

Allowed:
- beneficiary

Effect:
- application_status becomes submitted.
- evaluation can be calculated.
- admin review required.

---

### GET /beneficiary/status

Allowed:
- beneficiary

Response:
```json
{
  "application_status": "under_review",
  "approved_category": null,
  "monthly_entitlement": null,
  "message": "Your application is under review."
}
```

---

### GET /beneficiary/monthly-summary

Allowed:
- beneficiary

Response:
```json
{
  "month_key": "2026-05",
  "approved_entitlement_amount": 3000,
  "total_received_amount": 2000,
  "remaining_amount": 1000,
  "status": "partially_funded"
}
```

---

## 3. Donor APIs

### GET /donor/beneficiaries

Allowed:
- donor

Query:
- category
- support_type
- min_remaining
- max_remaining
- family_size
- page
- limit

Returns privacy-safe list only.

Response item:
```json
{
  "public_code": "BEN-2026-000123",
  "alias_name": "Family A-17",
  "approved_category": "B",
  "approximate_location_label": "Nasr City",
  "family_members_count": 5,
  "support_types": ["food", "rent"],
  "monthly_required_amount": 3000,
  "received_this_month": 2000,
  "remaining_this_month": 1000,
  "funding_status": "partially_funded"
}
```

Forbidden fields:
- national_id
- full_name
- documents
- exact address
- exact coordinates

---

### GET /donor/beneficiaries/nearby

Allowed:
- donor

Query:
- lat
- lng
- radius_meters
- category
- support_type

Response:
```json
{
  "radius_meters": 1000,
  "items": [
    {
      "public_code": "BEN-2026-000123",
      "alias_name": "Family A-17",
      "approximate_lat": 30.0001,
      "approximate_lng": 31.0001,
      "distance_label": "Within 1 km",
      "remaining_this_month": 1000,
      "approved_category": "B"
    }
  ]
}
```

Rules:
- Backend must not return exact beneficiary location.
- Return only visible and not fully funded cases.

---

### GET /donor/beneficiaries/{public_code}

Allowed:
- donor

Returns anonymous case card.

---

### POST /donor/donations

Allowed:
- donor

Request:
```json
{
  "beneficiary_public_code": "BEN-2026-000123",
  "amount": 500,
  "donation_type": "money",
  "note": "Optional"
}
```

Rules:
- Check monthly remaining amount.
- If amount exceeds remaining, return error or allowed adjusted amount.
- Create pending pledge/payment.
- Do not confirm until payment or admin confirmation.

Response:
```json
{
  "donation_id": "uuid",
  "status": "pending",
  "allowed_amount": 500,
  "message": "Donation pledge created."
}
```

---

### GET /donor/donations

Allowed:
- donor

Returns own donation history.

---

## 4. Organization APIs

### POST /organizations/register

Allowed:
- authenticated users or public depending business rule

Creates organization onboarding request.

---

### GET /organizations/me

Allowed:
- organization user

Returns organization profile for user's organization.

---

### POST /organizations/documents

Allowed:
- charity_admin

Upload legal documents.

---

### GET /organizations/users

Allowed:
- charity_admin

List staff.

---

### POST /organizations/users/invite

Allowed:
- charity_admin

Invite staff with role:
- case_worker
- finance_officer
- auditor

---

## 5. Charity Beneficiary APIs

### POST /charity/beneficiaries

Allowed:
- charity_admin
- case_worker

Creates beneficiary case under organization.

---

### GET /charity/beneficiaries

Allowed:
- organization users

Returns organization-accessible cases.

---

### GET /charity/beneficiaries/{id}

Allowed:
- organization users with permission

Returns details based on role.

---

### POST /charity/beneficiaries/{id}/link-to-shared-registry

Allowed:
- charity_admin

Links to global registry after duplicate checks.

---

## 6. Support Request APIs

### POST /charity/support-requests

Allowed:
- case_worker
- charity_admin

Request:
```json
{
  "beneficiary_id": "uuid",
  "support_type": "cash",
  "requested_amount": 1000,
  "counts_toward_monthly_cap": true,
  "reason": "Monthly support"
}
```

Rules:
- Check remaining entitlement.
- If exceeds remaining, require override or reduce.

---

### POST /charity/support-requests/{id}/approve

Allowed:
- charity_admin

Approves request.

---

### POST /charity/support-requests/{id}/reject

Allowed:
- charity_admin

Requires rejection reason.

---

### POST /charity/support-requests/{id}/confirm-payment

Allowed:
- finance_officer

Effects:
- Create ledger entry.
- Update entitlement.
- Update organization fund.
- Create audit log.

---

## 7. Admin APIs

### GET /admin/dashboard

Allowed:
- platform_admin

Returns global KPIs.

---

### GET /admin/beneficiaries

Allowed:
- platform_admin

Filters:
- status
- category
- city
- district
- funding_status

---

### GET /admin/beneficiaries/{id}

Allowed:
- platform_admin

Can view full details.

---

### POST /admin/beneficiaries/{id}/approve

Allowed:
- platform_admin

Request:
```json
{
  "approved_category": "B",
  "monthly_entitlement_amount": 5000,
  "reason": "Verified documents and evaluation score."
}
```

Effects:
- application_status = approved
- visibility_status = visible
- create monthly entitlement
- audit log

---

### POST /admin/beneficiaries/{id}/reject

Requires reason.

---

### POST /admin/beneficiaries/{id}/block

Requires reason.

---

### POST /admin/beneficiaries/{id}/reopen-current-month

Requires reason.

Allows beneficiary to receive more support this month.

---

## 8. Ledger APIs

### GET /ledger/entries

Allowed:
- platform_admin
- organization auditor for own organization
- finance officer for own organization

Supports pagination and filters.

---

### POST /ledger/correction

Allowed:
- platform_admin
- authorized finance role

Creates correction entry.

Requires reason.

---

### POST /ledger/reversal

Allowed:
- platform_admin
- authorized finance role

Creates reversal entry.

Requires reason.

---

## 9. Chat APIs

### GET /chat/threads

Allowed:
- users with thread access

---

### POST /chat/threads

Allowed:
- donor after donation relation exists
- assigned charity staff
- admin

---

### GET /chat/threads/{id}/messages

Allowed:
- participants
- admin for reported threads

---

### POST /chat/threads/{id}/messages

Rules:
- Sender must be participant.
- Do not allow blocked users.
- Add moderation hooks later.

---

### POST /chat/messages/{id}/report

Allowed:
- participants

---

## 10. Reports APIs

### GET /reports/monthly-summary

Allowed:
- platform_admin
- organization admins for own organization

---

### GET /reports/organization/{organization_id}

Allowed:
- platform_admin
- organization admin for own organization

---

### GET /reports/beneficiary/{beneficiary_id}

Allowed:
- platform_admin
- authorized organization users

---

## 11. Error Format

Use consistent error format:

```json
{
  "error_code": "MONTHLY_ENTITLEMENT_EXCEEDED",
  "message": "This beneficiary has already received the full approved support amount for the current month.",
  "details": {
    "remaining_amount": 0
  }
}
```

Common errors:
- UNAUTHORIZED
- FORBIDDEN
- VALIDATION_ERROR
- NOT_FOUND
- MONTHLY_ENTITLEMENT_EXCEEDED
- ORGANIZATION_NOT_VERIFIED
- BENEFICIARY_NOT_VISIBLE
- DONOR_PRIVACY_RESTRICTED
- LEDGER_ENTRY_IMMUTABLE
- OVERRIDE_REASON_REQUIRED
