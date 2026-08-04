export { toGroupsModel } from "../../shared/mappers/groupsMappers";

import type { GroupsCreateDto, GroupsUpdateDto } from "../dto/groupsDto";
import type { GroupsModel } from "../types/groupsModel";

export function toGroupsCreateDto(model: Pick<GroupsModel, "name">): GroupsCreateDto {
	return { name: model.name };
}

export function toGroupsUpdateDto(
	model: Partial<Pick<GroupsModel, "name">>
): GroupsUpdateDto {
	return {
		...(model.name != null ? { name: model.name } : {}),
	};
}
