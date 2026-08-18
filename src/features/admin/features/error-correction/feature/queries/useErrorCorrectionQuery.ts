"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import { listErrorReviews, listErrorSummary } from "../api/errorCorrectionApi";
import {
	toErrorReviewModel,
	toErrorSummaryModel,
} from "../mappers/errorCorrectionMappers";
import type { ErrorSummaryFilters } from "../types/errorCorrectionModel";

export {
	ERROR_CORRECTION_ENROLLEE_TYPES,
	ERROR_CORRECTION_ENROLLMENT_YEARS,
	ERROR_CORRECTION_FILE_TYPES,
	ERROR_CORRECTION_ISSUER_NAMES,
	ERROR_CORRECTION_PROCESS_TYPES,
} from "../types/errorCorrectionModel";
export type {
	ErrorSummaryFilters,
	ErrorSummaryRow,
	ErrorReviewRow,
} from "../types/errorCorrectionModel";

const domain = "error-correction";

export function useErrorSummaryQuery(filters: ErrorSummaryFilters | null) {
	return useQuery({
		queryKey: featureQueryKey(domain, "summary", filters),
		enabled: Boolean(filters),
		queryFn: async () => {
			const items = (await listErrorSummary(filters!)).map(toErrorSummaryModel);
			return { items, total: items.length };
		},
	});
}

export function useErrorReviewQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "review"),
		queryFn: async () => {
			const items = (await listErrorReviews()).map(toErrorReviewModel);
			return { items, total: items.length };
		},
	});
}

export function useErrorSummaryList(filters: ErrorSummaryFilters | null) {
	const query = useErrorSummaryQuery(filters);
	return { ...query, errorSummary: query.data?.items ?? [] };
}

export function useErrorReviewList() {
	const query = useErrorReviewQuery();
	return { ...query, errorReviews: query.data?.items ?? [] };
}
