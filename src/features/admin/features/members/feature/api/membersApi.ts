import { apiClient } from "@/lib/api/client";

import { membersEndpoints } from "../../members-endpoints";
import type {
	ApiMembersDto,
	MembersCreateDto,
	MembersUpdateDto,
} from "../dto/membersDto";

export async function listMembers() {
	return apiClient<{ results?: ApiMembersDto[]; count?: number }>(
		membersEndpoints.list()
	);
}

export async function getMembers(id: string) {
	return apiClient<ApiMembersDto>(membersEndpoints.detail(id));
}

export async function createMembers(body: MembersCreateDto) {
	return apiClient<ApiMembersDto>(membersEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateMembers(id: string, body: MembersUpdateDto) {
	return apiClient<ApiMembersDto>(membersEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteMembers(id: string) {
	return apiClient<void>(membersEndpoints.delete(id), {
		method: "DELETE",
	});
}
