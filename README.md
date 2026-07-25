# Next.js Frontend Starter

A frontend-only Next.js 15 boilerplate with Better Auth client, Zustand, TanStack Query, and pnpm. Designed to pair with an external NestJS (or any REST) backend.

## Features

- **Next.js 15** — App Router, client components, Turbopack dev
- **Better Auth client** — Sign-in/up against your NestJS API (`NEXT_PUBLIC_API_URL`)
- **Zustand** — Lightweight client state for UI preferences and loaders
- **TanStack Query** — API data caching and mutations
- **next-intl** — Locale routing (`en`, `am`)
- **shadcn/ui** — Accessible components with Tailwind CSS 4
- **pnpm** — Fast, disk-efficient package manager
- **TypeScript** — Strict config with env validation

## Getting started

```bash
cp .env.example .env
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Point `NEXT_PUBLIC_API_URL` at your NestJS backend (default `http://localhost:3001`).

### Environment variables

| Variable              | Description                                        |
| --------------------- | -------------------------------------------------- |
| `NEXT_PUBLIC_URL`     | Next.js frontend URL, e.g. `http://localhost:3000` |
| `NEXT_PUBLIC_APP_URL` | Public app URL (used as fallback)                  |
| `NEXT_PUBLIC_API_URL` | NestJS backend URL, e.g. `http://localhost:3001`   |

## Scripts

| Script              | Description                             |
| ------------------- | --------------------------------------- |
| `pnpm dev`          | Dev server (Turbopack)                  |
| `pnpm build`        | Production build                        |
| `pnpm build:docker` | Standalone build for Docker (Turbopack) |
| `pnpm docker:up`    | Build + pack + run container            |
| `pnpm start`        | Production server                       |
| `pnpm test`         | Jest unit tests                         |
| `pnpm test-all`     | Types, format, lint, test, build        |

## Project structure

```
src/
├── app/[locale]/auth/              # Login, sign-up, forgot-password
├── app/[locale]/admin/groups/      # Groups admin routes
├── features/admin/features/groups/ # Reference feature module
├── components/auth/                # Auth form client islands
├── lib/                            # Auth client, API client, routes
├── stores/                         # Zustand (settings, loaders)
└── providers/                      # App provider tree

infra/                              # Local Docker (runtime-only image)
docs/                               # Architecture & module standards
```

## State management

| Concern        | Tool                              |
| -------------- | --------------------------------- |
| Auth session   | Better Auth client (`useSession`) |
| API data       | TanStack Query                    |
| Theme, fonts   | Zustand + `next-themes`           |
| Global loading | Zustand loader store              |

See [docs/architecture.md](docs/architecture.md).

## Auth routes

Public (no session):

- `/{locale}` — Home
- `/{locale}/auth/login`, `/auth/sign-up`, `/auth/forgot-password`

Protected routes redirect to `/{locale}/auth/login`. Session checks call your NestJS backend at `{NEXT_PUBLIC_API_URL}/api/auth/get-session`.

## Docker (local)

Vercel-style: **build on the host**, **ship a minimal runtime image** (~seconds).

```bash
pnpm docker:up    # build:docker → docker:pack → compose up
pnpm docker:down
pnpm docker:logs
```

See [`infra/README.md`](infra/README.md).
