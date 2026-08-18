"use client";

import {
	useInvalidateVendorCore,
	useVendorCoreFeatureQuery,
} from "@/features/admin/shared/vendor-core-feature-query";
import { featureQueryKey } from "@/features/admin/shared/feature-contract";
import { useQuery } from "@tanstack/react-query";

import {
	getProcessingStatusMonitoring,
	listProcessingStatusFileRuns,
	listProcessingStatusValidationResults,
} from "../api/processingStatusApi";

const domain = "processing-status";

export function useProcessingStatusFileRunsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "file-runs"),
		queryFn: listProcessingStatusFileRuns,
		staleTime: Infinity,
	});
}

export function useProcessingStatusMonitoringQuery() {
	return useVendorCoreFeatureQuery(
		domain,
		"monitoring",
		getProcessingStatusMonitoring
	);
}

export function useProcessingStatusValidationResultsQuery(
	params?: { inbound_file_id?: string; search?: string },
	enabled = true
) {
	return useVendorCoreFeatureQuery(
		domain,
		"validation-results",
		() => listProcessingStatusValidationResults(params),
		enabled,
		[params ?? {}]
	);
}

export function useProcessingStatusFileRunsList() {
	const query = useProcessingStatusFileRunsQuery();
	return { ...query, fileRuns: query.data ?? [] };
}

export const useVendorCoreMonitoring = useProcessingStatusMonitoringQuery;
export const useVendorCoreValidationResults = useProcessingStatusValidationResultsQuery;

export { useInvalidateVendorCore };

export const useProcessingStatusQuery = useProcessingStatusFileRunsQuery;
export const useProcessingStatusDetailQuery = useProcessingStatusFileRunsQuery;
