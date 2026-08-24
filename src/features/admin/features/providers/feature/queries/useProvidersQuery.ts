"use client";

import {
	useInvalidateVendorCore,
	useVendorCoreFeatureMutation,
	useVendorCoreFeatureQuery,
} from "@/features/admin/shared/vendor-core-feature-query";
import { isMockEnabled } from "@/lib/mock-mode";
import type {
	ProviderCreateInput,
	ProviderDashboardStatsQuery,
	ProviderListQuery,
	ProviderRosterCreateInput,
	ProviderRosterListQuery,
	ProviderRosterUpdateInput,
	ProviderStatusInput,
	ProviderUpdateInput,
} from "@/lib/vendor-core/types";

import { getProviderSummaries } from "../../mock-data";
import {
	createProvider,
	createProviderRoster,
	deleteProvider,
	deleteProviderRoster,
	getProviderDashboardStats,
	getProviderDetail,
	listProviderRosters,
	listProviderSummaries,
	listProviders,
	recountProviderRoster,
	restoreProvider,
	restoreProviderRoster,
	seedProviders,
	setProviderStatus,
	updateProvider,
	updateProviderRoster,
} from "../api/providersApi";
import type { ProviderSummary } from "../api/providersApi";

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

export function useProvidersListQuery(
	params: ProviderListQuery | undefined,
	enabled = true
) {
	return useVendorCoreFeatureQuery(
		domain,
		"list",
		() => listProviders(params),
		enabled && liveOnly,
		[params]
	);
}

export function useProviderDashboardStatsQuery(
	params?: ProviderDashboardStatsQuery,
	enabled = true
) {
	return useVendorCoreFeatureQuery(
		domain,
		"dashboard-stats",
		() => getProviderDashboardStats(params),
		enabled && liveOnly,
		[params]
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

export function useCreateProviderMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof createProvider>>,
		ProviderCreateInput
	>(domain, {
		mutationFn: (body) => createProvider(body),
	});
}

export function useUpdateProviderMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof updateProvider>>,
		{ id: string; body: ProviderUpdateInput }
	>(domain, {
		mutationFn: ({ id, body }) => updateProvider(id, body),
	});
}

export function useSetProviderStatusMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof setProviderStatus>>,
		{ id: string; body: ProviderStatusInput }
	>(domain, {
		mutationFn: ({ id, body }) => setProviderStatus(id, body),
	});
}

export function useDeleteProviderMutation() {
	return useVendorCoreFeatureMutation<void, { id: string }>(domain, {
		mutationFn: ({ id }) => deleteProvider(id),
	});
}

export function useRestoreProviderMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof restoreProvider>>,
		{ id: string }
	>(domain, {
		mutationFn: ({ id }) => restoreProvider(id),
	});
}

export function useProviderRostersQuery(
	params?: ProviderRosterListQuery,
	enabled = true
) {
	return useVendorCoreFeatureQuery(
		domain,
		"rosters",
		() => listProviderRosters(params),
		enabled && liveOnly,
		[params]
	);
}

export function useCreateProviderRosterMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof createProviderRoster>>,
		ProviderRosterCreateInput
	>(domain, {
		mutationFn: (body) => createProviderRoster(body),
	});
}

export function useUpdateProviderRosterMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof updateProviderRoster>>,
		{ id: string; body: ProviderRosterUpdateInput }
	>(domain, {
		mutationFn: ({ id, body }) => updateProviderRoster(id, body),
	});
}

export function useRecountProviderRosterMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof recountProviderRoster>>,
		{ id: string }
	>(domain, {
		mutationFn: ({ id }) => recountProviderRoster(id),
	});
}

export function useDeleteProviderRosterMutation() {
	return useVendorCoreFeatureMutation<void, { id: string }>(domain, {
		mutationFn: ({ id }) => deleteProviderRoster(id),
	});
}

export function useRestoreProviderRosterMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof restoreProviderRoster>>,
		{ id: string }
	>(domain, {
		mutationFn: ({ id }) => restoreProviderRoster(id),
	});
}

export function useProviderDetailQuery(
	providerId: string,
	enabled = true,
	program: ProviderSummary["program"] = "DHCF"
) {
	return useVendorCoreFeatureQuery(
		domain,
		"detail",
		() => getProviderDetail(providerId, program),
		enabled && liveOnly && Boolean(providerId),
		[providerId, program]
	);
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
