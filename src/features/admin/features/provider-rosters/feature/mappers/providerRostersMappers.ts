import type { ApiProviderRostersDto } from "../dto/providerRostersDto";
import type { ProviderRostersModel } from "../types/providerRostersModel";

export function toProviderRostersModel(
	dto: ApiProviderRostersDto
): ProviderRostersModel {
	return {
		id: dto.id,
		referenceId: dto.reference_id,
		vendorId: dto.vendor_id,
		vendor: dto.vendor,
		sourceInboundFileId: dto.source_inbound_file_id,
		originalFilename: dto.original_filename,
		receivedAt: dto.received_at,
		providerCount: dto.provider_count,
		createdAt: dto.created_at,
		updatedAt: dto.updated_at,
	};
}
