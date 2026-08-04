import { apiClient } from "@/lib/api/client";

import { dashboardEndpoints } from "../../dashboard-endpoints";
import type {
	ApiDashboardDto,
	DashboardCreateDto,
	DashboardUpdateDto,
} from "../dto/dashboardDto";

export async function listDashboard() {
	return apiClient<{ results?: ApiDashboardDto[]; count?: number }>(
		dashboardEndpoints.list()
	);
}

export async function getDashboard(id: string) {
	return apiClient<ApiDashboardDto>(dashboardEndpoints.detail(id));
}

export async function createDashboard(body: DashboardCreateDto) {
	return apiClient<ApiDashboardDto>(dashboardEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateDashboard(id: string, body: DashboardUpdateDto) {
	return apiClient<ApiDashboardDto>(dashboardEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteDashboard(id: string) {
	return apiClient<void>(dashboardEndpoints.delete(id), {
		method: "DELETE",
	});
}
