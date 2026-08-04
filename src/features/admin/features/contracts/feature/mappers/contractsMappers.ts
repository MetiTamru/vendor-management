export { toContractsModel } from "../../shared/mappers/contractsMappers";

import type { ContractsCreateDto, ContractsUpdateDto } from "../dto/contractsDto";
import type { ContractsModel } from "../types/contractsModel";

export function toContractsCreateDto(model: Pick<ContractsModel, "name">): ContractsCreateDto {
	return { name: model.name };
}

export function toContractsUpdateDto(
	model: Partial<Pick<ContractsModel, "name">>
): ContractsUpdateDto {
	return {
		...(model.name != null ? { name: model.name } : {}),
	};
}
