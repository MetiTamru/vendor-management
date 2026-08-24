import type { ApiRoleDto } from "../../dto/role.dto";
import type { RoleModel } from "../../types/role.types";

export function toRoleModel(dto: ApiRoleDto): RoleModel | null {
	const id = dto.id != null ? String(dto.id) : null;
	const slug = typeof dto.name === "string" ? dto.name.trim() : "";
	const label =
		(typeof dto.display_name === "string" ? dto.display_name.trim() : "") ||
		slug;
	if (!id || !label) return null;

	const permissions = Array.isArray(dto.permissions)
		? dto.permissions.map(String)
		: [];

	return {
		id,
		name: label,
		slug: slug || label,
		permissions,
		isSystemRole: dto.is_system_role === true,
		description: typeof dto.description === "string" ? dto.description : null,
	};
}

export function toRoleModelList(dtos: ApiRoleDto[]): RoleModel[] {
	return dtos
		.map((dto) => toRoleModel(dto))
		.filter((model): model is RoleModel => model !== null);
}
