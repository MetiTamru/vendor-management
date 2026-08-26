import { cookies } from "next/headers";

import { getAuthSessionUrl } from "@/lib/auth/api-url";
import {
	DEV_SIGNED_OUT_COOKIE,
	isDevSignedOutCookieValue,
} from "@/lib/auth/dev-session";
import { MOCK_ADMIN_USER, isMockAuthEnabled } from "@/lib/auth/mock-auth";
import { isNestApiEnabled } from "@/lib/mock-mode";
import { isDjangoShellAuthEnabled } from "@/lib/vendor-core/auth-mode";
import {
	VENDOR_CORE_SESSION_COOKIE,
	hasVendorCoreSessionCookieValue,
} from "@/lib/vendor-core/session-cookie";

export type ServerSessionUser = {
	id: string;
	email?: string | null;
	name?: string | null;
	image?: string | null;
	role?: string | null;
	roles?: string[];
	username?: string | null;
	[key: string]: unknown;
};

export type ServerSession = {
	user: ServerSessionUser;
	session?: Record<string, unknown>;
};

const E2E_SESSION_COOKIE = "e2e-session";

export async function getServerSession(): Promise<ServerSession | null> {
	if (isMockAuthEnabled()) {
		const cookieStore = await cookies();
		if (
			isDevSignedOutCookieValue(cookieStore.get(DEV_SIGNED_OUT_COOKIE)?.value)
		) {
			return null;
		}
		return {
			user: { ...MOCK_ADMIN_USER },
			session: { mock: true },
		};
	}

	const cookieStore = await cookies();

	if (
		process.env.NODE_ENV === "development" &&
		cookieStore.get(E2E_SESSION_COOKIE)?.value === "1"
	) {
		return {
			user: {
				id: "e2e-user",
				email: "e2e@test.com",
				name: "E2E User",
				role: "admin",
			},
		};
	}

	if (isDjangoShellAuthEnabled()) {
		if (
			!hasVendorCoreSessionCookieValue(
				cookieStore.get(VENDOR_CORE_SESSION_COOKIE)?.value
			)
		) {
			return null;
		}
		// Tokens live in the browser; RSC only knows the session flag.
		// Client providers load full profile via GET /authentication/me/.
		return {
			user: {
				id: "vendor-core-session",
				name: "Signed in",
				role: "admin",
				roles: ["admin"],
			},
			session: { vendorCore: true },
		};
	}

	if (!isNestApiEnabled()) {
		return null;
	}

	const cookieHeader = cookieStore
		.getAll()
		.map((c) => `${c.name}=${c.value}`)
		.join("; ");

	if (!cookieHeader) {
		return null;
	}

	try {
		const response = await fetch(getAuthSessionUrl(), {
			headers: { cookie: cookieHeader },
			cache: "no-store",
			signal: AbortSignal.timeout(5_000),
		});

		if (!response.ok) {
			return null;
		}

		const data = (await response.json()) as {
			user?: ServerSessionUser | null;
			session?: Record<string, unknown>;
		} | null;

		if (!data?.user) {
			return null;
		}

		return {
			user: data.user,
			session: data.session,
		};
	} catch {
		return null;
	}
}
