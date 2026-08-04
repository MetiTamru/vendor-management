import { apiClient } from "@/lib/api/client";

import { providersEndpoints } from "../../providers-endpoints";
import type {
	ApiProvidersDto,
	ProvidersCreateDto,
	ProvidersUpdateDto,
} from "../dto/providersDto";

export async function listProviders() {
	return apiClient<{ results?: ApiProvidersDto[]; count?: number }>(
		providersEndpoints.list()
	);
}

export async function getProviders(id: string) {
	return apiClient<ApiProvidersDto>(providersEndpoints.detail(id));
}

export async function createProviders(body: ProvidersCreateDto) {
	return apiClient<ApiProvidersDto>(providersEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateProviders(id: string, body: ProvidersUpdateDto) {
	return apiClient<ApiProvidersDto>(providersEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteProviders(id: string) {
	return apiClient<void>(providersEndpoints.delete(id), {
		method: "DELETE",
	});
}
