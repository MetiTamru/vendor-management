import { apiClient } from "@/lib/api/client";

import { fileHistoryEndpoints } from "../../file-history-endpoints";
import type {
	ApiFileHistoryDto,
	FileHistoryCreateDto,
	FileHistoryUpdateDto,
} from "../dto/fileHistoryDto";

export async function listFileHistory() {
	return apiClient<{ results?: ApiFileHistoryDto[]; count?: number }>(
		fileHistoryEndpoints.list()
	);
}

export async function getFileHistory(id: string) {
	return apiClient<ApiFileHistoryDto>(fileHistoryEndpoints.detail(id));
}

export async function createFileHistory(body: FileHistoryCreateDto) {
	return apiClient<ApiFileHistoryDto>(fileHistoryEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateFileHistory(
	id: string,
	body: FileHistoryUpdateDto
) {
	return apiClient<ApiFileHistoryDto>(fileHistoryEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteFileHistory(id: string) {
	return apiClient<void>(fileHistoryEndpoints.delete(id), {
		method: "DELETE",
	});
}
