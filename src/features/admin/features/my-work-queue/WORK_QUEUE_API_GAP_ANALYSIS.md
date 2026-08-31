# TPA/TPV Tracking — Frontend / Backend Integration Gaps

**Date:** 2026-08-31  
**Audience:** Backend team (`vendor-management-core`)  
**Frontend:** `src/features/admin/features/my-work-queue/`  
**Backend app:** `core/work_queue/`  
**Routes:** `/admin/my-work-queue`, `/admin/my-work-queue/[caseId]`

The My Work Queue UI is **implemented in the frontend**. Live mode is wired to `vendor-core` APIs. This document lists what the backend must add or extend so integration testing and production sign-off can complete without mock data.

---

## Summary

| Area | Frontend | Backend today | Blocker |
|------|----------|---------------|---------|
| Dashboard UI (KPIs, analyst table, escalation, table) | **Done** | List + 6 KPI counts exist | P1 read / P0 write for progress |
| Registration form | **Done** | `POST migration-cases/create/` supports full input | **Ready** |
| SFTP / EDI progress display + save | **Done** (UI + API client) | No storage, no PATCH endpoints | **P0** |
| Status fields | **Done** | Status actions + bulk status | **Ready** |
| Analyst assign | **Done** | `POST …/assign/` | **Ready** |
| Search & filters | **Done** (server params in live mode) | `search`, `migration_status`, `assigned_to_id`, `wave`, `limit`, `offset` — **no `escalation_status`** | P1 |
| Three-dot row actions | **Done** (SFTP / EDI / contacts) | Progress PATCH missing → save fails live | **P0** |
| Responsive UI | Partial (table scroll on mobile) | N/A | P2 (frontend only) |

---

## “Done When” sign-off

| Criterion | Frontend ready? | Backend needed |
|-----------|-----------------|----------------|
| UI matches approved design | Yes — live API only; empty progress until backend ships | Return real `sftp_progress`, `edi_progress`, `escalation_status` |
| Add TPA/TPV form saves through backend | Yes — `WorkQueueRegistrationDialog` → `createMigrationCase` | Already supported |
| Existing records viewable / updatable | Partial — info, contacts, status, assign work; progress/escalation do not | Progress read/write + escalation field/filter |
| No hard-coded production data | Yes — mocks removed; all data from `vendor-core` APIs | Backend must own progress/escalation data |
| Ready for integration testing | After backend P0 items | See § Integration test matrix |

---

## Live mode today

All My Work Queue screens are **live-only** (no frontend mock overlay). Honest behavior for QA until backend ships gaps:

| Feature | Live behavior |
|---------|---------------|
| List / detail / CRUD / status / assign / registration | **Works** against existing APIs |
| SFTP / EDI progress bars | **Empty / 0%** — mapper falls back to `EMPTY_SFTP_PROGRESS` / `EMPTY_EDI_PROGRESS` |
| Save SFTP / EDI progress | **Fails** (404) — frontend calls PATCH endpoints not yet on backend |
| Escalation column / filters | **Client-derived** via `work-queue-analyst-escalation.ts` when API `escalation_status` is absent |
| EDI Analyst Progress + Escalation Summary panels | **Client rollups** from first 100 cases; SFTP/EDI % status-estimated until progress API ships |
| KPI “Escalations” card | **Client count** from `countActiveEscalations(summary rows)` |
| SFTP/EDI summary cards (top) | Row math or extended KPI fields when API provides them; zeros when no cases |
| CSV import | **Works** — row-level errors shown in import result dialog |
| Integration source / last sync | Detail overview shows `metadata.source_system` / `last_synced_at` when backend sets them |

---

## Integration layer — frontend boundaries

The enterprise integration scope (File, ADF, Database, API, SharePoint, SFTP connectors) is **backend/infra**. The frontend contract:

> Changing the data source must not require changes to the TPA/TPV UI.

**Frontend responsibility (done):**

- Consume stable `MigrationCaseDto` via `vendor-core` regardless of ingress path
- Map all tracking fields in `workQueueMappers.ts` (`migrationCaseToRow`)
- Manual create (`WorkQueueRegistrationDialog`) and CSV import trigger (`POST work-queue/import/`)
- No hard-coded source paths, credentials, or connector config in the React app

**Not on frontend (by design):**

- Connector registry, ingestion schedulers, mapping config UI, credential storage
- Validation/dedup pipeline (backend import service owns this)
- Integration run history / retry queue admin

