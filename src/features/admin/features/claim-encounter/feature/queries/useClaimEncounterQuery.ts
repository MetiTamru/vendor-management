"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";
import {
	useVendorCoreFeatureMutation,
	useVendorCoreFeatureQuery,
} from "@/features/admin/shared/vendor-core-feature-query";
import type { ProgramFileType } from "@/types/UI/system.types";

import {
	deleteClaimLine,
	getProgramExceptions,
	getProgramFiles,
	getProgramResponses,
	getProgramVendorPerformance,
	hardDeleteClaimLine,
	listClaimExceptions,
	listClaimLines,
	listClaimLinesLive,
	listClaimResponses,
	listClaimVendorFiles,
	listSubmissionBatches,
	restoreClaimLine,
	seedClaimLines,
} from "../api/claimEncounterApi";

const domain = "claim-encounter";

export function useClaimVendorFilesQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "vendor-files"),
		queryFn: listClaimVendorFiles,
		staleTime: Infinity,
	});
}

export function useClaimResponsesQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "responses"),
		queryFn: listClaimResponses,
		staleTime: Infinity,
	});
}

export function useClaimExceptionsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "exceptions"),
		queryFn: listClaimExceptions,
		staleTime: Infinity,
	});
}

export function useMockClaimLinesQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "claim-lines-mock"),
		queryFn: listClaimLines,
		staleTime: Infinity,
	});
}

export function useSubmissionBatchesQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "submission-batches"),
		queryFn: listSubmissionBatches,
		staleTime: Infinity,
	});
}

export function useClaimLinesLiveQuery(enabled = true) {
	return useVendorCoreFeatureQuery(
		domain,
		"claim-lines-live",
		listClaimLinesLive,
		enabled
	);
}

export function useProgramFilesQuery(
	program: ProgramFileType,
	direction: "inbound" | "outbound"
) {
	return useQuery({
		queryKey: featureQueryKey(domain, "program-files", program, direction),
		queryFn: () => getProgramFiles(program, direction),
		staleTime: Infinity,
	});
}

export function useProgramResponsesQuery(program: ProgramFileType) {
	return useQuery({
		queryKey: featureQueryKey(domain, "program-responses", program),
		queryFn: () => getProgramResponses(program),
		staleTime: Infinity,
	});
}

export function useProgramExceptionsQuery(program: ProgramFileType) {
	return useQuery({
		queryKey: featureQueryKey(domain, "program-exceptions", program),
		queryFn: () => getProgramExceptions(program),
		staleTime: Infinity,
	});
}

export function useProgramVendorPerformanceQuery(program: ProgramFileType) {
	return useQuery({
		queryKey: featureQueryKey(domain, "vendor-performance", program),
		queryFn: () => getProgramVendorPerformance(program),
		staleTime: Infinity,
	});
}

export function useSeedClaimLinesMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof seedClaimLines>>,
		{ vendor_id?: string; force?: boolean } | undefined
	>(domain, {
		mutationFn: (body) => seedClaimLines(body),
	});
}

export function useDeleteClaimLineMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof deleteClaimLine>>,
		string
	>(domain, {
		mutationFn: (id) => deleteClaimLine(id),
	});
}

export function useHardDeleteClaimLineMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof hardDeleteClaimLine>>,
		string
	>(domain, {
		mutationFn: (id) => hardDeleteClaimLine(id),
	});
}

export function useRestoreClaimLineMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof restoreClaimLine>>,
		string
	>(domain, {
		mutationFn: (id) => restoreClaimLine(id),
	});
}

export const useVendorCoreClaimLines = useClaimLinesLiveQuery;
export const useSeedClaimLines = useSeedClaimLinesMutation;
export const useDeleteClaimLine = useDeleteClaimLineMutation;
export const useHardDeleteClaimLine = useHardDeleteClaimLineMutation;
export const useRestoreClaimLine = useRestoreClaimLineMutation;
