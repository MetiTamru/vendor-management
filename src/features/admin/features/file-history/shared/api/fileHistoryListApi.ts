import { apiClient } from "@/lib/api/client";

import { fileHistoryEndpoints } from "../../file-history-endpoints";
import type { ApiFileHistoryRecordDto } from "../dto/fileHistoryRecordDto";

export { fileHistoryEndpoints };

export type FileHistoryListResponse = {
	results?: ApiFileHistoryRecordDto[] | null;
	count?: number | null;
};

export async function listFileHistoryRecords(params?: Record<string, string>) {
	return apiClient<FileHistoryListResponse>(fileHistoryEndpoints.list(), {
		params,
	});
}

export async function getFileHistoryRecord(id: string) {
	return apiClient<ApiFileHistoryRecordDto>(fileHistoryEndpoints.detail(id));
}
