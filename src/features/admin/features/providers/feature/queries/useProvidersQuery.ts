"use client";

import {
	useInvalidateVendorCore,
	useVendorCoreFeatureMutation,
	useVendorCoreFeatureQuery,
} from "@/features/admin/shared/vendor-core-feature-query";
import { isMockEnabled } from "@/lib/mock-mode";

import { getProviderSummaries } from "../../mock-data";
import {
	listProviderSummaries,
	listProviders,
	seedProviders,
} from "../api/providersApi";

const domain = "providers";
const liveOnly = !isMockEnabled();

export function useProviderSummariesQuery() {
	return useVendorCoreFeatureQuery(domain, "summaries", listProviderSummaries);
}

export function useProvidersQuery(enabled = true) {
	return useVendorCoreFeatureQuery(
		domain,
		"list",
		listProviders,
		enabled && liveOnly
	);
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
	const providers = isMockEnabled()
		? getProviderSummaries()
		: (query.data ?? []);
	return { ...query, providers };
}

export const useVendorCoreProviders = useProvidersQuery;
export const useProvidersDetailQuery = useProvidersQuery;

export { useInvalidateVendorCore };
