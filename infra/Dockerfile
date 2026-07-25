# syntax=docker/dockerfile:1.7
# Runtime-only image (Vercel-style): build on the host, ship standalone output.
#   pnpm build:docker && pnpm docker:pack
#
# Build context must include .next/standalone, .next/static, and public/ only
# (see root .dockerignore — keeps context small and layer cache hot).

FROM node:20-alpine AS runner

RUN apk add --no-cache libc6-compat \
	&& addgroup --system --gid 1001 nodejs \
	&& adduser --system --uid 1001 nextjs

WORKDIR /app

ENV NODE_ENV=production \
	NEXT_TELEMETRY_DISABLED=1 \
	PORT=3000 \
	HOSTNAME=0.0.0.0

COPY --chown=nextjs:nodejs .next/standalone ./
COPY --chown=nextjs:nodejs .next/static ./.next/static
COPY --chown=nextjs:nodejs public ./public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
	CMD node -e "require('http').get('http://127.0.0.1:3000/', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "server.js"]
