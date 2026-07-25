"use client";

import { createContext, useContext } from "react";

import { authClient } from "@/lib/auth-client";
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

	const hasComponentAccess = (
		componentName: string,
		action: "view" | "delete" = "view"
	) => {
		if (!session?.user) return false;
		return checkAccess("component", action, { name: componentName });
	};

	const hasApiAccess = (endpoint: string, method: string) => {
		if (!session?.user) return false;
		return checkAccess("api", method.toLowerCase(), { endpoint });
	};

	return (
		<PermissionContext.Provider
			value={{ checkAccess, hasComponentAccess, hasApiAccess }}
		>
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
