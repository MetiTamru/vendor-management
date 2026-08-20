import { withMockOrRemote } from "@/lib/mock-mode";
import { vendorCoreApi } from "@/lib/vendor-core/api";

import {
	type ProviderSummary,
	getProvider,
	getProviderSummaries,
} from "../../mock-data";

export {
	displayProviderName,
	formatCompact,
	formatCurrency,
	formatDate,
	getProvider,
	initials,
	providerAge,
} from "../../mock-data";
export type {
	ClaimActivityStatus,
	CredentialStatus,
	ExceptionStatus,
	FeedStatus,
	NetworkStatus,
	ProviderDetail,
	ProviderStatus,
	ProviderSummary,
} from "../../mock-data";

export async function listProviderSummaries() {
	return withMockOrRemote(
		() => getProviderSummaries(),
		async () => [] as ProviderSummary[],
		[]
	);
}

export async function getProviderDetail(idOrNpi: string) {
	return withMockOrRemote(
		() => getProvider(idOrNpi),
		async () => undefined,
		undefined
	);
}

export async function listProviders() {
	const page = await vendorCoreApi.listProviders();
	return page.results ?? [];
}

export async function seedProviders(body?: { force?: boolean }) {
	return vendorCoreApi.seedProviders(body);
}
