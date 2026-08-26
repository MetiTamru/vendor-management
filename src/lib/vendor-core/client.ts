/**
 * HTTP client for services/vendor-management-core (Django JWT API).
 * Base URL: NEXT_PUBLIC_VENDOR_CORE_API_URL (default http://localhost:8010)
 *
 * Live when mocks are off, or when VENDOR_CORE URL points at a remote host
 * (so Nest can stay mocked while Integration Intake hits Django).
 *
 * Browser calls to a remote host go through `/api/vendor-core/*` to avoid CORS.
 */
import { isLiveIntegrationEnabled } from "@/lib/mock-mode";

import type { ApiEnvelope, TokenPair } from "./types";

const ACCESS_KEY = "vendor_core_access_token";
const REFRESH_KEY = "vendor_core_refresh_token";
const BROWSER_PROXY_PREFIX = "/api/vendor-core";

export function getVendorCoreUpstreamUrl(): string {
	return (
		process.env.NEXT_PUBLIC_VENDOR_CORE_API_URL ??
		"https://api.vm.tillahealth.com"
	).replace(/\/$/, "");
}

/** @deprecated Prefer getVendorCoreUpstreamUrl — kept for UI display */
export function getVendorCoreBaseUrl(): string {
	return getVendorCoreUpstreamUrl();
}

function isRemoteVendorCoreUrl(url: string): boolean {
	try {
		const host = new URL(url).hostname;
		return host !== "localhost" && host !== "127.0.0.1" && host !== "0.0.0.0";
	} catch {
		return false;
	}
}

/**
 * Vendor-core is live only when fixture mocks are off.
 * When USE_MOCK=true, all pages use local fixtures — no Django JWT required.
 */
export function isVendorCoreLive(): boolean {
	return isLiveIntegrationEnabled();
}

/** Use same-origin Next proxy when the browser would hit a remote Django host. */
function shouldUseBrowserProxy(): boolean {
	return (
		typeof window !== "undefined" &&
		isRemoteVendorCoreUrl(getVendorCoreUpstreamUrl())
	);
}

export function getStoredAccessToken(): string | null {
	if (typeof window === "undefined") return null;
	return window.localStorage.getItem(ACCESS_KEY);
}

export function storeTokens(tokens: TokenPair) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(ACCESS_KEY, tokens.access);
	if (tokens.refresh) {
		window.localStorage.setItem(REFRESH_KEY, tokens.refresh);
	} else {
		window.localStorage.removeItem(REFRESH_KEY);
	}
}

export function clearTokens() {
	if (typeof window === "undefined") return;
	window.localStorage.removeItem(ACCESS_KEY);
	window.localStorage.removeItem(REFRESH_KEY);
}

export class VendorCoreApiError extends Error {
	status: number;
	body: unknown;

	constructor(message: string, status: number, body?: unknown) {
		super(message);
		this.name = "VendorCoreApiError";
		this.status = status;
		this.body = body;
	}
}

/** Flatten nested DRF / problem-details field errors for toasts. */
function flattenVendorCoreErrors(errors: unknown, prefix = ""): string | null {
	if (errors == null || errors === "") return null;
	if (typeof errors === "string") return prefix ? `${prefix}: ${errors}` : errors;
	if (Array.isArray(errors)) {
		const parts = errors
			.map((item) => flattenVendorCoreErrors(item, prefix))
			.filter(Boolean);
		return parts.length ? parts.join("; ") : null;
	}
	if (typeof errors === "object") {
		const parts: string[] = [];
		for (const [key, value] of Object.entries(
			errors as Record<string, unknown>
		)) {
			if (key === "_index") continue;
			const path =
				key === "non_field_errors" || key === "__all__"
					? prefix
					: prefix
						? `${prefix}.${key}`
						: key;
			const flat = flattenVendorCoreErrors(value, path);
			if (flat) parts.push(flat);
		}
		return parts.length ? parts.join("; ") : null;
	}
	return String(errors);
}

type RequestOptions = RequestInit & {
	params?: Record<string, string | number | undefined | null>;
	auth?: boolean;
	raw?: boolean;
};

function buildUrl(path: string, params?: RequestOptions["params"]) {
	const normalized = path.startsWith("/") ? path : `/${path}`;
	const url = shouldUseBrowserProxy()
		? new URL(`${BROWSER_PROXY_PREFIX}${normalized}`, window.location.origin)
		: new URL(normalized, `${getVendorCoreUpstreamUrl()}/`);

	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			if (value === undefined || value === null || value === "") return;
			url.searchParams.set(key, String(value));
		});
	}
	return url.toString();
}

