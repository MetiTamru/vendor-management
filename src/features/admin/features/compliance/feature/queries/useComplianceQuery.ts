"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import { listCompliance } from "../api/complianceApi";
import { toComplianceModel } from "../mappers/complianceMappers";

const domain = "compliance";

export function useComplianceQuery() {
	return useQuery({
		queryKey: featureQueryKey(domain, "list"),
		queryFn: async () => {
			const items = (await listCompliance()).map(toComplianceModel);
			return { items, total: items.length };
		},
	});
}

export function useCertificatesList() {
	const query = useComplianceQuery();
	return { ...query, certificates: query.data?.items ?? [] };
}

export const useComplianceDetailQuery = useComplianceQuery;
