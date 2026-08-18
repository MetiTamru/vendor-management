import { vendorCoreApi } from "@/lib/vendor-core/api";
import type { RoutingRuleDto } from "@/lib/vendor-core/types";

import type { RoutingRulesCreateDto } from "../dto/routingRulesDto";

export async function listRoutingRules(): Promise<RoutingRuleDto[]> {
	const page = await vendorCoreApi.listRoutingRules();
	return page.results ?? [];
}

export async function createRoutingRules(
	input: RoutingRulesCreateDto
): Promise<RoutingRuleDto> {
	return vendorCoreApi.createRoutingRule(input);
}
