"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";
import {
	useInvalidateVendorCore,
	useVendorCoreFeatureQuery,
} from "@/features/admin/shared/vendor-core-feature-query";

import {
	listDashboardFileRuns,
	listDashboardInboundFiles,
} from "../api/dashboardApi";

const domain = "dashboard";

export function useDashboardFileRunsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "file-runs"),
		queryFn: listDashboardFileRuns,
		staleTime: Infinity,
	});
}

export function useDashboardInboundFilesQuery(params?: {
	stage?: string;
	vendor_id?: string;
}) {
	return useVendorCoreFeatureQuery(
		domain,
		"inbound-files",
		() => listDashboardInboundFiles(params),
		true,
		[params ?? {}]
	);
}

export function useDashboardFileRunsList() {
	const query = useDashboardFileRunsQuery();
	return { ...query, fileRuns: query.data ?? [] };
}

export const useVendorCoreInboundFiles = useDashboardInboundFilesQuery;

export { useInvalidateVendorCore };

export const useDashboardQuery = useDashboardFileRunsQuery;
export const useDashboardDetailQuery = useDashboardFileRunsQuery;
