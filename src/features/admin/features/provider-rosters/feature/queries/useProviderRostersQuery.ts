"use client";

import { useVendorCoreFeatureQuery } from "@/features/admin/shared/vendor-core-feature-query";

import {
	listProviderRosterVendors,
	listProviderRosters,
} from "../api/providerRostersApi";
import { toProviderRostersModel } from "../mappers/providerRostersMappers";

const domain = "provider-rosters";

export function useProviderRostersQuery() {
	return useVendorCoreFeatureQuery(domain, "list", async () => {
		const items = (await listProviderRosters()).map(toProviderRostersModel);
		return { items, total: items.length };
	});
}

export function useProviderRosterVendorsQuery() {
	return useVendorCoreFeatureQuery(domain, "vendors", async () => {
		const items = await listProviderRosterVendors();
		return { items, total: items.length };
	});
}

export function useProviderRostersList() {
	const query = useProviderRostersQuery();
	return { ...query, providerRosters: query.data?.items ?? [] };
}

export function useProviderRosterVendorsList() {
	const query = useProviderRosterVendorsQuery();
	return { ...query, vendors: query.data?.items ?? [] };
}
