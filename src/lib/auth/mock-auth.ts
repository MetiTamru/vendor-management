/** Local-only mock auth — no NestJS / Better Auth / Django JWT required. */
import { isMockEnabled } from "@/lib/mock-mode";
import { isDjangoShellAuthEnabled } from "@/lib/vendor-core/auth-mode";

export const MOCK_ADMIN_USER = {
	id: "mock-admin",
	email: "admin@tilla.local",
	name: "Admin User",
	role: "admin",
	roles: ["admin"],
	image: null as string | null,
};

/**
 * App-shell session without a real backend login.
 * - `NEXT_PUBLIC_USE_MOCK=true` — fixtures + open shell
 * - `NEXT_PUBLIC_DEV_ADMIN=true` — Nest-off escape hatch only when Django
 *   shell auth is **not** active (`USE_MOCK=false` + Nest off → Django owns login)
 */
export function isMockAuthEnabled(): boolean {
	if (isMockEnabled()) return true;
	// Live Django JWT owns the shell — do not bypass with DEV_ADMIN
	if (isDjangoShellAuthEnabled()) return false;
	return process.env.NEXT_PUBLIC_DEV_ADMIN === "true";
}