**Frontend gaps vs integration acceptance criteria:**

| Criterion | Status |
|-----------|--------|
| Source-agnostic UI | Done |
| Display mapped standard model fields | Done |
| Row-level import validation errors | Done — `WorkQueueImportResultDialog` |
| Source + last sync visible on case | Done when backend populates `metadata` |
| Progress/escalation from API | Blocked on backend P0/P1 |

---

## What exists on the backend today

`MigrationCase` (`core/work_queue/models/migration_case/`) + APIs:

| Capability | Method | Path |
|------------|--------|------|
| Create | POST | `/api/v1/migration-cases/create/` |
| List (paginated) | GET | `/api/v1/migration-cases/list/` |
| Detail | GET | `/api/v1/migration-cases/<uuid:id>/` |
| Update | PATCH | `/api/v1/migration-cases/<uuid:id>/update/` |
| Delete / restore / hard-delete | POST | `…/delete/`, `…/restore/`, `…/hard-delete/` |
| Assign analyst | POST | `/api/v1/migration-cases/<uuid:id>/assign/` |
| Set status | POST | `/api/v1/migration-cases/<uuid:id>/status/` |
| Bulk status | POST | `/api/v1/migration-cases/bulk-status/` |
| Mark testing / ready / waiting / exception / production-ready | POST | `…/mark-*` |
| Events (history) | GET | `/api/v1/migration-cases/<uuid:id>/events/` |
| Document upload | POST | `/api/v1/migration-cases/<uuid:id>/documents/upload/` |
| CSV import | POST | `/api/v1/work-queue/import/` |
| Seed demo data | POST | `/api/v1/work-queue/seed/` |
| KPI counts (6 fields) | GET | `/api/v1/work-queue/kpis/` |

**List query params already supported:** `search`, `migration_status`, `assigned_to_id`, `vendor_id`, `wave`, `whitelist_status`, `current_stage`, `limit`, `offset`, ordering.

**Missing for full frontend integration:**

- `sftp_progress` / `edi_progress` on list + detail responses
- PATCH progress update endpoints
- `escalation_status` field + list filter
- Extended KPIs: `escalations`, `sftp_completion`, `edi_completion`

---

## API contracts the frontend expects

Types live in `src/lib/vendor-core/types.ts`. Mapping in `feature/mappers/workQueueMappers.ts`. Client calls in `feature/api/workQueueApi.ts` and `src/lib/vendor-core/api.ts`.

### A. Extend list + detail output

Add to `MigrationCaseListOutputSerializer` and `MigrationCaseDetailOutputSerializer`:

```json
{
  "escalation_status": "none",
  "sftp_progress": {
    "percent": 75,
    "current_milestone_key": "credentials_provided",
    "current_milestone_label": "Credentials Provided",
    "last_updated_at": "2026-08-18",
    "milestones": [
      {
        "key": "initial_contact_sent",
        "label": "Initial Contact Sent",
        "weight_percent": 10,
        "completed_at": "2026-08-01"
      }
    ],
    "notes": "",
    "updated_by": {
      "id": "…",
      "full_name": "Sarah Johnson",
      "username": "…",
      "email": "…"
    },
    "updated_at": "2026-08-19T09:15:00Z"
  },
  "edi_progress": { }
}
```

`escalation_status` enum: `none` | `escalation_required` | `attention` | `escalated` | `resolved`

When `escalation_status` is `none`, frontend may still derive escalation client-side (`work-queue-analyst-escalation.ts`) from `migration_status` and SFTP milestone state. Prefer server-owned value when set.

### B. Progress update (P0)

| Method | Path | Frontend caller |
|--------|------|-----------------|
| PATCH | `/api/v1/migration-cases/<uuid:id>/sftp-progress/update/` | `vendorCoreApi.updateMigrationCaseSftpProgress` |
| PATCH | `/api/v1/migration-cases/<uuid:id>/edi-progress/update/` | `vendorCoreApi.updateMigrationCaseEdiProgress` |

**Request body** (sent by `connectionProgressToApiInput`):

```json
{
  "milestones": [
    { "key": "initial_contact_sent", "completed_at": "2026-08-01" },
    { "key": "second_contact_sent", "completed_at": null }
  ],
  "notes": "Vendor responded via email."
}
```

- `completed_at`: ISO date `YYYY-MM-DD` or `null` to clear
- `notes`: max **500** characters

