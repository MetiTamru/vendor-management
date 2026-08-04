import { apiClient } from "@/lib/api/client";

import { processingLogsEndpoints } from "../../processing-logs-endpoints";
import type {
	ApiProcessingLogsDto,
	ProcessingLogsCreateDto,
	ProcessingLogsUpdateDto,
} from "../dto/processingLogsDto";

export async function listProcessingLogs() {
	return apiClient<{ results?: ApiProcessingLogsDto[]; count?: number }>(
		processingLogsEndpoints.list()
	);
}

export async function getProcessingLogs(id: string) {
	return apiClient<ApiProcessingLogsDto>(processingLogsEndpoints.detail(id));
}

export async function createProcessingLogs(body: ProcessingLogsCreateDto) {
	return apiClient<ApiProcessingLogsDto>(processingLogsEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateProcessingLogs(id: string, body: ProcessingLogsUpdateDto) {
	return apiClient<ApiProcessingLogsDto>(processingLogsEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteProcessingLogs(id: string) {
	return apiClient<void>(processingLogsEndpoints.delete(id), {
		method: "DELETE",
	});
}
