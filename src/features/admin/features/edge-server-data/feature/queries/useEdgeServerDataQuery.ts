"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import {
	listHhsMasterData,
	listPublishedDateReport,
	listQuarterlyBaseline,
	listThresholdReport,
} from "../api/edgeServerDataApi";
import {
	toEdgeServerDataModel,
	toHhsMasterDataModel,
} from "../mappers/edgeServerDataMappers";
import type {
	EdgeServerTabId,
	QuarterlyBaselineFilters,
} from "../types/edgeServerDataModel";

export {
	EDGE_SERVER_TABS,
	PUBLISHED_DATE_OPTIONS,
	QUARTERLY_BASELINE_DATES,
	QUARTERLY_BENEFIT_YEARS,
	QUARTERLY_EXTRACTION_DATES,
	QUARTERLY_HIOS_IDS,
} from "../types/edgeServerDataModel";
export type {
	EdgeServerTabId,
	QuarterlyBaselineFilters,
	EdgeServerRow,
	HhsMasterDataRow,
} from "../types/edgeServerDataModel";
export { publishedDateLabel } from "../mappers/edgeServerDataMappers";

const domain = "edge-server-data";

export function useThresholdReportQuery(publishedDate: string) {
	return useQuery({
		queryKey: featureQueryKey(domain, "threshold-report", publishedDate),
		enabled: Boolean(publishedDate),
		queryFn: async () => {
			const items = (await listThresholdReport(publishedDate)).map(
				toEdgeServerDataModel
			);
			return { items, total: items.length };
		},
	});
}

export function usePublishedDateReportQuery(
	tabId: EdgeServerTabId,
	publishedDate: string
) {
	return useQuery({
		queryKey: featureQueryKey(domain, "published-date", tabId, publishedDate),
		enabled: Boolean(publishedDate),
		queryFn: async () => {
			const items = (await listPublishedDateReport(tabId, publishedDate)).map(
				toEdgeServerDataModel
			);
			return { items, total: items.length };
		},
	});
}

export function useQuarterlyBaselineQuery(
	filters: QuarterlyBaselineFilters | null
) {
	const complete =
		Boolean(filters) &&
		filters!.benefitYear !== "all" &&
		filters!.hiosId !== "all" &&
		filters!.baselineDate !== "all" &&
		filters!.hhsExtractionDate !== "all";

	return useQuery({
		queryKey: featureQueryKey(domain, "quarterly-baseline", filters),
		enabled: complete,
		queryFn: async () => {
			const items = (await listQuarterlyBaseline(filters!)).map(
				toEdgeServerDataModel
			);
			return { items, total: items.length };
		},
	});
}

export function useHhsMasterDataQuery(search = "") {
	return useQuery({
		queryKey: featureQueryKey(domain, "hhs-master-data", search),
		queryFn: async () => {
			const items = (await listHhsMasterData(search)).map(toHhsMasterDataModel);
			return { items, total: items.length };
		},
	});
}

export function useThresholdReportList(publishedDate: string) {
	const query = useThresholdReportQuery(publishedDate);
	return { ...query, rows: query.data?.items ?? [] };
}

export function usePublishedDateReportList(
	tabId: EdgeServerTabId,
	publishedDate: string
) {
	const query = usePublishedDateReportQuery(tabId, publishedDate);
	return { ...query, rows: query.data?.items ?? [] };
}

export function useQuarterlyBaselineList(
	filters: QuarterlyBaselineFilters | null
) {
	const query = useQuarterlyBaselineQuery(filters);
	return { ...query, rows: query.data?.items ?? [] };
}

export function useHhsMasterDataList(search = "") {
	const query = useHhsMasterDataQuery(search);
	return { ...query, rows: query.data?.items ?? [] };
}
