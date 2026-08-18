import { withMockOrRemote } from "@/lib/mock-mode";

import {
	type EdgeServerTabId,
	HHS_MASTER_DATA_ROWS,
	type QuarterlyBaselineFilters,
	filterHhsMasterDataRows,
	mockEdgeServerRows,
	mockQuarterlyBaselineRows,
	mockThresholdReportRows,
} from "../../mock-data";
import type {
	ApiEdgeServerDataDto,
	ApiHhsMasterDataDto,
} from "../dto/edgeServerDataDto";

export async function listThresholdReport(
	publishedDate: string
): Promise<ApiEdgeServerDataDto[]> {
	return withMockOrRemote(
		() => mockThresholdReportRows(publishedDate),
		async () => []
	);
}

export async function listPublishedDateReport(
	tabId: EdgeServerTabId,
	publishedDate: string
): Promise<ApiEdgeServerDataDto[]> {
	return withMockOrRemote(
		() =>
			tabId === "threshold-report"
				? mockThresholdReportRows(publishedDate)
				: mockEdgeServerRows(tabId, publishedDate),
		async () => []
	);
}

export async function listQuarterlyBaseline(
	filters: QuarterlyBaselineFilters
): Promise<ApiEdgeServerDataDto[]> {
	return withMockOrRemote(
		() => mockQuarterlyBaselineRows(filters),
		async () => []
	);
}

export async function listHhsMasterData(
	search = ""
): Promise<ApiHhsMasterDataDto[]> {
	return withMockOrRemote(
		() => filterHhsMasterDataRows(HHS_MASTER_DATA_ROWS, search),
		async () => []
	);
}
