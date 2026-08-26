import { apiClient } from "@/lib/api/client";
import { isMockEnabled, isNestApiEnabled } from "@/lib/mock-mode";
import { vendorCoreApi } from "@/lib/vendor-core/api";
import type { RoleDto } from "@/lib/vendor-core/types";

import type { ApiRoleDto, ApiRoleListResponseDto } from "../../dto/role.dto";
import type { RoleModel } from "../../types/role.types";
import { toRoleModel, toRoleModelList } from "../mappers/role.mapper";
import { roleEndpoints } from "./role.endpoints";
import { MOCK_ROLES } from "./role.mock";

function coreDtoToApiDto(dto: RoleDto): ApiRoleDto {
	return {
		id: dto.id,
		name: dto.name,
		display_name: dto.display_name,
		description: dto.description,
		permissions: dto.permissions,
		is_system_role: dto.is_system_role,
	};
}

async function fetchNestList(): Promise<ApiRoleDto[]> {
	const res = await apiClient<ApiRoleListResponseDto | ApiRoleDto[]>(
		roleEndpoints.list()
	);
	return Array.isArray(res) ? res : (res.results ?? []);
}

async function fetchRemoteList(): Promise<ApiRoleDto[]> {
	if (isNestApiEnabled()) {
		return fetchNestList();
	}
	const page = await vendorCoreApi.listAllRoles();
	return (page.results ?? []).map(coreDtoToApiDto);
}

export const roleApi = {
	async list(): Promise<RoleModel[]> {
		const dtos = isMockEnabled() ? MOCK_ROLES : await fetchRemoteList();
		return toRoleModelList(dtos);
	},

	async getById(id: string): Promise<RoleModel | null> {
		try {
			const dto = isMockEnabled()
				? (MOCK_ROLES.find((r) => String(r.id) === id) ?? null)
				: isNestApiEnabled()
					? ((await fetchNestList()).find((r) => String(r.id) === id) ?? null)
					: coreDtoToApiDto(await vendorCoreApi.getRole(id));
			if (!dto) return null;
			return toRoleModel(dto);
		} catch {
			return null;
		}
	},
};
