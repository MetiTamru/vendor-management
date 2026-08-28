import { defaultLocale, locales } from "@/i18n/config";
import { AUTH_PATHS } from "@/lib/auth/paths";

export { AUTH_PATHS };

export function localePath(locale: string, path: string) {
	const normalized = path.startsWith("/") ? path : `/${path}`;
	return `/${locale}${normalized}`;
}

export function getLoginPath(locale: string = defaultLocale) {
	return localePath(locale, AUTH_PATHS.login);
}

export function getHomePath(locale: string = defaultLocale) {
	return `/${locale}`;
}

export function getAdminHomePath(locale: string = defaultLocale) {
	return getHomePath(locale);
}

export function getLocaleFromPathname(pathname: string): string | null {
	const match = pathname.match(new RegExp(`^/(${locales.join("|")})(/|$)`));
	return match?.[1] ?? null;
}

export function stripLocalePrefix(pathname: string): string {
	const localePattern = new RegExp(`^/(${locales.join("|")})(/|$)`);
	return pathname.replace(localePattern, "/") || "/";
}

export function isAdminPath(pathname: string): boolean {
	const withoutLocale = stripLocalePrefix(pathname);
	return withoutLocale === "/admin" || withoutLocale.startsWith("/admin/");
}

const AUTH_PUBLIC_PATHS: readonly string[] = [
	AUTH_PATHS.login,
	AUTH_PATHS.signUp,
	AUTH_PATHS.forgotPassword,
	AUTH_PATHS.resetPassword,
	AUTH_PATHS.invite,
];

/** Login / invite / password-reset screens. Dashboard home is not public. */
export function isPublicPath(pathname: string): boolean {
	const withoutLocale = stripLocalePrefix(pathname);
	return AUTH_PUBLIC_PATHS.some(
		(segment) =>
			withoutLocale === segment || withoutLocale.startsWith(`${segment}/`)
	);
}

export function isProtectedPath(pathname: string): boolean {
	return !isPublicPath(pathname);
}

export type AuthRedirectInput = {
	pathname: string;
	authenticated: boolean;
	loginPath: string;
	homePath: string;
};

/**
 * Pure auth routing decision for tests and middleware.
 *
 * Auth screens stay reachable even with a stale session cookie — JWT lives in
 * localStorage, which middleware cannot see. The client sends already-authed
 * users from login to home.
 */
export function resolveAuthRedirect({
	pathname,
	authenticated,
	loginPath,
	homePath: _homePath,
}: AuthRedirectInput): string | null {
	if (isPublicPath(pathname)) {
		return null;
	}

	if (!authenticated) {
		return loginPath;
	}

	return null;
}
