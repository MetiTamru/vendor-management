import { createAuthClient } from "better-auth/react";

import { getApiBaseUrl } from "@/lib/auth/api-url";

/**
 * Better Auth client — talks to the NestJS backend, not Next.js API routes.
 * Uses signIn.email, signUp.email, signOut, useSession, forgetPassword, and resetPassword.
 */
export const authClient = createAuthClient({
	baseURL: getApiBaseUrl(),
});
