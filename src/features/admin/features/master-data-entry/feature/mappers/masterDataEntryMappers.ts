import type { ApiMasterDataEntryDto } from "../dto/masterDataEntryDto";
import type { MasterDataEntryModel } from "../types/masterDataEntryModel";

export function toMasterDataEntryModel(
	dto: ApiMasterDataEntryDto
): MasterDataEntryModel {
	return dto;
}
