"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import { listNotificationFileRuns } from "../api/notificationsApi";

const domain = "notifications";

export function useNotificationFileRunsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "file-runs"),
		queryFn: listNotificationFileRuns,
		staleTime: Infinity,
	});
}

export function useNotificationFileRunsList() {
	const query = useNotificationFileRunsQuery();
	return { ...query, fileRuns: query.data ?? [] };
}

export const useNotificationsQuery = useNotificationFileRunsQuery;
export const useNotificationsDetailQuery = useNotificationFileRunsQuery;
