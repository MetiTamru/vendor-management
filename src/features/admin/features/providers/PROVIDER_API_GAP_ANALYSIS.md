# Provider API — backend surface vs frontend wiring

**Date:** 2026-08-28  
**Backend ref:** `vendor-management-core` `core/providers/` (local `main` @ `63a2027` + uncommitted vendor embed on list/detail)  
**Frontend:** `vendor-management-dashboard` provider feature

---

## Backend fetch / merge

`git fetch` / `git pull` against `origin` failed (`Repository not found`). Audit used **local** `vendor-management-core` checkout.

---

## Provider 360 endpoints (backend exists)

| Endpoint                                          | Purpose                                                             |
| ------------------------------------------------- | ------------------------------------------------------------------- |
| `GET /api/v1/providers/list/`                     | Paginated directory                                                 |
| `GET /api/v1/providers/stats/`                    | Dashboard KPI counts                                                |
| `POST /api/v1/providers/create/`                  | Create provider                                                     |
| `GET /api/v1/providers/<id>/`                     | Detail + embedded `profile` (compact) + `tab_counts`                |
| `PATCH /api/v1/providers/<id>/update/`            | Update core provider fields                                         |
| `POST /api/v1/providers/<id>/status/`             | Lifecycle status                                                    |
| `GET /api/v1/providers/<id>/profile/`             | Full profile                                                        |
| `PATCH /api/v1/providers/<id>/profile/update/`    | Profile upsert                                                      |
| `GET /api/v1/providers/<id>/summary/`             | KPI summary (claims12m etc. — values still stubbed `0` in selector) |
| `GET /api/v1/providers/<id>/vendor-sources/list/` | Roster / inbound file sources                                       |
| `GET/POST/PATCH/DELETE …/locations/`              | Practice locations                                                  |
| `GET/POST/PATCH/DELETE …/identifiers/`            | Tax ID, UPIN, Medicaid ID, etc.                                     |
| `GET/POST/PATCH/DELETE …/networks/`               | Network participation                                               |
| `GET/POST/PATCH/DELETE …/credentials/`            | Credentialing rows                                                  |
| `GET/POST/PATCH/DELETE …/exceptions/`             | Open exceptions                                                     |

---

## Frontend wiring status (2026-08-28)

### Wired

| Area                           | Status                                                                                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| List + dashboard stats         | `vendorCoreApi.listProviders`, `getProviderDashboardStats`                                                                                  |
| Create / update core fields    | Wizard → `createProvider` / `updateProvider` + `metadata` fallback                                                                          |
| Status on create/edit          | Separate `setProviderStatus` call                                                                                                           |
| **Profile on create/edit**     | `syncProviderWizardExtras` → `updateProviderProfile` (specialty, practice, credentials, state license, DEA, provider type, enrollment date) |
| **Identifiers on create/edit** | `syncProviderWizardExtras` → create/update Tax ID, UPIN, Medicaid ID via identifiers API                                                    |
| **Detail load**                | Parallel fetch: detail, profile, summary, locations, identifiers, networks, credentials, exceptions, vendor-sources                         |
| Detail tabs data               | Locations, networks, identifiers, credentialing, exceptions, vendors (from vendor-sources)                                                  |
| Profile demographics           | Name, contact, practice address, board cert, medical school, license, DEA from profile API                                                  |
| Edit form load                 | `loadProviderWizardValues` merges provider + profile + identifiers                                                                          |

### Still stubbed / missing on backend

| Frontend field / panel                                      | Backend today                                     |
| ----------------------------------------------------------- | ------------------------------------------------- |
| `preferred_name`, `preferred_language`, `race`, `ethnicity` | No profile fields                                 |
| Claims KPIs (`claims12m`, `encounters12m`, …)               | Summary endpoint exists; selector returns `0`     |
| Trend % fields                                              | No fields / endpoints                             |
| Monthly volume series                                       | No endpoint                                       |
| Top rejection reasons                                       | No endpoint                                       |
| Recent claims / encounters tables                           | No provider-scoped list APIs                      |
| Vendor-sources `data_sent`, `frequency`, feed `status`      | Not on `ProviderVendorSourceListOutputSerializer` |
| First-class Tax ID / UPIN / Medicaid on create body         | Use identifiers API + metadata fallback (wired)   |

### Create wizard — field mapping

| Wizard field                                             | Persisted via                                                             |
| -------------------------------------------------------- | ------------------------------------------------------------------------- |
| NPI, name, taxonomy, entity type, roster, effective date | `POST/PATCH /providers/`                                                  |
| Status                                                   | `POST …/status/`                                                          |
| Specialty, practice, credentials, state license, DEA     | `PATCH …/profile/update/`                                                 |
| Tax ID, UPIN, Medicaid ID                                | `POST/PATCH …/identifiers/` (+ metadata on core provider for legacy rows) |

---

## Recommended backend follow-ups

1. Real claims/encounter aggregates in `get_provider_summary` (not hardcoded `0`).
2. Trend % + monthly volume + rejection reasons + recent claims/encounters endpoints.
3. Demographics: `preferred_name`, `preferred_language`, `race`, `ethnicity` on `ProviderProfile`.
4. Vendor-sources: `data_sent`, `frequency`, `feed_status`.
5. Optional: accept profile + identifier fields on `POST /providers/create/` in one transaction.

---

## Files touched (frontend integration)

- `src/lib/vendor-core/types.ts` — tab DTOs
- `src/lib/vendor-core/api.ts` — tab endpoints + client methods
- `src/features/admin/features/providers/live-providers.ts` — detail mapper
- `src/features/admin/features/providers/feature/api/providersApi.ts` — detail fetch + wizard sync
- `src/features/admin/features/providers/pages/ProviderFormWizard.tsx` — load from profile/identifiers
- `src/features/admin/features/providers/pages/ProviderCreatePage.tsx` — post-create sync
- `src/features/admin/features/providers/pages/ProviderEditPage.tsx` — load + post-update sync
