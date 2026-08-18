import type { ApiEligibilityFilesDto } from "../dto/eligibilityFilesDto";
import type { EligibilityFilesModel } from "../types/eligibilityFilesModel";

export function toEligibilityFilesModel(
	dto: ApiEligibilityFilesDto
): EligibilityFilesModel {
	return {
		id: dto.id,
		referenceId: dto.reference_id,
		vendorId: dto.vendor_id,
		vendor: dto.vendor,
		originalFilename: dto.original_filename,
		receivedAt: dto.received_at,
		memberCount: dto.member_count,
		createdAt: dto.created_at,
		updatedAt: dto.updated_at,
	};
}
