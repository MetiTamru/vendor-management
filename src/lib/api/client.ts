import { getApiBaseUrl } from "@/lib/auth/api-url";

import { ApiError, parseApiErrorResponse } from "./errors";

type RequestOptions = RequestInit & {
	params?: Record<string, string>;
};

let onUnauthorized: (() => void) | null = null;

export function setApiUnauthorizedHandler(handler: (() => void) | null) {
	onUnauthorized = handler;
}

function buildUrl(path: string, params?: Record<string, string>) {
	const base = getApiBaseUrl();
	const url = new URL(path.startsWith("/") ? path : `/${path}`, base);
	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			url.searchParams.set(key, value);
		});
	}
	return url.toString();
}

export async function apiClient<T>(
	path: string,
	options: RequestOptions = {}
): Promise<T> {
	const { params, ...init } = options;
	const response = await fetch(buildUrl(path, params), {
		...init,
		headers: {
			"Content-Type": "application/json",
			...init.headers,
		},
		credentials: "include",
	});

	if (!response.ok) {
		const error = await parseApiErrorResponse(response);
		if (error.status === 401 && onUnauthorized) {
			onUnauthorized();
		}
		throw error;
	}

	if (response.status === 204) {
		return undefined as T;
	}

	const text = await response.text();
	if (!text) {
		return undefined as T;
	}

	try {
		return JSON.parse(text) as T;
	} catch {
		throw new ApiError("Invalid JSON response from API", response.status);
	}
}
