"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import {
	getKpis,
	listMeasures,
	listReadinessRows,
} from "../api/measure-comparisonApi";

const domain = "quality-performance-measure-comparison";

export * from "../types/measure-comparisonModel";
export function useMeasureComparisonMeasuresQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "measures"),
		queryFn: async () => {
			const items = await listMeasures();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useMeasureComparisonMeasuresList() {
	const query = useMeasureComparisonMeasuresQuery();
	return { ...query, measures: query.data?.items ?? [] };
}

export function useMeasureComparisonReadinessRowsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "readinessRows"),
		queryFn: async () => {
			const items = await listReadinessRows();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useMeasureComparisonReadinessRowsList() {
	const query = useMeasureComparisonReadinessRowsQuery();
	return { ...query, readinessRows: query.data?.items ?? [] };
}
