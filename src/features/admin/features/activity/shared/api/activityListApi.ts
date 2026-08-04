import { apiClient } from "@/lib/api/client";

import { activityEndpoints } from "../../activity-endpoints";
import type { ApiActivityRecordDto } from "../dto/activityRecordDto";

export { activityEndpoints };

export type ActivityListResponse = {
	results?: ApiActivityRecordDto[] | null;
	count?: number | null;
};

export async function listActivityRecords(params?: Record<string, string>) {
	return apiClient<ActivityListResponse>(activityEndpoints.list(), { params });
}

export async function getActivityRecord(id: string) {
	return apiClient<ApiActivityRecordDto>(activityEndpoints.detail(id));
}
