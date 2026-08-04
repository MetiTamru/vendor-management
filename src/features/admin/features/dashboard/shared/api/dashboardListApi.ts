import { apiClient } from "@/lib/api/client";

import { dashboardEndpoints } from "../../dashboard-endpoints";
import type { ApiDashboardRecordDto } from "../dto/dashboardRecordDto";

export { dashboardEndpoints };

export type DashboardListResponse = {
	results?: ApiDashboardRecordDto[] | null;
	count?: number | null;
};

export async function listDashboardRecords(params?: Record<string, string>) {
	return apiClient<DashboardListResponse>(dashboardEndpoints.list(), { params });
}

export async function getDashboardRecord(id: string) {
	return apiClient<ApiDashboardRecordDto>(dashboardEndpoints.detail(id));
}
