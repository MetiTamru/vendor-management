"use client";

import { useSubscription } from "@/hooks/useSubscription";
import { type SubscriptionFeatures } from "@/lib/subscription/types";

interface FeatureGateProps {
	feature: keyof SubscriptionFeatures;
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
	const { hasFeature } = useSubscription();

	if (!hasFeature(feature)) {
		return fallback ?? null;
	}

	return <>{children}</>;
}
