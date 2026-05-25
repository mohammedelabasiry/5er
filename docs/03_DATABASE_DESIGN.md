# 03_DATABASE_DESIGN.md

# Database Design

Database: PostgreSQL  
Geospatial extension: PostGIS

## 1. Core Design Notes

The database must support:
- Privacy-safe beneficiary identity
- Shared beneficiary registry
- Monthly entitlement control
- Financial ledger
- Organization-level access
- Auditability
- Future AI modules

Sensitive fields should be encrypted or protected where possible.

Do not expose internal IDs in public donor UI. Use public codes.

---

## 2. Tables

## users

Purpose: Store all platform users.

Columns:
- id UUID PK
- email VARCHAR unique nullable
- phone VARCHAR unique nullable
- password_hash TEXT not null
- role VARCHAR not null
- status VARCHAR not null default 'active'
- full_name VARCHAR nullable
- created_at TIMESTAMP
- updated_at TIMESTAMP
- last_login_at TIMESTAMP nullable

Roles:
- donor
- beneficiary
- charity_admin
- charity_staff
- finance_officer
- auditor
- platform_admin

Indexes:
- email
- phone
- role
- status

---

## organizations

Purpose: Verified charity organizations.

Columns:
- id UUID PK
- name VARCHAR not null
- registration_number VARCHAR unique
- legal_type VARCHAR nullable
- status VARCHAR not null default 'pending_review'
- address TEXT nullable
- city VARCHAR nullable
- district VARCHAR nullable
- phone VARCHAR nullable
- email VARCHAR nullable
- verified_at TIMESTAMP nullable
- verified_by_admin_id UUID FK users.id nullable
- created_at TIMESTAMP
- updated_at TIMESTAMP

Statuses:
- pending_review
- verified
- rejected
- suspended
- blocked

Indexes:
- registration_number
- status
- city
- district

---

## organization_users

Purpose: Link users to organizations.

Columns:
- id UUID PK
- organization_id UUID FK organizations.id
- user_id UUID FK users.id
- organization_role VARCHAR not null
- status VARCHAR default 'active'
- created_at TIMESTAMP

Roles:
- charity_admin
- case_worker
- finance_officer
- auditor

Constraints:
- unique organization_id + user_id

Indexes:
- organization_id
- user_id
- organization_role

---

## organization_documents

Purpose: Store charity verification documents.

Columns:
- id UUID PK
- organization_id UUID FK organizations.id
- document_type VARCHAR
- file_path TEXT
- verification_status VARCHAR
- uploaded_at TIMESTAMP
- reviewed_by UUID FK users.id nullable
- reviewed_at TIMESTAMP nullable

---

## beneficiary_profiles

Purpose: Store beneficiary private and public data.

Columns:
- id UUID PK
- user_id UUID FK users.id unique nullable
- public_code VARCHAR unique not null
- alias_name VARCHAR not null
- full_name_encrypted TEXT nullable
- national_id_hash VARCHAR unique nullable
- national_id_encrypted TEXT nullable
- date_of_birth DATE nullable
- marital_status VARCHAR nullable
- employment_status VARCHAR nullable
- monthly_income NUMERIC(12,2) default 0
- rent_amount NUMERIC(12,2) default 0
- family_members_count INT default 1
- children_count INT default 0
- medical_needs TEXT nullable
- education_expenses NUMERIC(12,2) default 0
- address_encrypted TEXT nullable
- city VARCHAR nullable
- district VARCHAR nullable
- latitude_private NUMERIC nullable
- longitude_private NUMERIC nullable
- location GEOGRAPHY(Point, 4326) nullable
- approximate_location_label VARCHAR nullable
- evaluation_score NUMERIC nullable
- recommended_category VARCHAR nullable
- approved_category VARCHAR nullable
- application_status VARCHAR default 'draft'
- visibility_status VARCHAR default 'hidden'
- created_at TIMESTAMP
- updated_at TIMESTAMP

Application statuses:
- draft
- submitted
- under_review
- approved
- rejected
- blocked

Visibility statuses:
- hidden
- visible
- hidden_until_next_month
- suspended

Indexes:
- public_code
- national_id_hash
- application_status
- visibility_status
- approved_category
- city
- district
- GiST index on location

Privacy:
- Donor views must not expose encrypted fields, exact location, documents, or national ID.

---

## beneficiary_documents

Purpose: Store beneficiary uploaded documents.

Columns:
- id UUID PK
- beneficiary_id UUID FK beneficiary_profiles.id
- document_type VARCHAR
- file_path TEXT
- encrypted_file_key_reference TEXT nullable
- verification_status VARCHAR default 'pending'
- uploaded_at TIMESTAMP
- reviewed_by_admin_id UUID FK users.id nullable
- reviewed_at TIMESTAMP nullable

