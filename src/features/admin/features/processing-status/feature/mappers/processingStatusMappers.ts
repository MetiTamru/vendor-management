export { toProcessingStatusModel } from "../../shared/mappers/processingStatusMappers";

import type { ProcessingStatusCreateDto, ProcessingStatusUpdateDto } from "../dto/processingStatusDto";
import type { ProcessingStatusModel } from "../types/processingStatusModel";

export function toProcessingStatusCreateDto(model: Pick<ProcessingStatusModel, "name">): ProcessingStatusCreateDto {
	return { name: model.name };
}

export function toProcessingStatusUpdateDto(
	model: Partial<Pick<ProcessingStatusModel, "name">>
): ProcessingStatusUpdateDto {
	return {
		...(model.name != null ? { name: model.name } : {}),
	};
}
