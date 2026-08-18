"use client";

import {
	useInvalidateVendorCore,
	useVendorCoreFeatureMutation,
	useVendorCoreFeatureQuery,
} from "@/features/admin/shared/vendor-core-feature-query";

import { listProviderSummaries, listProviders, seedProviders } from "../api/providersApi";

const domain = "providers";

export function useProviderSummariesQuery() {
	return useVendorCoreFeatureQuery(domain, "summaries", listProviderSummaries);
}

export function useProvidersQuery(enabled = true) {
	return useVendorCoreFeatureQuery(domain, "list", listProviders, enabled);
}

export function useSeedProvidersMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof seedProviders>>,
		{ force?: boolean } | undefined
	>(domain, {
		mutationFn: (body) => seedProviders(body),
	});
}

export function useProviderSummariesList() {
	const query = useProviderSummariesQuery();
	return { ...query, providers: query.data ?? [] };
}

export const useVendorCoreProviders = useProvidersQuery;
export const useProvidersDetailQuery = useProvidersQuery;

export { useInvalidateVendorCore };
