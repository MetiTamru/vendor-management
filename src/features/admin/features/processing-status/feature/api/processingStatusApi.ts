import { apiClient } from "@/lib/api/client";

import { processingStatusEndpoints } from "../../processing-status-endpoints";
import type {
	ApiProcessingStatusDto,
	ProcessingStatusCreateDto,
	ProcessingStatusUpdateDto,
} from "../dto/processingStatusDto";

export async function listProcessingStatus() {
	return apiClient<{ results?: ApiProcessingStatusDto[]; count?: number }>(
		processingStatusEndpoints.list()
	);
}

export async function getProcessingStatus(id: string) {
	return apiClient<ApiProcessingStatusDto>(processingStatusEndpoints.detail(id));
}

export async function createProcessingStatus(body: ProcessingStatusCreateDto) {
	return apiClient<ApiProcessingStatusDto>(processingStatusEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateProcessingStatus(id: string, body: ProcessingStatusUpdateDto) {
	return apiClient<ApiProcessingStatusDto>(processingStatusEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteProcessingStatus(id: string) {
	return apiClient<void>(processingStatusEndpoints.delete(id), {
		method: "DELETE",
	});
}
