"use client";

import {
	useVendorCoreFeatureMutation,
	useVendorCoreFeatureQuery,
} from "@/features/admin/shared/vendor-core-feature-query";

import { createRoutingRules, listRoutingRules } from "../api/routingRulesApi";
import type { RoutingRulesCreateDto } from "../dto/routingRulesDto";
import { toRoutingRulesModel } from "../mappers/routingRulesMappers";

const domain = "routing-rules";

export function useRoutingRulesQuery() {
	return useVendorCoreFeatureQuery(domain, "list", async () => {
		const items = (await listRoutingRules()).map(toRoutingRulesModel);
		return { items, total: items.length };
	});
}

export function useCreateRoutingRulesMutation() {
	return useVendorCoreFeatureMutation<
		Awaited<ReturnType<typeof createRoutingRules>>,
		RoutingRulesCreateDto
	>(domain, {
		mutationFn: (input) => createRoutingRules(input),
	});
}

export function useRoutingRulesList() {
	const query = useRoutingRulesQuery();
	return { ...query, routingRules: query.data?.items ?? [] };
}

export const useCreateRoutingRuleMutation = useCreateRoutingRulesMutation;
