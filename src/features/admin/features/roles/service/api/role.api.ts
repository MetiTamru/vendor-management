import { apiClient } from "@/lib/api/client";

import type { ApiRoleDto, ApiRoleListResponseDto } from "../../dto/role.dto";
import type { RoleModel } from "../../types/role.types";
import { toRoleModelList } from "../mappers/role.mapper";
import { roleEndpoints } from "./role.endpoints";
import { MOCK_ROLES } from "./role.mock";

function isMockDataEnabled(): boolean {
	return process.env.NEXT_PUBLIC_USE_MOCK_ROLES === "true";
}

async function withMockFallback<T>(
	remote: () => Promise<T>,
	fallback: () => T
): Promise<T> {
	if (isMockDataEnabled()) return fallback();
	return remote();
}

export const roleApi = {
	async list(): Promise<RoleModel[]> {
		const dtos = await withMockFallback(
			() =>
				apiClient<ApiRoleListResponseDto | ApiRoleDto[]>(
					roleEndpoints.list()
				).then((res) => (Array.isArray(res) ? res : (res.results ?? []))),
			() => MOCK_ROLES
		);
		return toRoleModelList(dtos);
	},
};
