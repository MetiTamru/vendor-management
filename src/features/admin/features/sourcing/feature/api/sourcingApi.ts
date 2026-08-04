import { apiClient } from "@/lib/api/client";

import { sourcingEndpoints } from "../../sourcing-endpoints";
import type {
	ApiSourcingDto,
	SourcingCreateDto,
	SourcingUpdateDto,
} from "../dto/sourcingDto";

export async function listSourcing() {
	return apiClient<{ results?: ApiSourcingDto[]; count?: number }>(
		sourcingEndpoints.list()
	);
}

export async function getSourcing(id: string) {
	return apiClient<ApiSourcingDto>(sourcingEndpoints.detail(id));
}

export async function createSourcing(body: SourcingCreateDto) {
	return apiClient<ApiSourcingDto>(sourcingEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateSourcing(id: string, body: SourcingUpdateDto) {
	return apiClient<ApiSourcingDto>(sourcingEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteSourcing(id: string) {
	return apiClient<void>(sourcingEndpoints.delete(id), {
		method: "DELETE",
	});
}
