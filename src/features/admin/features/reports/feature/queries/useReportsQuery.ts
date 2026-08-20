"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import { listReportTabs } from "../api/reportsApi";

const domain = "reports";

export function useReportTabsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "tabs"),
		queryFn: listReportTabs,
		staleTime: Infinity,
	});
}

export function useReportTabsList() {
	const query = useReportTabsQuery();
	return { ...query, tabs: query.data ?? [] };
}

export const useReportsQuery = useReportTabsQuery;
export const useReportsDetailQuery = useReportTabsQuery;
