import type { FeatureListResult } from "@/features/admin/shared/feature-contract";

import type { SavedBaselineRecord } from "../../mock-data";

export type {
	BaselineMarketType,
	BaselineMetricId,
	BaselineSegmentId,
	BaselineGridValues,
	SavedBaselineRecord,
} from "../../mock-data";

export {
	BASELINE_HIOS_OPTIONS,
	BASELINE_BENEFIT_YEARS,
	BASELINE_QUARTERS,
	BASELINE_METRICS,
	BASELINE_SEGMENTS,
	emptyBaselineGrid,
	isNumericBaselineInput,
} from "../../mock-data";

export type MasterDataEntryModel = SavedBaselineRecord;
export type MasterDataEntryListResult = FeatureListResult<SavedBaselineRecord>;
