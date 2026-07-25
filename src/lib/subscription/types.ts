export type SubscriptionTier = "free" | "basic" | "pro" | "enterprise";

export interface SubscriptionFeatures {
	canAccessAnalytics: boolean;
	maxProjects: number;
	maxStorage: number;
	supportPriority: "normal" | "high" | "priority";
	customTheme: boolean;
	apiAccess: boolean;
}

export interface SubscriptionPlan {
	tier: SubscriptionTier;
	name: string;
	price: number;
	features: SubscriptionFeatures;
}
