import { apiClient } from "@/lib/api/client";

import { groupsEndpoints } from "../../groups-endpoints";
import type {
	ApiGroupsDto,
	GroupsCreateDto,
	GroupsUpdateDto,
} from "../dto/groupsDto";

export async function listGroups() {
	return apiClient<{ results?: ApiGroupsDto[]; count?: number }>(
		groupsEndpoints.list()
	);
}

export async function getGroups(id: string) {
	return apiClient<ApiGroupsDto>(groupsEndpoints.detail(id));
}

export async function createGroups(body: GroupsCreateDto) {
	return apiClient<ApiGroupsDto>(groupsEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateGroups(id: string, body: GroupsUpdateDto) {
	return apiClient<ApiGroupsDto>(groupsEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteGroups(id: string) {
	return apiClient<void>(groupsEndpoints.delete(id), {
		method: "DELETE",
	});
}
