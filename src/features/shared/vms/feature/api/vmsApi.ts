import { apiClient } from "@/lib/api/client";

import { vmsEndpoints } from "../../vms-endpoints";
import type { ApiVmsDto, VmsCreateDto, VmsUpdateDto } from "../dto/vmsDto";

export async function listVms() {
	return apiClient<{ results?: ApiVmsDto[]; count?: number }>(
		vmsEndpoints.list()
	);
}

export async function getVms(id: string) {
	return apiClient<ApiVmsDto>(vmsEndpoints.detail(id));
}

export async function createVms(body: VmsCreateDto) {
	return apiClient<ApiVmsDto>(vmsEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateVms(id: string, body: VmsUpdateDto) {
	return apiClient<ApiVmsDto>(vmsEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteVms(id: string) {
	return apiClient<void>(vmsEndpoints.delete(id), {
		method: "DELETE",
	});
}
