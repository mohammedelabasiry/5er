# 07_UI_UX_GUIDE.md

# UI/UX and Visualization Guide

## 1. Product Feel

The platform should feel like:
- A premium governance platform
- A fintech-grade money tracking system
- A respectful beneficiary support platform
- A professional charity operations dashboard
- A visually impressive map-based aid coordination system

It must not feel like:
- A basic CRUD admin panel
- A cheap donation form
- A crowded charity website
- A system that humiliates beneficiaries

---

## 2. Design Direction

Recommended visual identity:
- Deep navy for trust
- Emerald/teal for charity and positive actions
- Soft amber for highlights
- Neutral gray for secondary text
- Red only for danger/warnings
- White/off-white backgrounds
- Clean spacing
- Rounded cards
- Soft shadows
- Large readable typography

---

## 3. UX Language

Use respectful language.

Prefer:
- Support category
- Family case
- Monthly support
- Verified case
- Remaining support
- Fully supported this month

Avoid:
- Poor
- Very poor
- Weak person
- Poverty level
- Beggar
- Failure

---

## 4. Core Design System Components

Create reusable components:

- Button
- Card
- Badge
- StatusBadge
- ProgressBar
- MetricCard
- DataTable
- EmptyState
- LoadingSkeleton
- CaseCard
- DonationCard
- LedgerEntryCard
- ApprovalTimeline
- AuditTimeline
- FileUploader
- Stepper
- FilterSidebar
- MapMarker
- DashboardLayout
- Modal
- Drawer
- Toast

---

## 5. Donor Experience

Donor should quickly understand:
- Who needs support anonymously
- How much is needed
- How much remains
- How close the case is
- How to help safely

Main donor screens:
- Dashboard
- Nearby map
- Case list
- Anonymous case detail
- Donation modal
- My donations
- Chat

---

## 6. Beneficiary Experience

Beneficiary should feel respected and safe.

Screens:
- Onboarding wizard
- Profile form
- Document upload
- Evaluation questions
- Application status
- Monthly summary
- Messages

UX details:
- Step-by-step wizard
- Autosave draft
- Clear progress
- Friendly validation
- Privacy reassurance

---

## 7. Charity Staff Experience

Staff should work efficiently.

Screens:
- Organization dashboard
- Add beneficiary
- Beneficiary list
- Support requests
- Finance confirmation
- Organization ledger
- Reports

UX details:
- Clear queues
- Status filters
- Approval timeline
- Fast search

---

## 8. Platform Admin Experience

Admin should see governance clearly.

Screens:
- Global dashboard
- Beneficiary review
- Organizations review
- Ledger
- Fraud alerts
- Audit logs
- Monthly entitlements
- Reports

Dashboard KPIs:
- Total donations this month
- Total disbursed
- Total remaining need
- Fully funded beneficiaries
- Partially funded beneficiaries
- Pending cases
- Verified charities
- Fraud alerts
- Manual overrides
- Overfunding attempts

---

## 9. Map Visualization

Donor map:
- Donor location
- Radius circle
- Beneficiary markers
- Marker clusters
- Filter sidebar
- List/map toggle
- Case preview card

Radius:
- 500 meters
- 1 km
- 3 km
- 5 km
- 10 km

Privacy:
- Show approximate markers only.
- Add notice: “Locations are approximate to protect beneficiary privacy.”

Admin map:
- Heatmap of need
- Category distribution
- Organization coverage
- Fully funded vs partially funded
- Resource distribution zones

---

## 10. Dashboard Visualization

Use:
- KPI cards
- Line charts
- Bar charts
- Donut charts
- Progress bars
- Map heatmaps
- Timelines
- Sankey-style donation flow later

Each dashboard must answer:
- Where did money come from?
- Where did it go?
- Who received it?
- What still needs funding?
- Which areas are underserved?
- Which organizations are active?
- Are there suspicious patterns?

---

## 11. RTL and Arabic Readiness

The app should be Arabic-first ready:
- Use layout that can switch to RTL.
- Avoid hardcoded left/right where possible.
- Use logical CSS classes when possible.
- Keep text externalizable.
- Avoid designs that break with Arabic text length.

---

## 12. UI Implementation Notes

Use:
- Tailwind CSS
- shadcn/ui style components
- Consistent spacing tokens
- Consistent status colors
- Responsive layout
- Loading states
- Empty states
- Error states

Do not create random styles per page.

Build a design system first, then pages.
