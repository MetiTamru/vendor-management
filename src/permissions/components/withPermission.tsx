"use client";

import { usePermissions } from "@/providers/permission-provider";

export function withPermission<P extends object>(
	WrappedComponent: React.ComponentType<P>,
	componentName: string,
	action: "view" | "delete" = "view"
) {
	return function PermissionWrapper(props: P) {
		const { hasComponentAccess } = usePermissions();

		if (!hasComponentAccess(componentName, action)) {
			return null;
		}

		return <WrappedComponent {...props} />;
	};
}
