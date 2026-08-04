import { apiClient } from "@/lib/api/client";

import { slaMonitoringEndpoints } from "../../sla-monitoring-endpoints";
import type {
	ApiSlaMonitoringDto,
	SlaMonitoringCreateDto,
	SlaMonitoringUpdateDto,
} from "../dto/slaMonitoringDto";

export async function listSlaMonitoring() {
	return apiClient<{ results?: ApiSlaMonitoringDto[]; count?: number }>(
		slaMonitoringEndpoints.list()
	);
}

export async function getSlaMonitoring(id: string) {
	return apiClient<ApiSlaMonitoringDto>(slaMonitoringEndpoints.detail(id));
}

export async function createSlaMonitoring(body: SlaMonitoringCreateDto) {
	return apiClient<ApiSlaMonitoringDto>(slaMonitoringEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateSlaMonitoring(
	id: string,
	body: SlaMonitoringUpdateDto
) {
	return apiClient<ApiSlaMonitoringDto>(slaMonitoringEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteSlaMonitoring(id: string) {
	return apiClient<void>(slaMonitoringEndpoints.delete(id), {
		method: "DELETE",
	});
}
