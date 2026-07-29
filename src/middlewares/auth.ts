import { type NextRequest, NextResponse } from "next/server";

import { defaultLocale } from "@/i18n/config";
import { getAuthSessionUrl } from "@/lib/auth/api-url";
import { isMockAuthEnabled } from "@/lib/auth/mock-auth";
import {
	getHomePath,
	getLocaleFromPathname,
	getLoginPath,
	resolveAuthRedirect,
} from "@/lib/routes";

const SESSION_FETCH_TIMEOUT_MS = 5_000;
const E2E_SESSION_COOKIE = "e2e-session";

/**
 * Playwright sets `e2e-session=1` in development only (see e2e/admin-groups.spec.ts).
 * Not honored in production builds.
 */
function hasE2eSession(request: NextRequest): boolean {
	if (process.env.NODE_ENV !== "development") {
		return false;
	}
	return request.cookies.get(E2E_SESSION_COOKIE)?.value === "1";
}

export async function isAuthenticated(request: NextRequest): Promise<boolean> {
	if (isMockAuthEnabled()) {
		return true;
	}

	if (hasE2eSession(request)) {
		return true;
	}

	try {
		const response = await fetch(getAuthSessionUrl(), {
			headers: {
				cookie: request.headers.get("cookie") ?? "",
			},
			signal: AbortSignal.timeout(SESSION_FETCH_TIMEOUT_MS),
		});

		if (!response.ok) return false;

		const session = (await response.json()) as { user?: unknown } | null;
		return !!session?.user;
	} catch {
		return false;
	}
}

export async function handleAuth(
	request: NextRequest
): Promise<NextResponse | null> {
	if (isMockAuthEnabled()) {
		const { pathname } = request.nextUrl;
		const locale = getLocaleFromPathname(pathname) ?? defaultLocale;
		const homePath = getHomePath(locale);

		// Auth pages → home when mock-authenticated
		if (pathname.includes("/auth/")) {
			return NextResponse.redirect(new URL(homePath, request.url));
		}

		return null;
	}

	const { pathname } = request.nextUrl;
	const locale = getLocaleFromPathname(pathname) ?? defaultLocale;
	const loginPath = getLoginPath(locale);
	const homePath = getHomePath(locale);

	const authenticated = await isAuthenticated(request);
	const redirectPath = resolveAuthRedirect({
		pathname,
		authenticated,
		loginPath,
		homePath,
	});

	if (redirectPath) {
		return NextResponse.redirect(new URL(redirectPath, request.url));
	}

	return null;
}

const LOCALE_REDIRECT_STATUSES = new Set([301, 302, 307, 308]);

/** True when next-intl is negotiating locale (redirect), not a rewrite/next. */
export function isLocaleRedirect(
	request: NextRequest,
	response: NextResponse
): boolean {
	if (!LOCALE_REDIRECT_STATUSES.has(response.status)) {
		return false;
	}

	const location = response.headers.get("location");
	if (!location) {
		return true;
	}

	try {
		const target = new URL(location, request.url);
		const hadLocale = !!getLocaleFromPathname(request.nextUrl.pathname);
		const hasLocale = !!getLocaleFromPathname(target.pathname);
		return !hadLocale && hasLocale;
	} catch {
		return true;
	}
}
