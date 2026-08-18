"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import {
	listAuditRequests,
	listAuditReports,
	listSubmissionHistory,
	listCmsResponses,
	listDocumentLibrary
} from "../api/cms-edgeApi";

const domain = "cms-edge";

export * from "../types/cms-edgeModel";
export function useCmsEdgeAuditRequestsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "auditRequests"),
		queryFn: async () => {
			const items = await listAuditRequests();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useCmsEdgeAuditRequestsList() {
	const query = useCmsEdgeAuditRequestsQuery();
	return { ...query, auditRequests: query.data?.items ?? [] };
}

export function useCmsEdgeAuditReportsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "auditReports"),
		queryFn: async () => {
			const items = await listAuditReports();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useCmsEdgeAuditReportsList() {
	const query = useCmsEdgeAuditReportsQuery();
	return { ...query, auditReports: query.data?.items ?? [] };
}

export function useCmsEdgeSubmissionHistoryQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "submissionHistory"),
		queryFn: async () => {
			const items = await listSubmissionHistory();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useCmsEdgeSubmissionHistoryList() {
	const query = useCmsEdgeSubmissionHistoryQuery();
	return { ...query, submissionHistory: query.data?.items ?? [] };
}

export function useCmsEdgeCmsResponsesQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "cmsResponses"),
		queryFn: async () => {
			const items = await listCmsResponses();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useCmsEdgeCmsResponsesList() {
	const query = useCmsEdgeCmsResponsesQuery();
	return { ...query, cmsResponses: query.data?.items ?? [] };
}

export function useCmsEdgeDocumentLibraryQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "documentLibrary"),
		queryFn: async () => {
			const items = await listDocumentLibrary();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useCmsEdgeDocumentLibraryList() {
	const query = useCmsEdgeDocumentLibraryQuery();
	return { ...query, documentLibrary: query.data?.items ?? [] };
}
