"use client";

import { useQuery } from "@tanstack/react-query";

import { settingApi } from "../api/setting.api";

export const settingQueryKeys = {
	all: ["settings"] as const,
	list: () => [...settingQueryKeys.all, "list"] as const,
};

export function useSettingsList() {
	const query = useQuery({
		queryKey: settingQueryKeys.list(),
		queryFn: () => settingApi.list(),
		staleTime: 60_000,
	});

	return {
		settings: query.data ?? [],
		isInitialLoading: query.isLoading && !query.data,
		isRefreshing: query.isFetching && !query.isLoading,
		isEmpty: (query.data?.length ?? 0) === 0 && query.isSuccess,
		error: query.error,
		refetch: query.refetch,
	};
}
