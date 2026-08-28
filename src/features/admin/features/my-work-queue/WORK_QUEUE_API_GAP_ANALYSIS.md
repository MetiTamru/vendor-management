# Work Queue API gaps — SFTP / EDI progress tracking

**Date:** 2026-08-28  
**Audience:** Backend team  
**Scope:** New **SFTP** and **EDI** completion tracking on **My Work Queue** (TPA/TPV migration cases). Frontend is implemented with **dummy data** until these APIs exist.  
**Reference UI:** My Work Queue list page + row action sheets “Update SFTP Progress” / “Update EDI Progress”.

---

## 1. What the frontend needs

### 1.1 Dashboard summary (top of list)

Two aggregate cards + a static milestone guide:

| Field                            | Example | Notes                     |
| -------------------------------- | ------- | ------------------------- |
| `sftp_completion.percent`        | `68`    | Integer 0–100             |
| `sftp_completion.complete_count` | `8`     | Cases at 100% SFTP        |
| `sftp_completion.total_count`    | `12`    | All active cases in scope |
| `edi_completion.percent`         | `44`    | Integer 0–100             |
| `edi_completion.complete_count`  | `5`     | Cases at 100% EDI         |
| `edi_completion.total_count`     | `12`    | Same denominator as SFTP  |

**Ask:** Extend existing work-queue KPIs endpoint **or** add a dedicated summary endpoint (see §3).

Milestone definitions (labels + weights) can stay frontend constants unless product wants them configurable.

---

### 1.2 Per-case list fields (table columns)

Each migration case in the list response should include nested progress objects:

```json
{
  "sftp_progress": {
    "percent": 75,
    "current_milestone_key": "credentials_provided",
    "current_milestone_label": "Credentials Provided",
    "last_updated_at": "2026-08-18T14:30:00Z",
    "milestones": [
      {
        "key": "initial_contact_sent",
        "label": "Initial Contact Sent",
        "weight_percent": 10,
        "completed_at": "2026-08-01"
      }
    ],
    "notes": "",
    "updated_by": { "id": "…", "full_name": "Sarah Johnson" },
    "updated_at": "2026-08-19T09:15:00Z"
  },
  "edi_progress": {
    "percent": 50,
    "current_milestone_key": "vendor_mgmt_configured",
    "current_milestone_label": "Vendor Mgmt Configured",
    "last_updated_at": "2026-08-19T09:15:00Z",
    "milestones": [ "…" ],
    "notes": "",
    "updated_by": { "…" },
    "updated_at": "2026-08-19T09:15:00Z"
  }
}
```

**Derived fields** (`percent`, `current_milestone_*`, `last_updated_at`) may be computed server-side from milestone rows.

---

### 1.3 Milestone catalogs (business rules)

#### SFTP track

| Key                    | Label                | Weight % |
| ---------------------- | -------------------- | -------- |
| `initial_contact_sent` | Initial Contact Sent | 10       |
| `second_contact_sent`  | Second Contact Sent  | 20       |
| `response_received`    | Response Received    | 30       |
| `ip_whitelisted`       | IP Whitelisted       | 50       |
| `credentials_provided` | Credentials Provided | 75       |
| `sftp_confirmed`       | SFTP Confirmed       | 100      |

#### EDI track

| Key                      | Label                  | Weight % |
| ------------------------ | ---------------------- | -------- |
| `sftp_complete`          | SFTP Complete          | 25       |
| `vendor_mgmt_configured` | Vendor Mgmt Configured | 50       |
| `testing_complete`       | Testing Complete       | 75       |
| `edi_complete`           | EDI Complete           | 100      |

**Validation rules (recommended):**

1. Milestones within a track are **ordered** — cannot mark a later milestone complete without earlier ones (or auto-fill earlier dates).
2. EDI track should require SFTP at 100% before any EDI milestone (or at least before `sftp_complete`).
3. `notes` max length **500** characters.
4. Completing a milestone sets `completed_at` (date); clearing it removes completion.
5. Writes should append a **history/event** row (same pattern as migration status changes).

---

## 2. What exists today

`MigrationCase` (`core/work_queue/models/migration_case/`) already exposes:

- Identity: `name`, `code`, `vendor_type`, `wave`, `server_type`
- Contacts, migration status, `whitelist_status`, `last_communication_at`
- CRUD + bulk status + import + history events

**Missing:**

- No SFTP milestone storage
- No EDI milestone storage
- No aggregate SFTP/EDI completion on KPIs
- List/detail serializers do not return `sftp_progress` / `edi_progress`

Frontend currently maps live API rows with **empty** progress placeholders (`EMPTY_SFTP_PROGRESS` / `EMPTY_EDI_PROGRESS`).

---

## 3. Suggested API surface

Follow existing `work_queue` resource layout (`apis/migration_case/`, services, selectors, serializers).

### Option A — extend `MigrationCase` (recommended)

**Models** (new nested aggregate or child table):

```text
MigrationCaseSftpMilestone   # FK migration_case, key, completed_at, order
MigrationCaseEdiMilestone    # FK migration_case, key, completed_at, order
MigrationCaseProgressNote    # optional: track + notes + updated_by (or JSON on case)
```

