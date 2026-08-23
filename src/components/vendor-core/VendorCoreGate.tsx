"use client";

import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import { Loader2 } from "lucide-react";
import { useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { AUTH_PATHS } from "@/lib/auth/paths";
import { redirectToLogin } from "@/lib/auth/redirect-to-login";
import { isPublicPath } from "@/lib/routes";
import { isDjangoShellAuthEnabled } from "@/lib/vendor-core/auth-mode";
import {
	VendorCoreApiError,
	clearTokens,
	getStoredAccessToken,
	getVendorCoreBaseUrl,
	isVendorCoreLive,
	vendorCoreLogin,
	vendorCoreLogout,
	vendorCoreMe,
} from "@/lib/vendor-core/client";
import type { MeUserDto } from "@/lib/vendor-core/types";

export type VendorCoreSessionValue = {
	live: boolean;
	/** Django owns the app shell login (live + Nest off). */
	shellAuth: boolean;
	authed: boolean;
	loading: boolean;
	bootstrapping: boolean;
	error: string | null;
	user: MeUserDto | null;
	mustChangePassword: boolean;
	signIn: (username: string, password: string) => Promise<MeUserDto>;
	signOut: () => Promise<void>;
	markUnauthed: () => void;
	refreshUser: () => Promise<MeUserDto | null>;
};

const VendorCoreSessionContext = createContext<VendorCoreSessionValue | null>(
	null
);

export function useVendorCoreSession(): VendorCoreSessionValue {
	const ctx = useContext(VendorCoreSessionContext);
	if (!ctx) {
		throw new Error(
			"useVendorCoreSession must be used within VendorCoreSessionProvider"
		);
	}
	return ctx;
}

/** Safe when provider is missing (e.g. outside tree briefly). */
export function useVendorCoreSessionOptional(): VendorCoreSessionValue | null {
	return useContext(VendorCoreSessionContext);
}

function meToSession(
	user: MeUserDto | null
): Pick<VendorCoreSessionValue, "user" | "mustChangePassword" | "authed"> {
	return {
		user,
		mustChangePassword: Boolean(user?.must_change_password),
		authed: Boolean(user),
	};
}

/**
 * App-wide vendor-core JWT session. Mounted at root so login + ABAC share state.
 */
export function VendorCoreSessionProvider({
	children,
}: {
	children: ReactNode;
}) {
	const live = isVendorCoreLive();
	const shellAuth = isDjangoShellAuthEnabled();
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	const [user, setUser] = useState<MeUserDto | null>(null);
	const [loading, setLoading] = useState(false);
	const [bootstrapping, setBootstrapping] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const refreshUser = useCallback(async () => {
		if (!getStoredAccessToken()) {
			clearTokens();
			setUser(null);
			return null;
		}
		try {
			const me = await vendorCoreMe();
			setUser(me);
			setError(null);
			return me;
		} catch (err) {
			if (err instanceof VendorCoreApiError && err.status === 401) {
				clearTokens();
				setUser(null);
			}
			return null;
		}
	}, []);

	useEffect(() => {
		if (!live) {
			setBootstrapping(false);
			setUser(null);
			return;
		}

		let cancelled = false;
		(async () => {
			if (!getStoredAccessToken()) {
				if (!cancelled) {
					clearTokens();
					setUser(null);
					setBootstrapping(false);
				}
				return;
			}
			try {
				const me = await vendorCoreMe();
				if (!cancelled) {
					setUser(me);
					setError(null);
				}
			} catch {
				if (!cancelled) {
					clearTokens();
					setUser(null);
				}
			} finally {
				if (!cancelled) setBootstrapping(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [live]);

	// Force password change when Django flags the account
	useEffect(() => {
		if (!shellAuth || bootstrapping || !user?.must_change_password) return;
		if (pathname.includes(AUTH_PATHS.changePassword)) return;
		router.replace(AUTH_PATHS.changePassword);
	}, [shellAuth, bootstrapping, user, pathname, router]);

	// Unauthenticated users always leave the app shell for login.
	useEffect(() => {
		if (!live || !shellAuth || bootstrapping) return;
		if (isPublicPath(pathname)) return;
		if (user) return;
		redirectToLogin(locale);
	}, [live, shellAuth, bootstrapping, user, pathname, locale]);

	// Valid JWT on the login screen → home (middleware no longer bounces login).
	useEffect(() => {
		if (!shellAuth || bootstrapping || !user) return;
		if (pathname !== AUTH_PATHS.login) return;
		if (user.must_change_password) {
			router.replace(AUTH_PATHS.changePassword);
			return;
		}
		router.replace("/");
	}, [shellAuth, bootstrapping, user, pathname, router]);

	const signIn = useCallback(async (username: string, password: string) => {
		setLoading(true);
		setError(null);
		try {
			await vendorCoreLogin({ username, password });
			const me = await vendorCoreMe();
			setUser(me);
			return me;
		} catch (err) {
			setUser(null);
			const message = err instanceof Error ? err.message : "Login failed";
			setError(message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const signOut = useCallback(async () => {
		setLoading(true);
		try {
			await vendorCoreLogout();
		} finally {
			setUser(null);
			setError(null);
			setLoading(false);
			window.location.assign(`/${locale}${AUTH_PATHS.login}`);
		}
	}, [locale]);

	const markUnauthed = useCallback(() => {
		clearTokens();
		setUser(null);
		if (shellAuth) {
			redirectToLogin(locale);
		}
	}, [shellAuth, locale]);

	const sessionBits = meToSession(user);

	const value = useMemo(
		() => ({
			live,
			shellAuth,
			authed: sessionBits.authed,
			loading,
			bootstrapping,
			error,
			user: sessionBits.user,
			mustChangePassword: sessionBits.mustChangePassword,
			signIn,
			signOut,
			markUnauthed,
			refreshUser,
		}),
		[
			live,
			shellAuth,
			sessionBits.authed,
			sessionBits.user,
			sessionBits.mustChangePassword,
			loading,
			bootstrapping,
			error,
			signIn,
			signOut,
			markUnauthed,
			refreshUser,
		]
	);

	return (
		<VendorCoreSessionContext.Provider value={value}>
			{children}
		</VendorCoreSessionContext.Provider>
	);
}

/**
 * Banner only when Nest (or dual) owns shell auth but vendor-core JWT is still needed.
 * Hidden when Django shell auth already signed the user in at /auth/login.
 */
export function VendorCoreAuthBanner() {
	const session = useVendorCoreSessionOptional();
	const locale = useLocale();

	if (
		!session?.live ||
		session.shellAuth ||
		session.bootstrapping ||
		session.authed
	) {
		return null;
	}

	return (
		<div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-3">
			<div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-2">
				<div>
					<p className="text-sm font-medium text-foreground">
						Vendor-core API not connected
					</p>
					<p className="text-muted-foreground text-xs">
						{getVendorCoreBaseUrl()} — sign in again or reconnect for live data
					</p>
				</div>
				<Button type="button" size="sm" onClick={() => redirectToLogin(locale)}>
					Sign in
				</Button>
			</div>
		</div>
	);
}

export function VendorCoreGate({
	children,
	title = "Vendor Core API",
	description,
}: {
	children: ReactNode;
	title?: string;
	description?: string;
}) {
	const session = useVendorCoreSessionOptional();
	const locale = useLocale();

	const live = session?.live ?? isVendorCoreLive();
	const shellAuth = session?.shellAuth ?? isDjangoShellAuthEnabled();
	const authed = session?.authed ?? false;
	const bootstrapping = session?.bootstrapping ?? false;
	const needsLogin = live && !bootstrapping && !authed;

	useEffect(() => {
		if (!needsLogin || !shellAuth) return;
		redirectToLogin(locale);
	}, [needsLogin, shellAuth, locale]);

	if (!live) {
		return (
			<div className="space-y-4 p-6">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
					<p className="text-muted-foreground mt-1 text-sm">
						{description ??
							"Set NEXT_PUBLIC_USE_MOCK=false and point NEXT_PUBLIC_VENDOR_CORE_API_URL at Django to enable live data."}
					</p>
				</div>
				<pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
					{`NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_DEV_ADMIN=false
NEXT_PUBLIC_VENDOR_CORE_API_URL=https://api.vm.tillahealth.com`}
				</pre>
			</div>
		);
	}

	if (bootstrapping) {
		return (
			<div className="flex items-center justify-center gap-2 p-12 text-sm text-muted-foreground">
				<Loader2 className="size-4 animate-spin" />
				Connecting…
			</div>
		);
	}

	if (needsLogin) {
		return (
			<div className="mx-auto flex max-w-md flex-col gap-4 p-6">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
					<p className="text-muted-foreground mt-1 text-sm">
						{shellAuth
							? "Your session expired. Redirecting to sign in…"
							: `Sign in required for ${getVendorCoreBaseUrl()}`}
					</p>
				</div>
				{shellAuth ? (
					<div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
						<Loader2 className="size-4 animate-spin" />
						Redirecting…
					</div>
				) : (
					<Button
						type="button"
						className="w-full"
						onClick={() => redirectToLogin(locale)}
					>
						Go to sign in
					</Button>
				)}
			</div>
		);
	}

	return <>{children}</>;
}
