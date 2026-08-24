import { isMockAuthEnabled } from "@/lib/auth/mock-auth";
import type { ServerSessionUser } from "@/lib/auth/server-session";
import type { MeUserDto } from "@/lib/vendor-core/types";

export type AbacUser = {
	id: string;
	roles: string[];
	attributes: Record<string, unknown>;
};

/** Map Django me flags → dashboard ABAC roles. */
export function rolesFromMeUser(user: MeUserDto): string[] {
	const roles: string[] = [];
	if (user.is_superuser || user.is_admin) {
		roles.push("admin");
	}
	if (user.is_staff && !roles.includes("admin")) {
		roles.push("admin");
	}
	if (roles.length === 0) {
		roles.push("user");
	}
	return roles;
}

export function serverUserFromMe(user: MeUserDto): ServerSessionUser {
	const name =
		user.full_name?.trim() ||
		[user.first_name, user.last_name].filter(Boolean).join(" ").trim() ||
		user.username;
	return {
		id: user.id,
		email: user.email,
		name,
		username: user.username,
		image: null,
		role: rolesFromMeUser(user)[0] ?? "user",
		roles: rolesFromMeUser(user),
		is_staff: user.is_staff,
		is_admin: user.is_admin,
		is_superuser: user.is_superuser,
		must_change_password: user.must_change_password,
	};
}

export function resolveAbacUser(
	user: ServerSessionUser | null | undefined
): AbacUser | null {
	if (!user) {
		return null;
	}

	if (isMockAuthEnabled()) {
		return {
			id: user.id,
			roles: ["admin"],
			attributes: {},
		};
	}

	if (process.env.NEXT_PUBLIC_DEV_VENDOR === "true") {
		return {
			id: user.id,
			roles: ["vendor_admin"],
			attributes: { vendorId: "vnd-1" },
		};
	}

	if (process.env.NEXT_PUBLIC_DEV_MANAGER === "true") {
		return {
			id: user.id,
			roles: ["manager", "procurement_manager"],
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

export function resolvePostLoginPath(_roles: string[]): "/" {
	return "/";
}
