"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import { getPerformance, listPerformance } from "../api/performanceApi";
import { toPerformanceModel } from "../mappers/performanceMappers";

const domain = "performance";

export function usePerformanceQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "list"),
		queryFn: async () => {
			const items = (await listPerformance()).map(toPerformanceModel);
			return { items, total: items.length };
		},
	});
}

export function usePerformanceDetailQuery(id: string | null | undefined) {
	return useQuery({
		queryKey: featureQueryKey(domain, "detail", id ?? ""),
		enabled: Boolean(id),
		queryFn: async () => toPerformanceModel(await getPerformance(String(id))),
	});
}

export function useScorecardsList() {
	const query = usePerformanceQuery();
	return { ...query, scorecards: query.data?.items ?? [] };
}

export const usePerformanceList = useScorecardsList;
