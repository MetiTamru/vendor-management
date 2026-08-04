import { apiClient } from "@/lib/api/client";

import { performanceEndpoints } from "../../performance-endpoints";
import type { ApiPerformanceRecordDto } from "../dto/performanceRecordDto";

export { performanceEndpoints };

export type PerformanceListResponse = {
	results?: ApiPerformanceRecordDto[] | null;
	count?: number | null;
};

export async function listPerformanceRecords(params?: Record<string, string>) {
	return apiClient<PerformanceListResponse>(performanceEndpoints.list(), {
		params,
	});
}

export async function getPerformanceRecord(id: string) {
	return apiClient<ApiPerformanceRecordDto>(performanceEndpoints.detail(id));
}
