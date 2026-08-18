import type { FeatureListResult } from "@/features/admin/shared/feature-contract";

export type RoutingRulesModel = {
	id: string;
	name: string;
	priority: number;
	isActive: boolean;
	destinationModule: string;
	ediType?: string | null;
	parser?: string;
};

export type RoutingRulesListResult = FeatureListResult<RoutingRulesModel>;
