import type { FeatureListResult } from "@/features/admin/shared/feature-contract";

import type { EdgeServerRow, HhsMasterDataRow } from "../../mock-data";

export type {
	EdgeServerTabId,
	EdgeServerRow,
	HhsMasterDataRow,
	QuarterlyBaselineFilters,
} from "../../mock-data";

export {
	EDGE_SERVER_TABS,
	PUBLISHED_DATE_OPTIONS,
	QUARTERLY_BENEFIT_YEARS,
	QUARTERLY_HIOS_IDS,
	QUARTERLY_BASELINE_DATES,
	QUARTERLY_EXTRACTION_DATES,
} from "../../mock-data";

export type EdgeServerDataModel = EdgeServerRow;
export type HhsMasterDataModel = HhsMasterDataRow;

export type EdgeServerDataListResult = FeatureListResult<EdgeServerRow>;
export type HhsMasterDataListResult = FeatureListResult<HhsMasterDataRow>;
