# Backend cutover checklist

When your NestJS API is ready, switch the frontend from mocks to live data.

## 1. Environment

In production/staging `.env`:

```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_APP_URL=https://app.your-domain.com
NEXT_PUBLIC_URL=https://app.your-domain.com

# Remove or set to false:
# NEXT_PUBLIC_USE_MOCK_GROUPS=
# NEXT_PUBLIC_USE_MOCK_USERS=
# NEXT_PUBLIC_USE_MOCK_ROLES=
# NEXT_PUBLIC_USE_MOCK_SETTINGS=
# NEXT_PUBLIC_DEV_ADMIN=
# NEXT_PUBLIC_DEV_MANAGER=
```

## 2. Verify contracts

- [Identity groups](./api-contracts/identity-groups.md) — required for admin Groups CRUD
- Users: `GET /api/admin/users/`
- Roles: `GET /api/admin/roles/`
- Settings: `GET /api/admin/settings/`

## 3. Smoke tests

| Flow         | Route                                                   |
| ------------ | ------------------------------------------------------- |
| Login        | `/{locale}/auth/login`                                  |
| Groups list  | `/{locale}/admin/groups`                                |
| Create group | `/{locale}/admin/groups/create`                         |
| Edit group   | `/{locale}/admin/groups/{id}/edit`                      |
| Delete group | From groups table                                       |
| Offline sync | Create while offline → reconnect → pending badge clears |

## 4. CORS and auth

See [api-contracts/README.md](./api-contracts/README.md) for CORS and Better Auth trusted origins.

## 5. Rollback

Re-enable `NEXT_PUBLIC_USE_MOCK_GROUPS=true` (and other mock flags) to isolate frontend issues without changing code.
