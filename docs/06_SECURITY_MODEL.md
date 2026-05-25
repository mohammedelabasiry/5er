# 06_SECURITY_MODEL.md

# Security and Privacy Model

## 1. Security Philosophy

The platform handles:
- Vulnerable beneficiary data
- National IDs
- Family documents
- Charity finances
- Donation records
- Location data
- Audit records

Therefore, security must be part of the architecture from the beginning.

---

## 2. Authentication

Use JWT authentication.

Requirements:
- Access token
- Refresh token
- Password hashing with bcrypt/argon2
- Account status check on every protected request
- Optional future 2FA for admins and finance officers

---

## 3. Authorization

Use layered authorization:

1. Role-based access control
2. Organization-level access control
3. Object-level permission checks
4. Status-based checks

Examples:
- Donor can view only public beneficiary cards.
- Beneficiary can view only own private data.
- Charity staff can view cases linked to their organization.
- Finance officer can confirm payments only for own organization.
- Platform admin can view global data.

---

## 4. Sensitive Beneficiary Data

Sensitive fields:
- National ID
- Full legal name
- Exact address
- Exact GPS location
- Documents
- Children certificates
- Medical reports
- Internal notes

Rules:
- Encrypt or protect sensitive fields.
- Never expose to donor.
- Never expose to unrelated charity.
- Audit admin access.
- Use separate DTOs.

---

## 5. File Security

Requirements:
- Validate file type.
- Validate file size.
- Store files outside public web root.
- Use signed URLs later.
- Audit document access.
- Do not expose raw file path.
- Restrict documents to admin or authorized organization staff.

---

## 6. Location Privacy

Beneficiary exact coordinates must remain private.

Donor map should receive:
- Approximate coordinates
- General area
- Distance label

Do not send exact latitude/longitude to donor frontend.

---

## 7. Financial Security

Rules:
- Do not store card data.
- Use payment provider tokens/references only.
- Ledger is append-only.
- Corrections and reversals are separate entries.
- Payment confirmation must be auditable.
- Finance actions require role permission.
- Support above remaining entitlement requires override.

---

## 8. Audit Logging

Audit:
- Login failures for admins
- Role changes
- Beneficiary approval/rejection
- Monthly amount override
- Document view
- Organization verification
- Ledger correction/reversal
- User blocking
- Overfunding attempts
- Fraud alert resolution

Audit record must include:
- actor
- role
- organization
- action
- target
- old value
- new value
- reason
- IP
- user agent
- timestamp

---

## 9. Overfunding Protection

Do not rely on frontend.

Backend must:
- Lock entitlement row
- Validate remaining amount
- Update within same transaction
- Reject or adjust excess amount
- Create audit and fraud alert where needed

---

## 10. Common Threats

### Broken Access Control
Mitigation:
- Central permission dependencies.
- Object-level checks.
- Tests.

### Sensitive Data Exposure
Mitigation:
- DTO separation.
- Encryption.
- No raw files.
- No exact location.

### Insider Fraud
Mitigation:
- Role separation.
- Approval workflow.
- Audit logs.
- Ledger immutability.

### Race Conditions
Mitigation:
- Database transactions.
- Row-level locking.
- Idempotency keys for payment confirmation.

### File Upload Attacks
Mitigation:
- Type validation.
- Size limits.
- Storage isolation.
- Antivirus scanning later.

---

## 11. Security Test Cases

Required:
- Donor cannot access admin beneficiary endpoint.
- Donor response contains no national ID.
- Donor response contains no exact location.
- Charity A cannot access Charity B private case.
- Case worker cannot confirm payment.
- Ledger entry cannot be deleted.
- Admin override without reason fails.
- Concurrent donations do not overfund.
