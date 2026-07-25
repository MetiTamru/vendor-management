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

export function isPublicPath(pathname: string): boolean {
	const locale = getLocaleFromPathname(pathname);
	if (locale && (pathname === `/${locale}` || pathname === `/${locale}/`)) {
		return true;
	}

	const publicSegments = Object.values(AUTH_PATHS);
	return publicSegments.some((segment) => pathname.includes(segment));
}

export function isProtectedPath(pathname: string): boolean {
	return isAdminPath(pathname) || !isPublicPath(pathname);
}

export type AuthRedirectInput = {
	pathname: string;
	authenticated: boolean;
	loginPath: string;
	homePath: string;
};

/** Pure auth routing decision for tests and middleware. */
export function resolveAuthRedirect({
	pathname,
	authenticated,
	loginPath,
	homePath,
}: AuthRedirectInput): string | null {
	if (!authenticated && isProtectedPath(pathname)) {
		if (pathname !== loginPath) {
			return loginPath;
		}
	}

	if (authenticated && pathname === loginPath) {
		return homePath;
	}

	return null;
}
