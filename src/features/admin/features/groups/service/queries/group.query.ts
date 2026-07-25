"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLiveQuery } from "dexie-react-hooks";

import { offlineDb } from "@/lib/offline/db";
import { flushGroupSyncQueue } from "@/lib/offline/sync-worker";

import { listCachedGroups } from "../../offline/group.cache";
import type { GroupModel } from "../../types/group.types";
import {
	hydrateGroupsFromRemote,
	retryGroupSync,
} from "../commands/group.command";

export const groupQueryKeys = {
	all: ["groups"] as const,
	list: () => [...groupQueryKeys.all, "list"] as const,
	detail: (id: string) => [...groupQueryKeys.all, "detail", id] as const,
	hydrate: () => [...groupQueryKeys.all, "hydrate"] as const,
};

function useGroupsHydration() {
	return useQuery({
		queryKey: groupQueryKeys.hydrate(),
		queryFn: () => hydrateGroupsFromRemote(),
		staleTime: 60_000,
		refetchOnWindowFocus: true,
	});
}

export function useGroupsList() {
	const hydration = useGroupsHydration();
	const groups =
		useLiveQuery(
			async () => {
				if (!offlineDb) return [];
				return listCachedGroups();
			},
			[],
			[]
		) ?? [];

	return {
		groups,
		isInitialLoading:
			hydration.isLoading && groups.length === 0 && !hydration.isError,
		isRefreshing: hydration.isFetching && !hydration.isLoading,
		isEmpty: groups.length === 0 && hydration.isSuccess,
		hasSyncErrors: groups.some((g) => g.syncStatus === "failed"),
		error: hydration.error,
		refetch: hydration.refetch,
	};
}

export function useGroup(groupId: string | undefined) {
	const hydration = useGroupsHydration();
	const group = useLiveQuery(
		async () => {
			if (!groupId || !offlineDb) return undefined;
			const all = await listCachedGroups();
			return all.find((g) => g.id === groupId) ?? null;
		},
		[groupId],
		undefined
	);

	const queryClient = useQueryClient();

	return {
		group: group as GroupModel | null | undefined,
		isLoading:
			hydration.isLoading && group === undefined && groupId !== undefined,
		isNotFound: hydration.isSuccess && groupId !== undefined && group === null,
		isStale: group?.syncStatus === "pending",
		hasSyncError: group?.syncStatus === "failed",
		error: hydration.error,
		refetch: async () => {
			if (groupId && group?.syncStatus === "failed") {
				await retryGroupSync(groupId);
			}
			await hydration.refetch();
			await flushGroupSyncQueue();
			queryClient.invalidateQueries({ queryKey: groupQueryKeys.all });
		},
	};
}
