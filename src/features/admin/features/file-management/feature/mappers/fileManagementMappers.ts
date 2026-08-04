export { toFileManagementModel } from "../../shared/mappers/fileManagementMappers";

import type { FileManagementCreateDto, FileManagementUpdateDto } from "../dto/fileManagementDto";
import type { FileManagementModel } from "../types/fileManagementModel";

export function toFileManagementCreateDto(model: Pick<FileManagementModel, "name">): FileManagementCreateDto {
	return { name: model.name };
}

export function toFileManagementUpdateDto(
	model: Partial<Pick<FileManagementModel, "name">>
): FileManagementUpdateDto {
	return {
		...(model.name != null ? { name: model.name } : {}),
	};
}
