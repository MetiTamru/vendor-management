"use client";

import {
	useVendorCoreFeatureMutation,
	useVendorCoreFeatureQuery,
} from "@/features/admin/shared/vendor-core-feature-query";

import {
	createEligibilityFiles,
	listEligibilityFiles,
	listEligibilityVendors,
} from "../api/eligibilityFilesApi";
import type { EligibilityFilesCreateDto } from "../dto/eligibilityFilesDto";
import { toEligibilityFilesModel } from "../mappers/eligibilityFilesMappers";

const domain = "eligibility-files";

export function useEligibilityFilesQuery() {
	return useVendorCoreFeatureQuery(domain, "list", async () => {
		const items = (await listEligibilityFiles()).map(toEligibilityFilesModel);
		return { items, total: items.length };
	});
}

export function useEligibilityVendorsQuery() {
	return useVendorCoreFeatureQuery(domain, "vendors", async () => {
		const items = await listEligibilityVendors();
		return { items, total: items.length };
	});
}

export function useCreateEligibilityFilesMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof createEligibilityFiles>>,
		EligibilityFilesCreateDto
	>(domain, {
		mutationFn: (input) => createEligibilityFiles(input),
	});
}

export function useEligibilityFilesList() {
	const query = useEligibilityFilesQuery();
	return { ...query, eligibilityFiles: query.data?.items ?? [] };
}

export function useEligibilityVendorsList() {
	const query = useEligibilityVendorsQuery();
	return { ...query, vendors: query.data?.items ?? [] };
}

export const useCreateEligibilityFileMutation =
	useCreateEligibilityFilesMutation;
