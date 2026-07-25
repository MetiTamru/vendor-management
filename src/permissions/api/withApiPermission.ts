import { NextRequest } from "next/server";

import { PolicyEngine } from "../abac/engine";

export const withApiPermission = (handler: any) => {
	return async (req: NextRequest, context: any) => {
		const user = context.user;
		const pathname = req.nextUrl.pathname;
		const method = req.method;

		const hasPermission = PolicyEngine.evaluate({
			action: method.toLowerCase(),
			user,
			resource: {
				type: "api",
				attributes: { endpoint: pathname },
			},
			environment: {
				time: new Date().toLocaleTimeString(),
				ip: req.headers.get("x-forwarded-for") || "unknown",
			},
		});

		if (!hasPermission) {
			return new Response("Unauthorized", { status: 403 });
		}

		return handler(req, context);
	};
};
