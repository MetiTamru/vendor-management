"use client";

import {
	useInvalidateVendorCore,
	useVendorCoreFeatureQuery,
} from "@/features/admin/shared/vendor-core-feature-query";
import { featureQueryKey } from "@/features/admin/shared/feature-contract";
import { useQuery } from "@tanstack/react-query";

import {
	listErrorInboundFiles,
	listErrorManagementFileRuns,
	listErrorRecords,
	listErrorValidationResults,
	listErrorVendors,
} from "../api/errorManagementApi";

const domain = "error-management";

export function useErrorManagementFileRunsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "file-runs"),
		queryFn: listErrorManagementFileRuns,
		staleTime: Infinity,
	});
}

export function useErrorRecordsQuery(status = "open", enabled = true) {
	return useVendorCoreFeatureQuery(
		domain,
		"errors",
		() => listErrorRecords(status),
		enabled,
		[status]
	);
}

export function useErrorValidationResultsQuery(
	params?: { inbound_file_id?: string; search?: string },
	enabled = true
) {
	return useVendorCoreFeatureQuery(
		domain,
		"validation-results",
		() => listErrorValidationResults(params),
		enabled,
		[params ?? {}]
	);
}

export function useErrorInboundFilesQuery(params?: {
	stage?: string;
	vendor_id?: string;
}) {
	return useVendorCoreFeatureQuery(
		domain,
		"inbound-files",
		() => listErrorInboundFiles(params),
		true,
		[params ?? {}]
	);
}

export function useErrorVendorsQuery() {
	return useVendorCoreFeatureQuery(domain, "vendors", listErrorVendors);
}

export function useErrorManagementFileRunsList() {
	const query = useErrorManagementFileRunsQuery();
	return { ...query, fileRuns: query.data ?? [] };
}

export const useVendorCoreErrors = useErrorRecordsQuery;
export const useVendorCoreValidationResults = useErrorValidationResultsQuery;
export const useVendorCoreInboundFiles = useErrorInboundFilesQuery;
export const useVendorCoreVendors = useErrorVendorsQuery;

export { useInvalidateVendorCore };

export const useErrorManagementQuery = useErrorManagementFileRunsQuery;
export const useErrorManagementDetailQuery = useErrorManagementFileRunsQuery;
