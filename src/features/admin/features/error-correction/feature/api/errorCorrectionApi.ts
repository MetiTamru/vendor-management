import { withMockOrRemote } from "@/lib/mock-mode";

import {
	type ErrorSummaryFilters,
	MOCK_ERROR_REVIEW_ROWS,
	MOCK_ERROR_SUMMARY_ROWS,
	filterErrorSummaryRows,
} from "../../mock-data";
import type {
	ApiErrorReviewDto,
	ApiErrorSummaryDto,
} from "../dto/errorCorrectionDto";

export async function listErrorSummary(
	filters: ErrorSummaryFilters
): Promise<ApiErrorSummaryDto[]> {
	return withMockOrRemote(
		() => filterErrorSummaryRows(MOCK_ERROR_SUMMARY_ROWS, filters),
		async () => []
	);
}

export async function listErrorReviews(): Promise<ApiErrorReviewDto[]> {
	return withMockOrRemote(
		() => MOCK_ERROR_REVIEW_ROWS,
		async () => []
	);
}
