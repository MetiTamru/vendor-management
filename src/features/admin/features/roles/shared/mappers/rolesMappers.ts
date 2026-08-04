import type { ApiRolesRecordDto } from "../dto/rolesRecordDto";
import type { RolesModel } from "../../feature/types/rolesModel";

export function toRolesModel(
	row: ApiRolesRecordDto,
	index = 0
): RolesModel {
	const id = row.id != null ? String(row.id) : `roles-${index}`;
	const name =
		typeof row.name === "string" && row.name.length > 0 ? row.name : "—";
	return { id, name };
}
