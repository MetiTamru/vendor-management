import { apiClient } from "@/lib/api/client";
import { vendorCoreApi } from "@/lib/vendor-core/api";
import type { CoreUserDto, LoginEventDto } from "@/lib/vendor-core/types";
import { withMockOrRemote } from "@/lib/mock-mode";

import { usersEndpoints } from "../../users-endpoints";
import type {
	ApiUsersDto,
	UsersCreateDto,
	UsersUpdateDto,
} from "../dto/usersDto";

export async function listUsers() {
	return withMockOrRemote(
		() => ({ results: [], count: 0 }),
		() =>
			apiClient<{ results?: ApiUsersDto[]; count?: number }>(
				usersEndpoints.list()
			)
	);
}

export async function getUsers(id: string) {
	return withMockOrRemote(
		() => ({ id: "mock" }) as never,
		() => apiClient<ApiUsersDto>(usersEndpoints.detail(id))
	);
}

export async function createUsers(body: UsersCreateDto) {
	return withMockOrRemote(
		() => ({ id: "mock" }) as never,
		() =>
			apiClient<ApiUsersDto>(usersEndpoints.create(), {
				method: "POST",
				body: JSON.stringify(body),
			})
	);
}

export async function updateUsers(id: string, body: UsersUpdateDto) {
	return withMockOrRemote(
		() => ({ id: "mock" }) as never,
		() =>
			apiClient<ApiUsersDto>(usersEndpoints.update(id), {
				method: "PATCH",
				body: JSON.stringify(body),
			})
	);
}

export async function deleteUsers(id: string) {
	return withMockOrRemote(
		() => undefined,
		() =>
			apiClient<void>(usersEndpoints.delete(id), {
				method: "DELETE",
			})
	);
}

export async function listVendorCoreUsers(): Promise<CoreUserDto[]> {
	const page = await vendorCoreApi.listUsers();
	return page.results ?? [];
}

export async function listVendorCoreLoginEvents(
	scope: "all" | "me" | string = "all"
): Promise<LoginEventDto[]> {
	if (scope === "me") {
		const page = await vendorCoreApi.listMyLoginEvents();
		return page.results ?? [];
	}
	if (scope !== "all") {
		const page = await vendorCoreApi.listUserLoginEvents(scope);
		return page.results ?? [];
	}
	const page = await vendorCoreApi.listLoginEvents();
	return page.results ?? [];
}
