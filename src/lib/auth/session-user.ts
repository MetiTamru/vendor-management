import type { ServerSessionUser } from "@/lib/auth/server-session";

export type AbacUser = {
	id: string;
	roles: string[];
	attributes: Record<string, unknown>;
};

export function resolveAbacUser(
	user: ServerSessionUser | null | undefined
): AbacUser | null {
	if (!user) {
		return null;
	}

	if (process.env.NEXT_PUBLIC_DEV_ADMIN === "true") {
		return {
			id: user.id,
			roles: ["admin"],
			attributes: {},
		};
	}

	if (process.env.NEXT_PUBLIC_DEV_MANAGER === "true") {
		return {
			id: user.id,
			roles: ["manager"],
			attributes: {},
		};
	}

	const roles: string[] = [];
	if (Array.isArray(user.roles)) {
		roles.push(...user.roles.map(String));
	}
	if (typeof user.role === "string" && user.role) {
		roles.push(user.role);
	}

	return {
		id: user.id,
		roles: [...new Set(roles)],
		attributes: {},
	};
}
