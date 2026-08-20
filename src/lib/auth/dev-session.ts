/** Cookie used so Log out can leave the DEV_ADMIN / mock-auth shell. */
export const DEV_SIGNED_OUT_COOKIE = "tilla-dev-signed-out";

export function isDevSignedOutCookieValue(value: string | undefined): boolean {
	return value === "1";
}

export function readDevSignedOutFromDocument(): boolean {
	if (typeof document === "undefined") return false;
	return document.cookie
		.split(";")
		.some((part) => part.trim() === `${DEV_SIGNED_OUT_COOKIE}=1`);
}

export function setDevSignedOutCookie(): void {
	document.cookie = `${DEV_SIGNED_OUT_COOKIE}=1; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`;
}

export function clearDevSignedOutCookie(): void {
	document.cookie = `${DEV_SIGNED_OUT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
