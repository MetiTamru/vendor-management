/** Local-only mock auth — no NestJS / Better Auth required. */

import { isMockEnabled } from "@/lib/mock-mode";

export const MOCK_ADMIN_USER = {
	id: "mock-admin",
	email: "admin@tilla.local",
	name: "Admin User",
	role: "admin",
	roles: ["admin"],
	image: null as string | null,
};

/** Controlled by `NEXT_PUBLIC_USE_MOCK` (see `@/lib/mock-mode`). */
export function isMockAuthEnabled(): boolean {
	return isMockEnabled();
}
