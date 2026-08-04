import { apiClient } from "@/lib/api/client";

import { rolesEndpoints } from "../../roles-endpoints";
import type {
	ApiRolesDto,
	RolesCreateDto,
	RolesUpdateDto,
} from "../dto/rolesDto";

export async function listRoles() {
	return apiClient<{ results?: ApiRolesDto[]; count?: number }>(
		rolesEndpoints.list()
	);
}

export async function getRoles(id: string) {
	return apiClient<ApiRolesDto>(rolesEndpoints.detail(id));
}

export async function createRoles(body: RolesCreateDto) {
	return apiClient<ApiRolesDto>(rolesEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateRoles(id: string, body: RolesUpdateDto) {
	return apiClient<ApiRolesDto>(rolesEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteRoles(id: string) {
	return apiClient<void>(rolesEndpoints.delete(id), {
		method: "DELETE",
	});
}
