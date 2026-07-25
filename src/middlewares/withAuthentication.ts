import { type NextFetchEvent, type NextRequest } from "next/server";

import { handleAuth } from "@/middlewares/auth";

import { type MiddlewareFactory } from "./types";

/** @deprecated Use explicit pipeline in src/middleware.ts */
export const withAuthentication: MiddlewareFactory = (next) => {
	return async (request: NextRequest, event: NextFetchEvent) => {
		const authResponse = await handleAuth(request);
		if (authResponse) {
			return authResponse;
		}
		return next(request, event);
	};
};
