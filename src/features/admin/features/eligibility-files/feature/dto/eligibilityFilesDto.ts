export type { EligibilityFileDto as ApiEligibilityFilesDto } from "@/lib/vendor-core/types";
export type { VendorDto as ApiEligibilityVendorDto } from "@/lib/vendor-core/types";

export type EligibilityFilesCreateDto = {
	vendor_id?: string;
	original_filename?: string;
	received_at?: string;
	member_count?: number;
};
