import { apiClient } from "@/lib/api/client";

import { exportsEndpoints } from "../../exports-endpoints";
import type { ApiExportsRecordDto } from "../dto/exportsRecordDto";

export { exportsEndpoints };

export type ExportsListResponse = {
	results?: ApiExportsRecordDto[] | null;
	count?: number | null;
};

export async function listExportsRecords(params?: Record<string, string>) {
	return apiClient<ExportsListResponse>(exportsEndpoints.list(), { params });
}

export async function getExportsRecord(id: string) {
	return apiClient<ApiExportsRecordDto>(exportsEndpoints.detail(id));
}
