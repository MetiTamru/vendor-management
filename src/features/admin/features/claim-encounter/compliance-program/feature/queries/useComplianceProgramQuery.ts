"use client";

import { useQuery } from "@tanstack/react-query";

import { featureQueryKey } from "@/features/admin/shared/feature-contract";

import { getComplianceProgramPageConfig } from "../api/complianceProgramApi";
import { toComplianceProgramPageModel } from "../mappers/complianceProgramMappers";

const domain = "compliance-program";

export * from "../types/compliance-programModel";
export type * from "../types/complianceProgramModel";

export function useComplianceProgramPageQuery(slug: string) {
	return useQuery({
		queryKey: featureQueryKey(domain, "page", slug),
		queryFn: async () => {
			const dto = await getComplianceProgramPageConfig(slug);
			return dto ? toComplianceProgramPageModel(dto) : null;
		},
	});
}
