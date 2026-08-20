"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import { listActivityFileRuns } from "../api/activityApi";

const domain = "activity";

export function useActivityFileRunsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "file-runs"),
		queryFn: listActivityFileRuns,
		staleTime: Infinity,
	});
}

export function useActivityFileRunsList() {
	const query = useActivityFileRunsQuery();
	return { ...query, fileRuns: query.data ?? [] };
}

export const useActivityQuery = useActivityFileRunsQuery;
export const useActivityDetailQuery = useActivityFileRunsQuery;
