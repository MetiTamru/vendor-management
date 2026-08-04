import { apiClient } from "@/lib/api/client";

import { schedulesEndpoints } from "../../schedules-endpoints";
import type { ApiSchedulesRecordDto } from "../dto/schedulesRecordDto";

export { schedulesEndpoints };

export type SchedulesListResponse = {
	results?: ApiSchedulesRecordDto[] | null;
	count?: number | null;
};

export async function listSchedulesRecords(params?: Record<string, string>) {
	return apiClient<SchedulesListResponse>(schedulesEndpoints.list(), { params });
}

export async function getSchedulesRecord(id: string) {
	return apiClient<ApiSchedulesRecordDto>(schedulesEndpoints.detail(id));
}
