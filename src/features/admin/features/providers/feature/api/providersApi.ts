import { vendorCoreApi } from "@/lib/vendor-core/api";

import {
	PROVIDER_DETAILS,
	PROVIDER_SUMMARIES,
	getProvider,
} from "../../mock-data";
import { withMockOrRemote } from "@/lib/mock-mode";

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
		() => PROVIDER_SUMMARIES,
		async () => [] as typeof PROVIDER_SUMMARIES,
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
