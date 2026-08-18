"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import {
	listObligations,
	listUpcomingDeadlines,
	getObligationDetail
} from "../api/compliance-calendarApi";

const domain = "compliance-calendar";

export * from "../types/compliance-calendarModel";
export function useComplianceCalendarObligationsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "obligations"),
		queryFn: async () => {
			const items = await listObligations();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useComplianceCalendarObligationsList() {
	const query = useComplianceCalendarObligationsQuery();
	return { ...query, obligations: query.data?.items ?? [] };
}

export function useComplianceCalendarUpcomingDeadlinesQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "upcomingDeadlines"),
		queryFn: async () => {
			const items = await listUpcomingDeadlines();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useComplianceCalendarUpcomingDeadlinesList() {
	const query = useComplianceCalendarUpcomingDeadlinesQuery();
	return { ...query, upcomingDeadlines: query.data?.items ?? [] };
}
