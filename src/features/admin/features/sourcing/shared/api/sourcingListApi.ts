import { apiClient } from "@/lib/api/client";

import { sourcingEndpoints } from "../../sourcing-endpoints";
import type { ApiSourcingRecordDto } from "../dto/sourcingRecordDto";

export { sourcingEndpoints };

export type SourcingListResponse = {
	results?: ApiSourcingRecordDto[] | null;
	count?: number | null;
};

export async function listSourcingRecords(params?: Record<string, string>) {
	return apiClient<SourcingListResponse>(sourcingEndpoints.list(), { params });
}

export async function getSourcingRecord(id: string) {
	return apiClient<ApiSourcingRecordDto>(sourcingEndpoints.detail(id));
}
