import type { FeatureListResult } from "@/features/admin/shared/feature-contract";

import type { ErrorReviewRow, ErrorSummaryRow } from "../../mock-data";

export type {
	ErrorSummaryFilters,
	ErrorSummaryRow,
	ErrorReviewRow,
} from "../../mock-data";

export {
	ERROR_CORRECTION_FILE_TYPES,
	ERROR_CORRECTION_PROCESS_TYPES,
	ERROR_CORRECTION_ENROLLMENT_YEARS,
	ERROR_CORRECTION_ISSUER_NAMES,
	ERROR_CORRECTION_ENROLLEE_TYPES,
} from "../../mock-data";

export type ErrorSummaryModel = ErrorSummaryRow;
export type ErrorReviewModel = ErrorReviewRow;
export type ErrorSummaryListResult = FeatureListResult<ErrorSummaryRow>;
export type ErrorReviewListResult = FeatureListResult<ErrorReviewRow>;
