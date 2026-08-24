import { type NextRequest, NextResponse } from "next/server";

import { defaultLocale } from "@/i18n/config";
import { getAuthSessionUrl } from "@/lib/auth/api-url";
import {
	DEV_SIGNED_OUT_COOKIE,
	isDevSignedOutCookieValue,
} from "@/lib/auth/dev-session";
import { isMockAuthEnabled } from "@/lib/auth/mock-auth";
import { isNestApiEnabled } from "@/lib/mock-mode";
import {
	getHomePath,
	getLocaleFromPathname,
	getLoginPath,
	resolveAuthRedirect,
} from "@/lib/routes";
import { isDjangoShellAuthEnabled } from "@/lib/vendor-core/auth-mode";
import {
	VENDOR_CORE_SESSION_COOKIE,
	hasVendorCoreSessionCookieValue,
} from "@/lib/vendor-core/session-cookie";

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

function isDevMockSignedOut(request: NextRequest): boolean {
	return isDevSignedOutCookieValue(
		request.cookies.get(DEV_SIGNED_OUT_COOKIE)?.value
	);
}

function hasDjangoSessionCookie(request: NextRequest): boolean {
	return hasVendorCoreSessionCookieValue(
		request.cookies.get(VENDOR_CORE_SESSION_COOKIE)?.value
	);
}

export async function isAuthenticated(request: NextRequest): Promise<boolean> {
	if (isMockAuthEnabled()) {
		return !isDevMockSignedOut(request);
	}

	if (hasE2eSession(request)) {
		return true;
	}

	if (isDjangoShellAuthEnabled()) {
		return hasDjangoSessionCookie(request);
	}

	if (!isNestApiEnabled()) {
		// Live without Nest and without Django shell — should not happen;
		// treat as unauthenticated rather than open shell.
		return false;
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
		const loginPath = getLoginPath(locale);

		if (isDevMockSignedOut(request)) {
			if (pathname.includes("/auth/")) return null;
			return NextResponse.redirect(new URL(loginPath, request.url));
		}

		// Auth pages → home when the local mock/dev session is active
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
