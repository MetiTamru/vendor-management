import { apiClient } from "@/lib/api/client";

import { approvalsEndpoints } from "../../approvals-endpoints";
import type { ApiApprovalsRecordDto } from "../dto/approvalsRecordDto";

export { approvalsEndpoints };

export type ApprovalsListResponse = {
	results?: ApiApprovalsRecordDto[] | null;
	count?: number | null;
};

export async function listApprovalsRecords(params?: Record<string, string>) {
	return apiClient<ApprovalsListResponse>(approvalsEndpoints.list(), { params });
}

export async function getApprovalsRecord(id: string) {
	return apiClient<ApiApprovalsRecordDto>(approvalsEndpoints.detail(id));
}
