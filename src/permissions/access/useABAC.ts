"use client";

import { authClient } from "@/lib/auth-client";
import { resolveAbacUser } from "@/lib/auth/session-user";

import { PolicyEngine } from "../abac/engine";

export const useABAC = () => {
	const { data: session } = authClient.useSession();
	const abacUser = resolveAbacUser(
		session?.user as Parameters<typeof resolveAbacUser>[0]
	);

	const checkAccess = (
		resourceType: string,
		action: string,
		resource?: Record<string, unknown>
	) => {
		if (!abacUser) {
			return false;
		}

		const environment = {
			time: new Date().toLocaleTimeString("en-US", { hour12: false }),
		};

		const context = {
			action,
			user: abacUser,
			resource: {
				type: resourceType,
				attributes: resource ?? {},
			},
			environment,
		};

		return PolicyEngine.evaluate(context);
	};

	return { checkAccess, user: abacUser };
};
