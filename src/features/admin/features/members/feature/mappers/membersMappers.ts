export { toMembersModel } from "../../shared/mappers/membersMappers";

import type { MembersCreateDto, MembersUpdateDto } from "../dto/membersDto";
import type { MembersModel } from "../types/membersModel";

export function toMembersCreateDto(model: Pick<MembersModel, "name">): MembersCreateDto {
	return { name: model.name };
}

export function toMembersUpdateDto(
	model: Partial<Pick<MembersModel, "name">>
): MembersUpdateDto {
	return {
		...(model.name != null ? { name: model.name } : {}),
	};
}
