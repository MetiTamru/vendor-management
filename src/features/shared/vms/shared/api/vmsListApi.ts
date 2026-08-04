import { apiClient } from "@/lib/api/client";

import { vmsEndpoints } from "../../vms-endpoints";
import type { ApiVmsRecordDto } from "../dto/vmsRecordDto";

export { vmsEndpoints };

export type VmsListResponse = {
	results?: ApiVmsRecordDto[] | null;
	count?: number | null;
};

export async function listVmsRecords(params?: Record<string, string>) {
	return apiClient<VmsListResponse>(vmsEndpoints.list(), { params });
}

export async function getVmsRecord(id: string) {
	return apiClient<ApiVmsRecordDto>(vmsEndpoints.detail(id));
}
