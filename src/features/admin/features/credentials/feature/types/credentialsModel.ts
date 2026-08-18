import type { FeatureListResult } from "@/features/admin/shared/feature-contract";

export type CredentialsModel = {
	id: string;
	name: string;
	kind: string;
	secretRef: string;
	createdAt?: string;
};

export type CredentialsListResult = FeatureListResult<CredentialsModel>;
