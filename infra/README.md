# Infrastructure — local Docker

Vercel-style flow: **build on the host**, **run a minimal runtime image**. No `pnpm install` or `next build` inside Docker — image builds in seconds.

## Quick start

```bash
cp .env.example .env   # configure NEXT_PUBLIC_* URLs
pnpm install
pnpm docker:up         # build + start
```

Or step by step:

```bash
pnpm build:docker      # Next.js standalone output (Turbopack)
pnpm docker:pack       # Docker image (~10–30s)
pnpm docker:run        # compose up -d
curl http://localhost:3000
```

## Layout

| File                 | Purpose                                                    |
| -------------------- | ---------------------------------------------------------- |
| `Dockerfile`         | Runtime-only (copies `.next/standalone`, static, `public`) |
| `docker-compose.yml` | Single `app` service                                       |
| `Makefile`           | `make pack`, `make up`, `make down`                        |

## Environment

Compose loads `../.env`. Required at runtime:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL` (NestJS backend — not used by the container itself, but baked into the client bundle at build time)

Build the Docker image **after** setting env vars so `NEXT_PUBLIC_*` values are embedded in the client bundle.
