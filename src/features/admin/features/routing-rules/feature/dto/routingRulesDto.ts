export type { RoutingRuleDto as ApiRoutingRulesDto } from "@/lib/vendor-core/types";

export type RoutingRulesCreateDto = {
	name: string;
	destination_module: string;
	priority: number;
	is_active: boolean;
	edi_type?: string | null;
	parser?: string;
};
