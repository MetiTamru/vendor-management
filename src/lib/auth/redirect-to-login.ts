import { AUTH_PATHS } from "@/lib/auth/paths";
import { clearTokens } from "@/lib/vendor-core/client";

/** Hard navigation to login after dropping a stale JWT / session cookie. */
export function redirectToLogin(locale: string) {
	if (typeof window === "undefined") return;
	clearTokens();
	const target = `/${locale}${AUTH_PATHS.login}`;
	if (window.location.pathname === target) return;
	window.location.assign(target);
}