Document types:
- national_id
- birth_certificate
- child_birth_certificate
- income_proof
- rent_contract
- medical_report
- education_expense
- other

Indexes:
- beneficiary_id
- document_type
- verification_status

---

## evaluation_questions

Purpose: Configurable evaluation questions.

Columns:
- id UUID PK
- question_text TEXT
- question_type VARCHAR
- weight NUMERIC(8,2)
- active BOOLEAN default true
- created_at TIMESTAMP
- updated_at TIMESTAMP

---

## evaluation_answers

Purpose: Beneficiary answers.

Columns:
- id UUID PK
- beneficiary_id UUID FK beneficiary_profiles.id
- question_id UUID FK evaluation_questions.id
- answer_value TEXT
- score_value NUMERIC(8,2)
- created_at TIMESTAMP

Indexes:
- beneficiary_id
- question_id

---

## beneficiary_organization_links

Purpose: Link beneficiaries with charities.

Columns:
- id UUID PK
- beneficiary_id UUID FK beneficiary_profiles.id
- organization_id UUID FK organizations.id
- relationship_type VARCHAR
- visibility_permission VARCHAR
- created_at TIMESTAMP

Relationship types:
- created_by
- verified_by
- supported_by
- managed_by

Constraints:
- unique beneficiary_id + organization_id + relationship_type

---

## monthly_beneficiary_entitlements

Purpose: Control monthly support cap.

Columns:
- id UUID PK
- beneficiary_id UUID FK beneficiary_profiles.id
- month_key VARCHAR not null
- approved_entitlement_amount NUMERIC(12,2) not null
- received_cash_amount NUMERIC(12,2) default 0
- received_resource_estimated_value NUMERIC(12,2) default 0
- total_received_amount NUMERIC(12,2) default 0
- remaining_amount NUMERIC(12,2) not null
- status VARCHAR default 'open'
- override_allowed BOOLEAN default false
- override_reason TEXT nullable
- last_updated_at TIMESTAMP

Statuses:
- open
- partially_funded
- fully_funded
- overridden
- suspended

Constraints:
- unique beneficiary_id + month_key
- remaining_amount >= 0 unless override_allowed is true

Indexes:
- beneficiary_id
- month_key
- status
- remaining_amount

Critical:
Use row-level locking during updates to prevent overfunding.

---

## donations

Purpose: Individual donor donations or pledges.

Columns:
- id UUID PK
- donor_id UUID FK users.id
- beneficiary_id UUID FK beneficiary_profiles.id
- amount NUMERIC(12,2)
- donation_type VARCHAR
- status VARCHAR
- payment_provider VARCHAR nullable
- provider_transaction_reference VARCHAR nullable
- month_key VARCHAR
- note TEXT nullable
- created_at TIMESTAMP
- confirmed_at TIMESTAMP nullable
- delivered_at TIMESTAMP nullable

Statuses:
- pending
- pledged
- paid
- confirmed
- delivered
- cancelled
- refunded

Indexes:
- donor_id
- beneficiary_id
- status
- month_key
- created_at

---

## organization_funds

Purpose: Charity internal funds/wallets.

Columns:
- id UUID PK
- organization_id UUID FK organizations.id
- fund_name VARCHAR
- fund_type VARCHAR
- balance NUMERIC(12,2) default 0
- restricted_rules JSONB nullable
- created_at TIMESTAMP
- updated_at TIMESTAMP

Fund types:
- general
- zakat
- sadaqa
- food
- medical
- education
- rent
- eid
- emergency

---

## support_requests

Purpose: Charity support approval workflow.

Columns:
- id UUID PK
- organization_id UUID FK organizations.id
- beneficiary_id UUID FK beneficiary_profiles.id
- requested_by_user_id UUID FK users.id
- approved_by_user_id UUID FK users.id nullable
- finance_confirmed_by_user_id UUID FK users.id nullable
- support_type VARCHAR
- requested_amount NUMERIC(12,2)
- approved_amount NUMERIC(12,2) nullable
- counts_toward_monthly_cap BOOLEAN default true
- status VARCHAR default 'draft'
- reason TEXT nullable
- rejection_reason TEXT nullable
- created_at TIMESTAMP
- approved_at TIMESTAMP nullable
- delivered_at TIMESTAMP nullable

Statuses:
- draft
- pending_approval
- approved
- rejected
- paid
- delivered
- cancelled

Indexes:
- organization_id
- beneficiary_id
- status
- created_at

