"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";
import {
	useInvalidateVendorCore,
	useVendorCoreFeatureQuery,
} from "@/features/admin/shared/vendor-core-feature-query";

import {
	listFileHistoryFileRuns,
	listFileHistoryInboundFiles,
	listFileHistoryVendors,
} from "../api/fileHistoryApi";

const domain = "file-history";

export function useFileHistoryFileRunsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "file-runs"),
		queryFn: listFileHistoryFileRuns,
		staleTime: Infinity,
	});
}

export function useFileHistoryInboundFilesQuery(params?: {
	stage?: string;
	vendor_id?: string;
}) {
	return useVendorCoreFeatureQuery(
		domain,
		"inbound-files",
		() => listFileHistoryInboundFiles(params),
		true,
		[params ?? {}]
	);
}

export function useFileHistoryVendorsQuery() {
	return useVendorCoreFeatureQuery(domain, "vendors", listFileHistoryVendors);
}

export function useFileHistoryFileRunsList() {
	const query = useFileHistoryFileRunsQuery();
	return { ...query, fileRuns: query.data ?? [] };
}

export const useVendorCoreInboundFiles = useFileHistoryInboundFilesQuery;
export const useVendorCoreVendors = useFileHistoryVendorsQuery;

export { useInvalidateVendorCore };

export const useFileHistoryQuery = useFileHistoryFileRunsQuery;
export const useFileHistoryDetailQuery = useFileHistoryFileRunsQuery;
