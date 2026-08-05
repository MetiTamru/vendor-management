# Backend cutover checklist

When your NestJS (and optional Django vendor-core) APIs are ready, switch the frontend from mocks to live data with **one env var**.

## 1. Environment

In staging/production `.env`:

```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_APP_URL=https://app.your-domain.com
NEXT_PUBLIC_URL=https://app.your-domain.com
NEXT_PUBLIC_VENDOR_CORE_API_URL=https://vendor-core.your-domain.com

# Single switch — turns off all mocks (auth, VMS, identity, feature APIs, vendor-core)
NEXT_PUBLIC_USE_MOCK=false

# Optional ABAC overrides — leave unset in production
# NEXT_PUBLIC_DEV_ADMIN=
# NEXT_PUBLIC_DEV_MANAGER=
# NEXT_PUBLIC_DEV_VENDOR=
```

## 2. Verify contracts

- [Identity groups](./api-contracts/identity-groups.md) — required for admin Groups CRUD
- [VMS domain](./api-contracts/vms.md) — vendors, onboarding, RFX, contracts, POs, invoices
- Users: `GET /api/admin/users/`
- Roles: `GET /api/admin/roles/`
- Settings: `GET /api/admin/settings/`
- Feature modules: `GET /api/admin/<module>/` (members, providers, file-management, claim-encounter, …)

## 3. Smoke tests

| Flow         | Route                                                   |
| ------------ | ------------------------------------------------------- |
| Login        | `/{locale}/auth/login`                                  |
| Groups list  | `/{locale}/admin/groups`                                |
| Create group | `/{locale}/admin/groups/create`                         |
| Edit group   | `/{locale}/admin/groups/{id}/edit`                      |
| Delete group | From groups table                                       |
| Integration  | `/{locale}/admin/integration` (vendor-core JWT)         |
| Offline sync | Create while offline → reconnect → pending badge clears |

## 4. CORS and auth

See [api-contracts/README.md](./api-contracts/README.md) for CORS and Better Auth trusted origins.

## 5. Rollback

Set `NEXT_PUBLIC_USE_MOCK=true` and restart to isolate frontend issues without changing code.
