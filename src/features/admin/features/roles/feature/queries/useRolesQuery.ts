"use client";

import { useRolesList } from "../../service/queries/role.query";

export { useRolesList };

export function useRolesQuery() {
	const { roles, isInitialLoading, error, refetch } = useRolesList();
	return {
		data: { items: roles, total: roles.length },
		isLoading: isInitialLoading,
		isError: Boolean(error),
		error,
		refetch,
	};
}

export function useRolesDetailQuery(id: string | null | undefined) {
	const { roles, isInitialLoading, error, refetch } = useRolesList();
	const role = id ? roles.find((item) => item.id === id) : undefined;
	return {
		data: role,
		isLoading: isInitialLoading,
		isError: Boolean(error),
		error,
		refetch,
		enabled: Boolean(id),
	};
}
