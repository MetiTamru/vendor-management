"use client";

import { useQuery } from "@tanstack/react-query";

import { roleApi } from "../api/role.api";

export const roleQueryKeys = {
	all: ["roles"] as const,
	list: () => [...roleQueryKeys.all, "list"] as const,
};

export function useRolesList() {
	const query = useQuery({
		queryKey: roleQueryKeys.list(),
		queryFn: () => roleApi.list(),
		staleTime: 60_000,
	});

	return {
		roles: query.data ?? [],
		isInitialLoading: query.isLoading && !query.data,
		isRefreshing: query.isFetching && !query.isLoading,
		isEmpty: (query.data?.length ?? 0) === 0 && query.isSuccess,
		error: query.error,
		refetch: query.refetch,
	};
}
