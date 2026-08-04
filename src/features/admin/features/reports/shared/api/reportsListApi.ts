import { apiClient } from "@/lib/api/client";

import { reportsEndpoints } from "../../reports-endpoints";
import type { ApiReportsRecordDto } from "../dto/reportsRecordDto";

export { reportsEndpoints };

export type ReportsListResponse = {
	results?: ApiReportsRecordDto[] | null;
	count?: number | null;
};

export async function listReportsRecords(params?: Record<string, string>) {
	return apiClient<ReportsListResponse>(reportsEndpoints.list(), { params });
}

export async function getReportsRecord(id: string) {
	return apiClient<ApiReportsRecordDto>(reportsEndpoints.detail(id));
}
