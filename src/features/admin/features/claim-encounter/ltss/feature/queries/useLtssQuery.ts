"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import {
	listAuthorizations,
	listUtilization,
	listVendors,
	listExceptions,
	listSubmissions,
	getKpis
} from "../api/ltssApi";

const domain = "ltss";

export * from "../types/ltssModel";
export function useLtssAuthorizationsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "authorizations"),
		queryFn: async () => {
			const items = await listAuthorizations();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useLtssAuthorizationsList() {
	const query = useLtssAuthorizationsQuery();
	return { ...query, authorizations: query.data?.items ?? [] };
}

export function useLtssUtilizationQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "utilization"),
		queryFn: async () => {
			const items = await listUtilization();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useLtssUtilizationList() {
	const query = useLtssUtilizationQuery();
	return { ...query, utilization: query.data?.items ?? [] };
}

export function useLtssVendorsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "vendors"),
		queryFn: async () => {
			const items = await listVendors();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useLtssVendorsList() {
	const query = useLtssVendorsQuery();
	return { ...query, vendors: query.data?.items ?? [] };
}

export function useLtssExceptionsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "exceptions"),
		queryFn: async () => {
			const items = await listExceptions();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useLtssExceptionsList() {
	const query = useLtssExceptionsQuery();
	return { ...query, exceptions: query.data?.items ?? [] };
}

export function useLtssSubmissionsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "submissions"),
		queryFn: async () => {
			const items = await listSubmissions();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useLtssSubmissionsList() {
	const query = useLtssSubmissionsQuery();
	return { ...query, submissions: query.data?.items ?? [] };
}
