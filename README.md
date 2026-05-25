# Charity Governance Platform

## Overview

This repository contains planning documents for a scalable charity governance platform.

The product connects beneficiaries, individual donors, charity organizations, charity staff, finance officers, auditors, and platform admins.

The core goal is to ensure that every donation is traceable, every beneficiary is protected, every charity action is auditable, and every monthly support entitlement is controlled to prevent duplicate support and fraud.

## Main Concept

Each beneficiary has an approved monthly support entitlement.

Example:

- Monthly entitlement: 3000 EGP
- Charity A gives 1000 EGP
- Charity B gives 1000 EGP
- Individual donor gives 1000 EGP

The beneficiary is now fully funded for the current month.

If another donor or charity tries to support the same beneficiary again, the system blocks the normal donation and suggests another eligible case, unless an admin emergency override is approved.

## Recommended Stack

### Backend
- FastAPI
- Python
- PostgreSQL
- PostGIS
- SQLAlchemy or SQLModel
- Alembic
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

### Architecture
- Modular Monolith first
- Clean Architecture / Hexagonal Architecture principles
- Future-ready for microservice extraction

## Documents

Read in this order:

1. `PROJECT_RULES.md`
2. `docs/01_PRD.md`
3. `docs/02_TECHNICAL_ARCHITECTURE.md`
4. `docs/03_DATABASE_DESIGN.md`
5. `docs/04_API_SPEC.md`
6. `docs/05_SPRINT_PLAN.md`
7. `docs/06_SECURITY_MODEL.md`
8. `docs/07_UI_UX_GUIDE.md`
9. `docs/08_ANTIGRAVITY_PROMPTS.md`

## How to Use with Antigravity

Open this repository in Antigravity.

Do not ask Antigravity to build the full project at once.

Start with Sprint 1 only using the prompt in:

`docs/08_ANTIGRAVITY_PROMPTS.md`

After each sprint:
1. Copy Antigravity summary.
2. Review it with ChatGPT.
3. Fix issues.
4. Continue to the next sprint.