**Response:** inner payload with updated case (compact or full row). Frontend refetches detail after save.

**UI entry points:**

- Detail tabs: SFTP / EDI — `WorkQueueDetailPage.saveProgress`
- List row actions — “Update SFTP Progress” / “Update EDI Progress”

### C. Escalation (P1)

**Option 1 (recommended):** `escalation_status` column on `MigrationCase` + auto-derive on progress/status change.

**Option 2:** Computed in selector only (no manual override).

**Optional manual set:**

| Method | Path |
|--------|------|
| POST | `/api/v1/migration-cases/<uuid:id>/escalation/` |

Body: `{ "escalation_status": "escalated" }`

**List filter:** add `escalation_status` to `MigrationCaseListQuerySerializer` and `MigrationCaseFilter`. Frontend passes it from `MyWorkQueuePage` when escalation filter is active.

### D. Extended KPIs (P1)

`GET /api/v1/work-queue/kpis/` — extend existing response:

```json
{
  "assigned": 12,
  "connected": 9,
  "in_migration": 5,
  "testing": 3,
  "exceptions": 2,
  "not_started": 1,
  "escalations": 3,
  "sftp_completion": {
    "percent": 68,
    "complete_count": 8,
    "total_count": 12
  },
  "edi_completion": {
    "percent": 44,
    "complete_count": 5,
    "total_count": 12
  }
}
```

- `escalations`: count cases with status in `escalation_required`, `attention`, `escalated`
- `*_completion.percent`: average track percent across visible cases, or `round(complete_count / total_count * 100)` per product preference
- “Complete” = track at **100%**

Frontend: `kpisToCards` (escalations KPI card), `kpisToProgressSummary` (top summary cards when wave = all).

---

## Milestone catalogs

Definitions match `progress-data.ts` (frontend constants). Backend should enforce the same keys and weights.

### SFTP track

| Key | Label | Weight % |
|-----|-------|----------|
| `initial_contact_sent` | Initial Contact Sent | 10 |
| `second_contact_sent` | Second Contact Sent | 20 |
| `response_received` | Response Received | 30 |
| `ip_whitelisted` | IP Whitelisted | 50 |
| `credentials_provided` | Credentials Provided | 75 |
| `sftp_confirmed` | SFTP Confirmed | 100 |

### EDI track

| Key | Label | Weight % |
|-----|-------|----------|
| `sftp_complete` | SFTP Complete (≥100%) | 25 |
| `vendor_mgmt_configured` | Vendor Mgmt Configured | 50 |
| `testing_complete` | Testing Complete | 75 |
| `edi_complete` | EDI Complete | 100 |

### Validation rules (backend)

1. Milestones within a track are **ordered** — cannot complete a later milestone without earlier ones (or auto-fill earlier `completed_at`).
2. EDI milestones require SFTP at **100%** before any EDI milestone is set.
3. `notes` max length **500**.
4. On successful progress update: append `MigrationCaseEvent` (same pattern as status changes).
5. Recompute derived fields: `percent`, `current_milestone_key`, `current_milestone_label`, `last_updated_at`.

---

## Registration form — already supported

`WorkQueueRegistrationDialog` submits `MigrationCaseCreateInput`:

| Field | API field |
|-------|-----------|
| Name, code, type (TPA/TPV), wave, server type | `name`, `code`, `vendor_type`, `wave`, `server_type` |
| Primary / secondary contacts | `primary_*`, `secondary_*` |
| Assigned analyst | `assigned_to_id` (UUID from users list) |
| Notes, next step | `notes`, `next_step` |

Endpoint: `POST /api/v1/migration-cases/create/`

---

## Analyst assignment — already supported

Detail migration tab saves assign when `assigned_to_id` changes:

| Method | Path | Body |
|--------|------|------|
| POST | `/api/v1/migration-cases/<uuid:id>/assign/` | `{ "assigned_to_id": "<uuid>" \| null }` |

Frontend: `assignMigrationCase` in `workQueueApi.ts` → `WorkQueueDetailPage.saveMigration`.

---

## Suggested backend implementation

Follow existing `core/work_queue/` layout (`apis/migration_case/`, services, selectors, serializers, filters, urls). Reference: `core/claims/apis/claim_line/`.

### Recommended storage

**Option A — JSON on `MigrationCase` (simplest):**

