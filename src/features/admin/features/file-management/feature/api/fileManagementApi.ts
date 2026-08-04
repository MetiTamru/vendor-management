import { apiClient } from "@/lib/api/client";

import { fileManagementEndpoints } from "../../file-management-endpoints";
import type {
	ApiFileManagementDto,
	FileManagementCreateDto,
	FileManagementUpdateDto,
} from "../dto/fileManagementDto";

export async function listFileManagement() {
	return apiClient<{ results?: ApiFileManagementDto[]; count?: number }>(
		fileManagementEndpoints.list()
	);
}

export async function getFileManagement(id: string) {
	return apiClient<ApiFileManagementDto>(fileManagementEndpoints.detail(id));
}

export async function createFileManagement(body: FileManagementCreateDto) {
	return apiClient<ApiFileManagementDto>(fileManagementEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateFileManagement(id: string, body: FileManagementUpdateDto) {
	return apiClient<ApiFileManagementDto>(fileManagementEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteFileManagement(id: string) {
	return apiClient<void>(fileManagementEndpoints.delete(id), {
		method: "DELETE",
	});
}
