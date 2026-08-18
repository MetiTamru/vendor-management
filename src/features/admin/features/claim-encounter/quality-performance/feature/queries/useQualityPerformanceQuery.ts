"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import {
	listOpenGapsByMeasure,
	listGapClosureActivity,
} from "../api/quality-performanceApi";
import { getQualityPerformancePlaceholder } from "../api/qualityPerformanceApi";
import { toQualityPerformancePlaceholderModel } from "../mappers/qualityPerformanceMappers";

const domain = "quality-performance";

export * from "../types/quality-performanceModel";
export type * from "../types/qualityPerformanceModel";

export function useQualityPerformancePlaceholderQuery(slug: string) {
	return useQuery({
		queryKey: featureQueryKey(domain, "placeholder", slug),
		queryFn: async () => {
			const dto = await getQualityPerformancePlaceholder(slug);
			return dto ? toQualityPerformancePlaceholderModel(dto) : null;
		},
	});
}

export function useQualityPerformanceOpenGapsByMeasureQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "openGapsByMeasure"),
		queryFn: async () => {
			const items = await listOpenGapsByMeasure();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useQualityPerformanceOpenGapsByMeasureList() {
	const query = useQualityPerformanceOpenGapsByMeasureQuery();
	return { ...query, openGapsByMeasure: query.data?.items ?? [] };
}

export function useQualityPerformanceGapClosureActivityQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "gapClosureActivity"),
		queryFn: async () => {
			const items = await listGapClosureActivity();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useQualityPerformanceGapClosureActivityList() {
	const query = useQualityPerformanceGapClosureActivityQuery();
	return { ...query, gapClosureActivity: query.data?.items ?? [] };
}
