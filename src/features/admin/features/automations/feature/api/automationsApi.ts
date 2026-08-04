import { apiClient } from "@/lib/api/client";

import { automationsEndpoints } from "../../automations-endpoints";
import type {
	ApiAutomationsDto,
	AutomationsCreateDto,
	AutomationsUpdateDto,
} from "../dto/automationsDto";

export async function listAutomations() {
	return apiClient<{ results?: ApiAutomationsDto[]; count?: number }>(
		automationsEndpoints.list()
	);
}

export async function getAutomations(id: string) {
	return apiClient<ApiAutomationsDto>(automationsEndpoints.detail(id));
}

export async function createAutomations(body: AutomationsCreateDto) {
	return apiClient<ApiAutomationsDto>(automationsEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateAutomations(
	id: string,
	body: AutomationsUpdateDto
) {
	return apiClient<ApiAutomationsDto>(automationsEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteAutomations(id: string) {
	return apiClient<void>(automationsEndpoints.delete(id), {
		method: "DELETE",
	});
}
