# Tilla VMS

Admin-only enterprise **Vendor Management System**. Data and auth run on **mocks by default** — no NestJS backend required.

Open [http://localhost:3006/en](http://localhost:3006/en) for the dashboard.

## Getting started

```bash
cp .env.example .env
pnpm install
pnpm dev -p 3006
```

### Mock vs live (one switch)

| Variable               | Role                                                               |
| ---------------------- | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_USE_MOCK` | `true` (default) = mocks; `false` = NestJS auth/REST + vendor-core |

```env
# Demo / local UI without backends
NEXT_PUBLIC_USE_MOCK=true

# Live integration
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_VENDOR_CORE_API_URL=http://localhost:8010
```

Optional: `NEXT_PUBLIC_DEV_ADMIN=true` for client ABAC admin role while developing.

## Modules

Dashboard, Vendors, Members, Providers, Integration Intake, File ops, Claims & Encounters, Reports, Users/Roles/Groups/Settings, and more.

See [docs/vms-ia.md](docs/vms-ia.md) and [docs/backend-cutover.md](docs/backend-cutover.md).
