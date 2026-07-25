/**
 * Base URL for the external NestJS API (Better Auth + REST endpoints).
 */
export function getApiBaseUrl(): string {
	return (
		process.env.NEXT_PUBLIC_API_URL ??
		process.env.NEXT_PUBLIC_APP_URL ??
		"http://localhost:3001"
	);
}

export function getAuthSessionUrl(): string {
	return new URL("/api/auth/get-session", getApiBaseUrl()).toString();
}
