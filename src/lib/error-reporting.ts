/**
 * Env-gated error reporting. Set NEXT_PUBLIC_SENTRY_DSN to enable Sentry.
 */

let sentryReady = false;

async function initSentryIfNeeded(): Promise<void> {
	if (sentryReady || typeof window === "undefined") return;
	const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
	if (!dsn) return;

	try {
		const Sentry = await import("@sentry/nextjs");
		Sentry.init({
			dsn,
			environment: process.env.NODE_ENV,
			tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
		});
		sentryReady = true;
	} catch {
		// @sentry/nextjs not installed — dev console only
	}
}

export function captureException(
	error: unknown,
	context?: Record<string, unknown>
) {
	if (process.env.NODE_ENV === "development") {
		console.error("[error-reporting]", error, context);
	}

	const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
	if (!dsn) {
		return;
	}

	void (async () => {
		await initSentryIfNeeded();
		try {
			const Sentry = await import("@sentry/nextjs");
			Sentry.captureException(error, { extra: context });
		} catch {
			console.error("[error-reporting]", { dsn: "configured", error, context });
		}
	})();
}
