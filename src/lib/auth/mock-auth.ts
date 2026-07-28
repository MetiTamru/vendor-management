/** Local-only mock auth — no NestJS / Better Auth required. */

export const MOCK_ADMIN_USER = {
	id: "mock-admin",
	email: "admin@tilla.local",
	name: "Admin User",
	role: "admin",
	roles: ["admin"],
	image: null as string | null,
};

/** Defaults to on. Set NEXT_PUBLIC_USE_MOCK_AUTH=false to use real NestJS auth. */
export function isMockAuthEnabled(): boolean {
	return process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== "false";
}
