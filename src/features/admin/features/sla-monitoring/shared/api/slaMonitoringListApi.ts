import { apiClient } from "@/lib/api/client";

import { slaMonitoringEndpoints } from "../../sla-monitoring-endpoints";
import type { ApiSlaMonitoringRecordDto } from "../dto/slaMonitoringRecordDto";

export { slaMonitoringEndpoints };

export type SlaMonitoringListResponse = {
	results?: ApiSlaMonitoringRecordDto[] | null;
	count?: number | null;
};

export async function listSlaMonitoringRecords(
	params?: Record<string, string>
) {
	return apiClient<SlaMonitoringListResponse>(slaMonitoringEndpoints.list(), {
		params,
	});
}

export async function getSlaMonitoringRecord(id: string) {
	return apiClient<ApiSlaMonitoringRecordDto>(
		slaMonitoringEndpoints.detail(id)
	);
}
