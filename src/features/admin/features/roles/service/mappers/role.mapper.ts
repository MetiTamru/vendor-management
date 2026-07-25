import type { ApiRoleDto } from "../../dto/role.dto";
import type { RoleModel } from "../../types/role.types";

export function toRoleModel(dto: ApiRoleDto): RoleModel | null {
	const id = dto.id != null ? String(dto.id) : null;
	const name = dto.name?.trim();
	if (!id || !name) return null;

	return {
		id,
		name,
		permissions: Array.isArray(dto.permissions)
			? dto.permissions.map(String)
			: [],
	};
}

export function toRoleModelList(dtos: ApiRoleDto[]): RoleModel[] {
	return dtos
		.map((dto) => toRoleModel(dto))
		.filter((model): model is RoleModel => model !== null);
}
