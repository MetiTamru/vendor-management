"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import {
	listAlerts,
	listDomains,
	listRegulatoryQualityMeasures,
	listRiskExceptions,
} from "../api/executive-analyticsApi";

const domain = "executive-analytics";

export * from "../types/executive-analyticsModel";
export function useExecutiveAnalyticsDomainsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "domains"),
		queryFn: async () => {
			const items = await listDomains();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useExecutiveAnalyticsDomainsList() {
	const query = useExecutiveAnalyticsDomainsQuery();
	return { ...query, domains: query.data?.items ?? [] };
}

export function useExecutiveAnalyticsAlertsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "alerts"),
		queryFn: async () => {
			const items = await listAlerts();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useExecutiveAnalyticsAlertsList() {
	const query = useExecutiveAnalyticsAlertsQuery();
	return { ...query, alerts: query.data?.items ?? [] };
}
