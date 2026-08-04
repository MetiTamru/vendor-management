import { apiClient } from "@/lib/api/client";

import { contractsEndpoints } from "../../contracts-endpoints";
import type {
	ApiContractsDto,
	ContractsCreateDto,
	ContractsUpdateDto,
} from "../dto/contractsDto";

export async function listContracts() {
	return apiClient<{ results?: ApiContractsDto[]; count?: number }>(
		contractsEndpoints.list()
	);
}

export async function getContracts(id: string) {
	return apiClient<ApiContractsDto>(contractsEndpoints.detail(id));
}

export async function createContracts(body: ContractsCreateDto) {
	return apiClient<ApiContractsDto>(contractsEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateContracts(id: string, body: ContractsUpdateDto) {
	return apiClient<ApiContractsDto>(contractsEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteContracts(id: string) {
	return apiClient<void>(contractsEndpoints.delete(id), {
		method: "DELETE",
	});
}
