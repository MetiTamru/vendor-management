import { apiClient } from "@/lib/api/client";

import { contractsEndpoints } from "../../contracts-endpoints";
import type { ApiContractsRecordDto } from "../dto/contractsRecordDto";

export { contractsEndpoints };

export type ContractsListResponse = {
	results?: ApiContractsRecordDto[] | null;
	count?: number | null;
};

export async function listContractsRecords(params?: Record<string, string>) {
	return apiClient<ContractsListResponse>(contractsEndpoints.list(), { params });
}

export async function getContractsRecord(id: string) {
	return apiClient<ApiContractsRecordDto>(contractsEndpoints.detail(id));
}
