"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";
import { useVendorCoreFeatureQuery } from "@/features/admin/shared/vendor-core-feature-query";

import {
	getProcessingLogInboundFile,
	listProcessingLogFileRuns,
	listProcessingLogInboundFileEvents,
	listProcessingLogInboundFiles,
	listProcessingLogValidationResults,
	listProcessingLogVendors,
} from "../api/processingLogsApi";

const domain = "processing-logs";

export function useProcessingLogFileRunsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "file-runs"),
		queryFn: listProcessingLogFileRuns,
		staleTime: Infinity,
	});
}

export function useProcessingLogInboundFilesQuery(params?: {
	stage?: string;
	vendor_id?: string;
}) {
	return useVendorCoreFeatureQuery(
		domain,
		"inbound-files",
		() => listProcessingLogInboundFiles(params),
		true,
		[params ?? {}]
	);
}

export function useProcessingLogInboundFileQuery(
	id: string | null | undefined
) {
	return useVendorCoreFeatureQuery(
		domain,
		"inbound-file",
		() => getProcessingLogInboundFile(String(id)),
		Boolean(id),
		[id ?? ""]
	);
}

export function useProcessingLogInboundFileEventsQuery(inboundFileId: string) {
	return useVendorCoreFeatureQuery(
		domain,
		"inbound-file-events",
		() => listProcessingLogInboundFileEvents(inboundFileId),
		Boolean(inboundFileId),
		[inboundFileId]
	);
}

export function useProcessingLogValidationResultsQuery(
	params?: { inbound_file_id?: string; search?: string },
	enabled = true
) {
	return useVendorCoreFeatureQuery(
		domain,
		"validation-results",
		() => listProcessingLogValidationResults(params),
		enabled,
		[params ?? {}]
	);
}

export function useProcessingLogVendorsQuery() {
	return useVendorCoreFeatureQuery(domain, "vendors", listProcessingLogVendors);
}

export function useProcessingLogFileRunsList() {
	const query = useProcessingLogFileRunsQuery();
	return { ...query, fileRuns: query.data ?? [] };
}

export const useVendorCoreInboundFiles = useProcessingLogInboundFilesQuery;
export const useVendorCoreInboundFile = useProcessingLogInboundFileQuery;
export const useVendorCoreInboundFileEvents =
	useProcessingLogInboundFileEventsQuery;
export const useVendorCoreValidationResults =
	useProcessingLogValidationResultsQuery;
export const useVendorCoreVendors = useProcessingLogVendorsQuery;

export const useProcessingLogsQuery = useProcessingLogFileRunsQuery;
export const useProcessingLogsDetailQuery = useProcessingLogFileRunsQuery;
