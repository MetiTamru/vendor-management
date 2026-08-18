import type { FeatureListResult } from "@/features/admin/shared/feature-contract";
import type { VendorDto } from "@/lib/vendor-core/types";

export type ProviderRostersModel = {
	id: string;
	referenceId?: string;
	vendorId?: string | null;
	vendor?: string | null;
	sourceInboundFileId?: string | null;
	originalFilename?: string;
	receivedAt?: string;
	providerCount?: number;
	createdAt?: string;
	updatedAt?: string;
};

export type ProviderRosterVendorModel = VendorDto;

export type ProviderRostersListResult = FeatureListResult<ProviderRostersModel>;
