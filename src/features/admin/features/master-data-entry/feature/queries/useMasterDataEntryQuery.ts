"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import { listMasterDataEntry } from "../api/masterDataEntryApi";
import { toMasterDataEntryModel } from "../mappers/masterDataEntryMappers";

export {
	BASELINE_BENEFIT_YEARS,
	BASELINE_HIOS_OPTIONS,
	BASELINE_METRICS,
	BASELINE_QUARTERS,
	BASELINE_SEGMENTS,
	emptyBaselineGrid,
	isNumericBaselineInput,
} from "../types/masterDataEntryModel";
export type {
	BaselineGridValues,
	BaselineMarketType,
	BaselineSegmentId,
	SavedBaselineRecord,
} from "../types/masterDataEntryModel";

const domain = "master-data-entry";

export function useMasterDataEntryQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "list"),
		queryFn: async () => {
			const items = (await listMasterDataEntry()).map(toMasterDataEntryModel);
			return { items, total: items.length };
		},
	});
}

export function useMasterDataEntryList() {
	const query = useMasterDataEntryQuery();
	return { ...query, baselines: query.data?.items ?? [] };
}
