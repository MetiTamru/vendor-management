"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import {
	getPartDKpis,
	listPartDSubmissions,
} from "../api/medicare-reportingApi";

const domain = "medicare-reporting";

export * from "../types/medicare-reportingModel";
export function useMedicareReportingPartDSubmissionsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "partDSubmissions"),
		queryFn: async () => {
			const items = await listPartDSubmissions();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useMedicareReportingPartDSubmissionsList() {
	const query = useMedicareReportingPartDSubmissionsQuery();
	return { ...query, partDSubmissions: query.data?.items ?? [] };
}
