import { cookies } from "next/headers";

import { getAuthSessionUrl } from "@/lib/auth/api-url";
import { isMockAuthEnabled, MOCK_ADMIN_USER } from "@/lib/auth/mock-auth";

export type ServerSessionUser = {
	id: string;
	email?: string | null;
	name?: string | null;
	image?: string | null;
	role?: string | null;
	roles?: string[];
	[key: string]: unknown;
};

export type ServerSession = {
	user: ServerSessionUser;
	session?: Record<string, unknown>;
};

const E2E_SESSION_COOKIE = "e2e-session";

export async function getServerSession(): Promise<ServerSession | null> {
	if (isMockAuthEnabled()) {
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
