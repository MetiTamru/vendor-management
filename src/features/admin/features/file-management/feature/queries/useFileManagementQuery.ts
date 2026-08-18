"use client";

import {
	useInvalidateVendorCore,
	useVendorCoreFeatureMutation,
	useVendorCoreFeatureQuery,
} from "@/features/admin/shared/vendor-core-feature-query";
import { featureQueryKey } from "@/features/admin/shared/feature-contract";
import { useQuery } from "@tanstack/react-query";

import {
	getFileRunById,
	getInboundFile,
	getMonitoring,
	listFileRuns,
	listInboundFileEvents,
	listInboundFileVendors,
	listInboundFiles,
	listValidationResults,
	reprocessInboundFile,
	seedInboundFiles,
} from "../api/fileManagementApi";

const domain = "file-management";

export function useFileRunsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "file-runs"),
		queryFn: listFileRuns,
		staleTime: Infinity,
	});
}

export function useFileRunQuery(id: string | null | undefined) {
	return useQuery({
		queryKey: featureQueryKey(domain, "file-run", id ?? ""),
		enabled: Boolean(id),
		queryFn: () => getFileRunById(String(id)),
		staleTime: Infinity,
	});
}

export function useInboundFilesQuery(params?: {
	stage?: string;
	vendor_id?: string;
}) {
	return useVendorCoreFeatureQuery(
		domain,
		"inbound-files",
		() => listInboundFiles(params),
		true,
		[params ?? {}]
	);
}

export function useInboundFileQuery(id: string | null | undefined) {
	return useVendorCoreFeatureQuery(
		domain,
		"inbound-file",
		() => getInboundFile(String(id)),
		Boolean(id),
		[id ?? ""]
	);
}

export function useInboundFileVendorsQuery() {
	return useVendorCoreFeatureQuery(domain, "vendors", listInboundFileVendors);
}

export function useMonitoringQuery() {
	return useVendorCoreFeatureQuery(domain, "monitoring", getMonitoring);
}

export function useValidationResultsQuery(
	params?: { inbound_file_id?: string; search?: string },
	enabled = true
) {
	return useVendorCoreFeatureQuery(
		domain,
		"validation-results",
		() => listValidationResults(params),
		enabled,
		[params ?? {}]
	);
}

export function useInboundFileEventsQuery(inboundFileId: string) {
	return useVendorCoreFeatureQuery(
		domain,
		"inbound-file-events",
		() => listInboundFileEvents(inboundFileId),
		Boolean(inboundFileId),
		[inboundFileId]
	);
}

export function useSeedInboundFilesMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof seedInboundFiles>>,
		Record<string, unknown> | undefined
	>(domain, {
		mutationFn: (body) => seedInboundFiles(body),
	});
}

export function useReprocessInboundFileMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof reprocessInboundFile>>,
		string
	>(domain, {
		mutationFn: (id) => reprocessInboundFile(id),
	});
}

export function useFileRunsList() {
	const query = useFileRunsQuery();
	return { ...query, fileRuns: query.data ?? [] };
}

export const useVendorCoreInboundFiles = useInboundFilesQuery;
export const useVendorCoreInboundFile = useInboundFileQuery;
export const useVendorCoreVendors = useInboundFileVendorsQuery;
export const useVendorCoreMonitoring = useMonitoringQuery;
export const useVendorCoreValidationResults = useValidationResultsQuery;
export const useVendorCoreInboundFileEvents = useInboundFileEventsQuery;

export { useInvalidateVendorCore };

export const useFileManagementQuery = useFileRunsQuery;
export const useFileManagementDetailQuery = useFileRunQuery;
