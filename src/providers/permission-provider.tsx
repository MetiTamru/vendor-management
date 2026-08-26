"use client";

import { createContext, useContext, useMemo } from "react";

import { useVendorCoreSessionOptional } from "@/components/vendor-core/VendorCoreGate";
import { authClient } from "@/lib/auth-client";
import { MOCK_ADMIN_USER, isMockAuthEnabled } from "@/lib/auth/mock-auth";
import { useABAC } from "@/permissions/access/useABAC";

interface PermissionContextType {
	checkAccess: (
		resourceType: string,
		action: string,
		resource?: Record<string, unknown>
	) => boolean;
	hasComponentAccess: (
		componentName: string,
		action?: "view" | "delete"
	) => boolean;
	hasApiAccess: (endpoint: string, method: string) => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(
	undefined
);

export function PermissionProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { checkAccess } = useABAC();
	const { data: session } = authClient.useSession();
	const vendorCore = useVendorCoreSessionOptional();
	const hasUser =
		isMockAuthEnabled() ||
		!!session?.user ||
		(Boolean(vendorCore?.shellAuth) && Boolean(vendorCore?.authed));

	const value = useMemo<PermissionContextType>(
		() => ({
			checkAccess,
			hasComponentAccess: (
				componentName: string,
				action: "view" | "delete" = "view"
			) => {
				if (!hasUser) return false;
				return checkAccess("component", action, { name: componentName });
			},
			hasApiAccess: (endpoint: string, method: string) => {
				if (!hasUser) return false;
				return checkAccess("api", method.toLowerCase(), { endpoint });
			},
		}),
		[checkAccess, hasUser]
	);

	void MOCK_ADMIN_USER;

	return (
		<PermissionContext.Provider value={value}>
			{children}
		</PermissionContext.Provider>
	);
}

export const usePermissions = () => {
	const context = useContext(PermissionContext);
	if (!context) {
		throw new Error("usePermissions must be used within PermissionProvider");
	}
	return context;
};