Or a single `MigrationCaseProgressMilestone` with `track` enum (`sftp` | `edi`).

**Endpoints**

| Method  | Path                                                      | Purpose                                                     |
| ------- | --------------------------------------------------------- | ----------------------------------------------------------- |
| `GET`   | `/api/v1/migration-cases/list/`                           | **Extend** list output with `sftp_progress`, `edi_progress` |
| `GET`   | `/api/v1/migration-cases/<uuid:id>/`                      | **Extend** detail with full milestone arrays                |
| `PATCH` | `/api/v1/migration-cases/<uuid:id>/sftp-progress/update/` | Update SFTP milestones + notes                              |
| `PATCH` | `/api/v1/migration-cases/<uuid:id>/edi-progress/update/`  | Update EDI milestones + notes                               |
| `GET`   | `/api/v1/migration-cases/kpis/`                           | **Extend** with `sftp_completion`, `edi_completion`         |

Alternative: one action endpoint  
`POST /api/v1/migration-cases/<uuid:id>/progress/update/` with body `{ "track": "sftp" | "edi", "milestones": [...], "notes": "..." }`.

### Option B — separate tracking resource

Only if progress becomes shared across non–migration-case entities:

```text
GET  /api/v1/work-queue/progress-summary/
GET  /api/v1/work-queue/tracking/list/
PATCH /api/v1/work-queue/tracking/<uuid:id>/sftp-progress/
PATCH /api/v1/work-queue/tracking/<uuid:id>/edi-progress/
```

Prefer **Option A** to avoid duplicating case identity and permissions.

---

## 4. Request / response contracts

### 4.1 Update SFTP progress

`PATCH /api/v1/migration-cases/<uuid:id>/sftp-progress/update/`

**Input**

```json
{
	"milestones": [
		{ "key": "initial_contact_sent", "completed_at": "2026-08-01" },
		{ "key": "second_contact_sent", "completed_at": "2026-08-05" },
		{ "key": "response_received", "completed_at": null }
	],
	"notes": "Vendor responded via email."
}
```

**Output** — same shape as `sftp_progress` in §1.2 (inner envelope payload).

### 4.2 Update EDI progress

`PATCH /api/v1/migration-cases/<uuid:id>/edi-progress/update/`

Same input shape; EDI milestone keys only.

### 4.3 Extended KPIs

`GET /api/v1/migration-cases/kpis/` (existing path — confirm in `urls.py`)

**Add:**

```json
{
	"assigned": 12,
	"connected": 9,
	"in_migration": 5,
	"testing": 3,
	"exceptions": 2,
	"not_started": 1,
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

`percent` = `round(complete_count / total_count * 100)` where “complete” means track at 100%.

---

## 5. Services & events

Suggested service functions:

- `migration_case_sftp_progress_update(*, id, data, requesting_user)`
- `migration_case_edi_progress_update(*, id, data, requesting_user)`
- `migration_case_progress_summary(*, requesting_user)` — for KPI extension

On successful update:

1. Persist milestone rows + notes.
2. Recompute derived percent / current milestone.
3. Create `MigrationCaseEvent` (or equivalent) e.g.  
   `"SFTP progress updated to Credentials Provided (75%) by Sarah Johnson"`.
4. Set case `updated_at`.

---

## 6. Permissions & filtering

- Same authorization as existing migration case update (assigned analyst + admin roles).
- List/KPI summary should respect the same filters as `get_migration_cases` (user scope, soft-delete, etc.).
- Import spreadsheet: define whether milestone columns are supported in CSV or out of scope for v1.

---

## 7. Frontend integration checklist (when ready)

- [ ] Add DTO fields to `MigrationCaseDto` in `src/lib/vendor-core/types.ts`
- [ ] Map API → UI in `workQueueMappers.ts` (replace `EMPTY_*_PROGRESS`)
- [ ] Wire `saveProgress` in `MyWorkQueuePage.tsx` to PATCH endpoints
- [ ] Extend `useWorkQueueKpisQuery` / mapper for `sftp_completion` / `edi_completion`
- [ ] Seed demo data in `work_queue_seed` with varied milestone states

---

## 8. Open questions for product

1. Should **whitelist** and **last communication** remain on the case, or are they fully replaced by SFTP milestones (`ip_whitelisted`, contact milestones)?
2. Is EDI `sftp_complete` auto-set when SFTP hits 100%, or manually confirmed?
3. Are milestone weights fixed globally or configurable per vendor type (TPA vs TPV)?
4. Should bulk “Update status” also advance progress tracks, or stay independent?

---

## 9. Related files (frontend)

| File                                  | Role                                        |
| ------------------------------------- | ------------------------------------------- |
| `pages/MyWorkQueuePage.tsx`           | Summary cards, table columns, update sheets |
| `components/work-queue-progress.tsx`  | Shared progress UI                          |
| `progress-data.ts`                    | Milestone defs + mock summary constants     |
| `mock-data.ts`                        | Dummy per-row progress for mock mode        |
| `feature/mappers/workQueueMappers.ts` | API mapping (stubs today)                   |