```text
sftp_progress: JSONField  # { completed: { key: date }, notes, updated_at, updated_by_id }
edi_progress: JSONField
escalation_status: CharField(choices=…)
```

**Option B — normalized milestone rows** (better for reporting):

```text
MigrationCaseProgressMilestone  # FK case, track enum, key, completed_at, order
```

### Implementation order

1. Model + migration (`escalation_status`, progress storage)
2. Extend list/detail serializers with progress + escalation
3. Services: `migration_case_sftp_progress_update`, `migration_case_edi_progress_update`
4. Action APIs: PATCH `…/sftp-progress/update/`, `…/edi-progress/update/`
5. Extend `get_work_queue_kpis` + `WorkQueueKpisOutputSerializer`
6. Add `escalation_status` list filter
7. Optional: `POST …/escalation/` for manual override
8. Extend `work_queue_seed` with varied milestone states for UAT

---

## Frontend integration map

| Backend API | Frontend file | Notes |
|-------------|---------------|-------|
| `GET migration-cases/list/` | `workQueueApi.listWorkQueueRowsPage` | Server pagination + filters in live mode |
| `GET migration-cases/<id>/` | `getMigrationCaseDetail` | Detail page |
| `POST migration-cases/create/` | `WorkQueueRegistrationDialog` | Full registration |
| `POST …/assign/` | `WorkQueueDetailPage.saveMigration` | Analyst picker |
| `POST …/status/`, `PATCH …/update/` | Detail + list bulk actions | Working |
| `PATCH …/sftp-progress/update/` | `WorkQueueDetailPage.saveProgress` | **Not on backend yet** |
| `PATCH …/edi-progress/update/` | Same | **Not on backend yet** |
| `GET work-queue/kpis/` | `getWorkQueueKpiCards`, `kpisToProgressSummary` | Needs extended fields |
| `GET …/events/` | `listMigrationCaseHistory` | History tab |

### Key frontend files

| File | Role |
|------|------|
| `pages/MyWorkQueuePage.tsx` | Dashboard, filters, pagination, registration |
| `pages/WorkQueueDetailPage.tsx` | Tabs, progress save, migration/assign |
| `components/work-queue-progress.tsx` | Progress UI + row actions |
| `components/work-queue-analyst-escalation.tsx` | Analyst + escalation panels |
| `components/WorkQueueRegistrationDialog.tsx` | Add TPA/TPV form |
| `feature/mappers/workQueueMappers.ts` | DTO → UI row, progress mapping |
| `feature/api/workQueueApi.ts` | Feature API layer |
| `progress-data.ts` | Milestone defs (mirror on backend) |
| `work-queue-types.ts` | UI types + KPI shell (no demo rows) |
| `work-queue-analyst-escalation.ts` | Client analyst/escalation rollups |
| `components/WorkQueueImportResultDialog.tsx` | CSV import result + row errors |

---

## Integration test matrix (when backend ready)

| # | Test | Pass criteria |
|---|------|---------------|
| 1 | Register new TPA/TPV | Dialog submit → case in list → detail opens |
| 2 | Assign analyst | Migration tab → save → list shows analyst name |
| 3 | Update SFTP milestones | Detail SFTP tab → save → list bar updates → persists refresh |
| 4 | Update EDI milestones | Blocked until SFTP 100%; then save works |
| 5 | Status change | Bulk + detail status → KPI cards update |
| 6 | Escalation filter | Set escalation on case → filter table → KPI escalations count |
| 7 | Search / pagination | Server returns filtered page; counts match |
| 8 | No mock overlay | Live mode: progress/escalation from API only |
| 9 | Import CSV | Existing import flow still works |
| 10 | History | Progress/status changes appear in events tab |

---

## Open questions for product

1. Should **whitelist** / **last communication** stay on the case, or map fully to SFTP milestones?
2. Is EDI `sftp_complete` auto-set when SFTP hits 100%, or manual only?
3. Are milestone weights fixed globally or configurable per TPA vs TPV?
4. Should bulk status updates affect progress tracks, or stay independent?
5. Who can manually set escalation vs server-only derivation?

---

## Optional frontend follow-ups (not backend blockers)

- Remove duplicate page-reset `useEffect` in `MyWorkQueuePage.tsx`
- Mobile card layout for main table (P2)
- Extra row actions: assign, escalate, delete (if design requires)
- Dedicated integration admin page for connector sync jobs (if product wants FE visibility)
