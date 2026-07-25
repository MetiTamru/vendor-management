import { subscriptionPlans } from "@/lib/subscription/plans";
import { type SubscriptionFeatures } from "@/lib/subscription/types";

const FREE_TIER = {
	tier: "free",
	name: "Free Plan",
	price: 0,
	features: {
		canAccessAnalytics: false,
		maxProjects: 1,
		maxStorage: 100,
		supportPriority: "normal" as const,
		customTheme: false,
		apiAccess: false,
	},
};

export function useSubscription() {
	const currentPlan = subscriptionPlans[FREE_TIER.tier];

	const hasFeature = (feature: keyof SubscriptionFeatures): boolean => {
		if (!currentPlan) return false;
		return !!currentPlan.features[feature];
	};

	const isFeatureAvailable = (
		feature: keyof SubscriptionFeatures,
		value: number
	): boolean => {
		if (!currentPlan) return false;
		const limit = currentPlan.features[feature];
		return typeof limit === "number" ? value <= limit : !!limit;
	};

	return {
		currentPlan,
		hasFeature,
		isFeatureAvailable,
	};
}