---

## financial_ledger_entries

Purpose: Append-only financial and resource movement ledger.

Columns:
- id UUID PK
- transaction_reference VARCHAR unique not null
- entry_type VARCHAR not null
- source_type VARCHAR not null
- source_id UUID nullable
- destination_type VARCHAR not null
- destination_id UUID nullable
- organization_id UUID FK organizations.id nullable
- beneficiary_id UUID FK beneficiary_profiles.id nullable
- campaign_id UUID nullable
- amount NUMERIC(12,2) not null
- currency VARCHAR default 'EGP'
- payment_method VARCHAR nullable
- status VARCHAR not null
- month_key VARCHAR nullable
- counts_toward_monthly_cap BOOLEAN default true
- created_by UUID FK users.id
- approved_by UUID FK users.id nullable
- confirmed_by UUID FK users.id nullable
- receipt_file_path TEXT nullable
- notes TEXT nullable
- previous_entry_hash TEXT nullable
- entry_hash TEXT not null
- created_at TIMESTAMP
- confirmed_at TIMESTAMP nullable

Entry types:
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

Rules:
- No delete.
- No silent update.
- Correction or reversal only.

Indexes:
- transaction_reference
- organization_id
- beneficiary_id
- campaign_id
- month_key
- entry_type
- status
- created_at

---

## campaigns

Purpose: Charity/platform campaigns.

Columns:
- id UUID PK
- organization_id UUID FK organizations.id nullable
- title VARCHAR
- description TEXT
- target_amount NUMERIC(12,2)
- collected_amount NUMERIC(12,2) default 0
- distributed_amount NUMERIC(12,2) default 0
- status VARCHAR
- start_date DATE
- end_date DATE nullable
- created_at TIMESTAMP
- updated_at TIMESTAMP

---

## chat_threads

Purpose: Chat relation.

Columns:
- id UUID PK
- donor_id UUID FK users.id nullable
- beneficiary_id UUID FK beneficiary_profiles.id
- organization_id UUID FK organizations.id nullable
- donation_id UUID FK donations.id nullable
- status VARCHAR default 'active'
- created_at TIMESTAMP

---

## chat_messages

Purpose: Messages.

Columns:
- id UUID PK
- thread_id UUID FK chat_threads.id
- sender_id UUID FK users.id
- message_text TEXT
- is_flagged BOOLEAN default false
- created_at TIMESTAMP

---

## audit_logs

Purpose: Audit all sensitive actions.

Columns:
- id UUID PK
- actor_user_id UUID FK users.id
- actor_role VARCHAR
- organization_id UUID FK organizations.id nullable
- action_type VARCHAR
- target_type VARCHAR
- target_id UUID nullable
- old_value JSONB nullable
- new_value JSONB nullable
- reason TEXT nullable
- ip_address VARCHAR nullable
- user_agent TEXT nullable
- created_at TIMESTAMP

Indexes:
- actor_user_id
- organization_id
- action_type
- target_type
- created_at

---

## fraud_alerts

Purpose: Fraud and duplicate warnings.

Columns:
- id UUID PK
- alert_type VARCHAR
- beneficiary_id UUID FK beneficiary_profiles.id nullable
- organization_id UUID FK organizations.id nullable
- severity VARCHAR
- description TEXT
- status VARCHAR default 'open'
- created_at TIMESTAMP
- resolved_by UUID FK users.id nullable
- resolved_at TIMESTAMP nullable

---

## system_settings

Purpose: Configurable business settings.

Columns:
- id UUID PK
- key VARCHAR unique
- value JSONB
- updated_by UUID FK users.id nullable
- updated_at TIMESTAMP

Settings examples:
- category_amounts
- evaluation_weights
- monthly_reset_day
- support_type_cap_rules
- map_privacy_jitter_radius

---

## 3. Preventing Overfunding

Use transaction:

1. Start DB transaction.
2. Select monthly entitlement row FOR UPDATE.
3. Check remaining amount.
4. If requested amount > remaining and no override:
   - reject
   - or reduce amount based on configured rule
5. Create donation/support request confirmation.
6. Create ledger entry.
7. Update entitlement.
8. If remaining becomes zero, set status fully_funded.
9. Commit.

---

## 4. Append-Only Ledger Rule

Financial ledger entries must not be deleted.

Mistakes:
- Use reversal entries.
- Use correction entries.

Add audit logs for corrections and reversals.

---

## 5. Future Extensions

The schema supports future modules:
- AI document OCR
- Advanced fraud detection
- Campaigns
- Mobile apps
- Government exports
- Delivery routing
- Recurring donations
