import { apiClient } from "@/lib/api/client";

import { errorManagementEndpoints } from "../../error-management-endpoints";
import type { ApiErrorManagementRecordDto } from "../dto/errorManagementRecordDto";

export { errorManagementEndpoints };

export type ErrorManagementListResponse = {
	results?: ApiErrorManagementRecordDto[] | null;
	count?: number | null;
};

export async function listErrorManagementRecords(params?: Record<string, string>) {
	return apiClient<ErrorManagementListResponse>(errorManagementEndpoints.list(), { params });
}

export async function getErrorManagementRecord(id: string) {
	return apiClient<ApiErrorManagementRecordDto>(errorManagementEndpoints.detail(id));
}
