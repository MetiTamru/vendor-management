import { apiClient } from "@/lib/api/client";

import { automationsEndpoints } from "../../automations-endpoints";
import type { ApiAutomationsRecordDto } from "../dto/automationsRecordDto";

export { automationsEndpoints };

export type AutomationsListResponse = {
	results?: ApiAutomationsRecordDto[] | null;
	count?: number | null;
};

export async function listAutomationsRecords(params?: Record<string, string>) {
	return apiClient<AutomationsListResponse>(automationsEndpoints.list(), {
		params,
	});
}

export async function getAutomationsRecord(id: string) {
	return apiClient<ApiAutomationsRecordDto>(automationsEndpoints.detail(id));
}
