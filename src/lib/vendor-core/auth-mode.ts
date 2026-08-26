import { isLiveIntegrationEnabled, isNestApiEnabled } from "@/lib/mock-mode";

/**
 * Live mode without Nest — app shell login uses Django JWT
 * (`/api/v1/authentication/*`), not Better Auth.
 */
export function isDjangoShellAuthEnabled(): boolean {
	return isLiveIntegrationEnabled() && !isNestApiEnabled();
}
