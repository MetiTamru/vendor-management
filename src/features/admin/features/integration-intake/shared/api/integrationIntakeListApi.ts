import { apiClient } from "@/lib/api/client";

import { integrationIntakeEndpoints } from "../../integration-intake-endpoints";
import type { ApiIntegrationIntakeRecordDto } from "../dto/integrationIntakeRecordDto";

export { integrationIntakeEndpoints };

export type IntegrationIntakeListResponse = {
	results?: ApiIntegrationIntakeRecordDto[] | null;
	count?: number | null;
};

export async function listIntegrationIntakeRecords(
	params?: Record<string, string>
) {
	return apiClient<IntegrationIntakeListResponse>(
		integrationIntakeEndpoints.list(),
		{ params }
	);
}

export async function getIntegrationIntakeRecord(id: string) {
	return apiClient<ApiIntegrationIntakeRecordDto>(
		integrationIntakeEndpoints.detail(id)
	);
}
