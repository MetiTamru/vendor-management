import { apiClient } from "@/lib/api/client";

import { fileManagementEndpoints } from "../../file-management-endpoints";
import type { ApiFileManagementRecordDto } from "../dto/fileManagementRecordDto";

export { fileManagementEndpoints };

export type FileManagementListResponse = {
	results?: ApiFileManagementRecordDto[] | null;
	count?: number | null;
};

export async function listFileManagementRecords(
	params?: Record<string, string>
) {
	return apiClient<FileManagementListResponse>(fileManagementEndpoints.list(), {
		params,
	});
}

export async function getFileManagementRecord(id: string) {
	return apiClient<ApiFileManagementRecordDto>(
		fileManagementEndpoints.detail(id)
	);
}
