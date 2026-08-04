import { apiClient } from "@/lib/api/client";

import { providersEndpoints } from "../../providers-endpoints";
import type { ApiProvidersRecordDto } from "../dto/providersRecordDto";

export { providersEndpoints };

export type ProvidersListResponse = {
	results?: ApiProvidersRecordDto[] | null;
	count?: number | null;
};

export async function listProvidersRecords(params?: Record<string, string>) {
	return apiClient<ProvidersListResponse>(providersEndpoints.list(), { params });
}

export async function getProvidersRecord(id: string) {
	return apiClient<ApiProvidersRecordDto>(providersEndpoints.detail(id));
}
