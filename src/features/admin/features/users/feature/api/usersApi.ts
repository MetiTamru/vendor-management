import { apiClient } from "@/lib/api/client";

import { usersEndpoints } from "../../users-endpoints";
import type {
	ApiUsersDto,
	UsersCreateDto,
	UsersUpdateDto,
} from "../dto/usersDto";

export async function listUsers() {
	return apiClient<{ results?: ApiUsersDto[]; count?: number }>(
		usersEndpoints.list()
	);
}

export async function getUsers(id: string) {
	return apiClient<ApiUsersDto>(usersEndpoints.detail(id));
}

export async function createUsers(body: UsersCreateDto) {
	return apiClient<ApiUsersDto>(usersEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateUsers(id: string, body: UsersUpdateDto) {
	return apiClient<ApiUsersDto>(usersEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteUsers(id: string) {
	return apiClient<void>(usersEndpoints.delete(id), {
		method: "DELETE",
	});
}
