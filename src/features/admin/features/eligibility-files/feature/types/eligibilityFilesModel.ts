import type { FeatureListResult } from "@/features/admin/shared/feature-contract";
import type { VendorDto, VendorRef } from "@/lib/vendor-core/types";

export type EligibilityFilesModel = {
	id: string;
	referenceId?: string;
	vendorId?: string | null;
	vendor?: string | VendorRef | null;
	originalFilename?: string;
	receivedAt?: string;
	memberCount?: number;
	createdAt?: string;
	updatedAt?: string;
};

export type EligibilityVendorModel = VendorDto;

export type EligibilityFilesListResult =
	FeatureListResult<EligibilityFilesModel>;
