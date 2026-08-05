/**
 * Single switch for mock data vs live NestJS / vendor-core integration.
 *
 * - Default (unset or `true`): mocks on — no backend required
 * - `NEXT_PUBLIC_USE_MOCK=false`: live APIs (auth, VMS, identity, vendor-core)
 */
export function isMockEnabled(): boolean {
	const value = process.env.NEXT_PUBLIC_USE_MOCK;
	if (value === undefined || value === "") return true;
	return value !== "false" && value !== "0";
}

/** Inverse of {@link isMockEnabled} — NestJS / vendor-core are expected. */
export function isLiveIntegrationEnabled(): boolean {
	return !isMockEnabled();
}

/**
 * Run mock data when mocks are on; otherwise call the remote API.
 */
export async function withMockOrRemote<T>(
	mock: () => T | Promise<T>,
	remote: () => Promise<T>
): Promise<T> {
	if (isMockEnabled()) return mock();
	return remote();
}
