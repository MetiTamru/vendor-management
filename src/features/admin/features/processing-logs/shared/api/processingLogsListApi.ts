import { apiClient } from "@/lib/api/client";

import { processingLogsEndpoints } from "../../processing-logs-endpoints";
import type { ApiProcessingLogsRecordDto } from "../dto/processingLogsRecordDto";

export { processingLogsEndpoints };

export type ProcessingLogsListResponse = {
	results?: ApiProcessingLogsRecordDto[] | null;
	count?: number | null;
};

export async function listProcessingLogsRecords(params?: Record<string, string>) {
	return apiClient<ProcessingLogsListResponse>(processingLogsEndpoints.list(), { params });
}

export async function getProcessingLogsRecord(id: string) {
	return apiClient<ApiProcessingLogsRecordDto>(processingLogsEndpoints.detail(id));
}
