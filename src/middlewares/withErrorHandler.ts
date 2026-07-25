import {
	type NextFetchEvent,
	type NextRequest,
	NextResponse,
} from "next/server";

import { type MiddlewareFactory } from "./types";

export const withErrorHandler: MiddlewareFactory = (next) => {
	return async (request: NextRequest, _next: NextFetchEvent) => {
		try {
			return await next(request, _next);
		} catch (error) {
			if (error instanceof Error) {
				console.error("[withErrorHandler]", error.message);
			}
			return NextResponse.json(
				{ error: "Internal middleware error" },
				{ status: 500 }
			);
		}
	};
};
