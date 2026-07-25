import { type SubscriptionPlan } from "./types";

export const subscriptionPlans: Record<string, SubscriptionPlan> = {
	free: {
		tier: "free",
		name: "Free Plan",
		price: 0,
		features: {
			canAccessAnalytics: false,
			maxProjects: 1,
			maxStorage: 100, // MB
			supportPriority: "normal",
			customTheme: false,
			apiAccess: false,
		},
	},
	basic: {
		tier: "basic",
		name: "Basic Plan",
		price: 9.99,
		features: {
			canAccessAnalytics: true,
			maxProjects: 3,
			maxStorage: 1000, // MB
			supportPriority: "normal",
			customTheme: false,
			apiAccess: true,
		},
	},
	pro: {
		tier: "pro",
		name: "Pro Plan",
		price: 29.99,
		features: {
			canAccessAnalytics: true,
			maxProjects: 10,
			maxStorage: 5000, // MB
			supportPriority: "high",
			customTheme: true,
			apiAccess: true,
		},
	},
	enterprise: {
		tier: "enterprise",
		name: "Enterprise Plan",
		price: 99.99,
		features: {
			canAccessAnalytics: true,
			maxProjects: 50,
			maxStorage: 50000, // MB
			supportPriority: "priority",
			customTheme: true,
			apiAccess: true,
		},
	},
};
