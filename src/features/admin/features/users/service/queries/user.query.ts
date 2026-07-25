"use client";

import { useQuery } from "@tanstack/react-query";

import { userApi } from "../api/user.api";

export const userQueryKeys = {
	all: ["users"] as const,
	list: () => [...userQueryKeys.all, "list"] as const,
};

export function useUsersList() {
	const query = useQuery({
		queryKey: userQueryKeys.list(),
		queryFn: () => userApi.list(),
		staleTime: 60_000,
	});

	return {
		users: query.data ?? [],
		isInitialLoading: query.isLoading && !query.data,
		isRefreshing: query.isFetching && !query.isLoading,
		isEmpty: (query.data?.length ?? 0) === 0 && query.isSuccess,
		error: query.error,
		refetch: query.refetch,
	};
}