export async function vendorCoreLogin(input: {
	username: string;
	password: string;
}): Promise<TokenPair> {
	const response = await fetch(buildUrl("/api/v1/authentication/token/"), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});
	const text = await response.text();
	const data = text ? JSON.parse(text) : {};
	if (!response.ok) {
		throw new VendorCoreApiError(
			data?.result?.detail ?? data?.detail ?? data?.message ?? "Login failed",
			response.status,
			data
		);
	}
	// SimpleJWT may return flat {access,refresh} or envelope
	const tokens: TokenPair = data.access
		? { access: data.access, refresh: data.refresh }
		: {
				access: data.result?.access,
				refresh: data.result?.refresh,
			};
	if (!tokens.access) {
		throw new VendorCoreApiError("Token response missing access", 500, data);
	}
	storeTokens(tokens);
	return tokens;
}

export async function vendorCoreFetch<T>(
	path: string,
	options: RequestOptions = {}
): Promise<T> {
	const { params, auth = true, raw = false, headers, ...init } = options;
	const isFormData =
		typeof FormData !== "undefined" && init.body instanceof FormData;
	const reqHeaders: HeadersInit = {
		Accept: "application/json",
		...(init.body && !isFormData ? { "Content-Type": "application/json" } : {}),
		...headers,
	};
	// Drop empty Content-Type so multipart uploads set their own boundary
	if (isFormData && reqHeaders && typeof reqHeaders === "object") {
		delete (reqHeaders as Record<string, string>)["Content-Type"];
	}
	if (auth) {
		const token = getStoredAccessToken();
		if (token) {
			(reqHeaders as Record<string, string>).Authorization = `Bearer ${token}`;
		}
	}

	const response = await fetch(buildUrl(path, params), {
		...init,
		cache: "no-store",
		headers: reqHeaders,
	});

	const text = await response.text();
	const data = text ? JSON.parse(text) : undefined;

	if (!response.ok) {
		const fieldErrors = flattenVendorCoreErrors(data?.result?.errors);
		throw new VendorCoreApiError(
			fieldErrors ||
				data?.result?.detail ||
				data?.message ||
				data?.detail ||
				`Request failed (${response.status})`,
			response.status,
			data
		);
	}

	if (raw) {
		return data as T;
	}

	// Prefer envelope.result when present
	if (data && typeof data === "object" && "result" in data) {
		return (data as ApiEnvelope<T>).result;
	}
	return data as T;
}

export type VendorCoreBlobResult = {
	blob: Blob;
	contentType: string;
	filename?: string;
};

function parseContentDispositionFilename(
	header: string | null
): string | undefined {
	if (!header) return undefined;
	const star = header.match(/filename\*=UTF-8''([^;]+)/i);
	if (star?.[1]) {
		try {
			return decodeURIComponent(star[1].trim());
		} catch {
			return star[1].trim();
		}
	}
	const plain = header.match(/filename="?([^";]+)"?/i);
	return plain?.[1]?.trim();
}

/** Binary download (CSV/PDF/HTML) — skips JSON envelope parsing. */
export async function vendorCoreFetchBlob(
	path: string,
	options: RequestOptions = {}
): Promise<VendorCoreBlobResult> {
	const { params, auth = true, headers, raw: _raw, ...init } = options;
	const reqHeaders: HeadersInit = {
		Accept: "*/*",
		...headers,
	};
	if (auth) {
		const token = getStoredAccessToken();
		if (token) {
			(reqHeaders as Record<string, string>).Authorization = `Bearer ${token}`;
		}
	}

	const response = await fetch(buildUrl(path, params), {
		...init,
		cache: "no-store",
		headers: reqHeaders,
	});																																															

	if (!response.ok) {
		const text = await response.text();
		let data: unknown;
		try {
			data = text ? JSON.parse(text) : undefined;
		} catch {
			data = text;
		}
		const body = data as {
			result?: { detail?: string };
			message?: string;
			detail?: string;
		};
		throw new VendorCoreApiError(
			body?.result?.detail ||
				body?.message ||
				body?.detail ||
				`Request failed (${response.status})`,
			response.status,
			data
		);
	}

	const blob = await response.blob();
	return {
		blob,
		contentType: response.headers.get("content-type") ?? blob.type,
		filename: parseContentDispositionFilename(
			response.headers.get("content-disposition")
		),
	};
}
