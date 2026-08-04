import { apiClient } from "@/lib/api/client";

import { processingStatusEndpoints } from "../../processing-status-endpoints";
import type { ApiProcessingStatusRecordDto } from "../dto/processingStatusRecordDto";

export { processingStatusEndpoints };

export type ProcessingStatusListResponse = {
	results?: ApiProcessingStatusRecordDto[] | null;
	count?: number | null;
};

export async function listProcessingStatusRecords(
	params?: Record<string, string>
) {
	return apiClient<ProcessingStatusListResponse>(
		processingStatusEndpoints.list(),
		{ params }
	);
}

export async function getProcessingStatusRecord(id: string) {
	return apiClient<ApiProcessingStatusRecordDto>(
		processingStatusEndpoints.detail(id)
	);
}
