"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import {
	getMemberOpportunityDetail,
	listCodingValidation,
	listHccSummary,
	listMemberOpportunities,
	listRaAudits,
	listRaDocuments,
	listRaSubmissions,
} from "../api/risk-adjustmentApi";

const domain = "risk-adjustment";

export * from "../types/risk-adjustmentModel";
export function useRiskAdjustmentHccSummaryQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "hccSummary"),
		queryFn: async () => {
			const items = await listHccSummary();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useRiskAdjustmentHccSummaryList() {
	const query = useRiskAdjustmentHccSummaryQuery();
	return { ...query, hccSummary: query.data?.items ?? [] };
}

export function useRiskAdjustmentMemberOpportunitiesQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "memberOpportunities"),
		queryFn: async () => {
			const items = await listMemberOpportunities();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useRiskAdjustmentMemberOpportunitiesList() {
	const query = useRiskAdjustmentMemberOpportunitiesQuery();
	return { ...query, memberOpportunities: query.data?.items ?? [] };
}

export function useRiskAdjustmentCodingValidationQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "codingValidation"),
		queryFn: async () => {
			const items = await listCodingValidation();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useRiskAdjustmentCodingValidationList() {
	const query = useRiskAdjustmentCodingValidationQuery();
	return { ...query, codingValidation: query.data?.items ?? [] };
}

export function useRiskAdjustmentRaSubmissionsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "raSubmissions"),
		queryFn: async () => {
			const items = await listRaSubmissions();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useRiskAdjustmentRaSubmissionsList() {
	const query = useRiskAdjustmentRaSubmissionsQuery();
	return { ...query, raSubmissions: query.data?.items ?? [] };
}

export function useRiskAdjustmentRaAuditsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "raAudits"),
		queryFn: async () => {
			const items = await listRaAudits();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useRiskAdjustmentRaAuditsList() {
	const query = useRiskAdjustmentRaAuditsQuery();
	return { ...query, raAudits: query.data?.items ?? [] };
}

export function useRiskAdjustmentRaDocumentsQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "raDocuments"),
		queryFn: async () => {
			const items = await listRaDocuments();
			const list = Array.isArray(items) ? items : [];
			return { items: list, total: list.length };
		},
	});
}

export function useRiskAdjustmentRaDocumentsList() {
	const query = useRiskAdjustmentRaDocumentsQuery();
	return { ...query, raDocuments: query.data?.items ?? [] };
}
