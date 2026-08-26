/**
 * Cookie flag so Next middleware / RSC can see Django JWT shell auth.
 * Access + refresh tokens stay in localStorage for the browser API client.
 */
export const VENDOR_CORE_SESSION_COOKIE = "vendor_core_session";

/** ~ refresh lifetime (1 day) */
const SESSION_MAX_AGE_SEC = 60 * 60 * 24;

export function hasVendorCoreSessionCookieValue(
	value: string | undefined
): boolean {
	return value === "1";
}

export function setVendorCoreSessionCookie(): void {
	if (typeof document === "undefined") return;
	document.cookie = `${VENDOR_CORE_SESSION_COOKIE}=1; Path=/; Max-Age=${SESSION_MAX_AGE_SEC}; SameSite=Lax`;
}

export function clearVendorCoreSessionCookie(): void {
	if (typeof document === "undefined") return;
	document.cookie = `${VENDOR_CORE_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function readVendorCoreSessionCookieFromDocument(): boolean {
	if (typeof document === "undefined") return false;
	return document.cookie
		.split(";")
		.some((part) => part.trim() === `${VENDOR_CORE_SESSION_COOKIE}=1`);
}
