import { apiClient } from "@/lib/api/client";

import { complianceEndpoints } from "../../compliance-endpoints";
import type { ApiComplianceRecordDto } from "../dto/complianceRecordDto";

export { complianceEndpoints };

export type ComplianceListResponse = {
	results?: ApiComplianceRecordDto[] | null;
	count?: number | null;
};

export async function listComplianceRecords(params?: Record<string, string>) {
	return apiClient<ComplianceListResponse>(complianceEndpoints.list(), { params });
}

export async function getComplianceRecord(id: string) {
	return apiClient<ApiComplianceRecordDto>(complianceEndpoints.detail(id));
}
