# Tilla VMS

Admin-only enterprise procurement **Vendor Management System**. All data and auth run on **mocks** by default — no NestJS backend required.

Open [http://localhost:3006/en](http://localhost:3006/en) for the procurement dashboard.

## Getting started

```bash
cp .env.example .env
pnpm install
pnpm dev -p 3006
```

Mock flags (on by default):

| Variable                    | Role                                      |
| --------------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_USE_MOCK_AUTH` | Skip Better Auth / NestJS session         |
| `NEXT_PUBLIC_USE_MOCK_VMS`  | Vendors, RFX, contracts, POs, invoices, … |
| `NEXT_PUBLIC_DEV_ADMIN`     | Admin ABAC permissions                    |

## Modules

Dashboard, Vendors, Onboarding, Categories, Sourcing, Contracts, Documents, Compliance, Performance, Purchase orders, Invoices, Approvals, Reports, Users/Roles/Groups/Settings.

See [docs/vms-ia.md](docs/vms-ia.md).
