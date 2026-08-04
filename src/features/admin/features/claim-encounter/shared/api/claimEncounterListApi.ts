import { apiClient } from "@/lib/api/client";

import { claimEncounterEndpoints } from "../../claim-encounter-endpoints";
import type { ApiClaimEncounterRecordDto } from "../dto/claimEncounterRecordDto";

export { claimEncounterEndpoints };

export type ClaimEncounterListResponse = {
	results?: ApiClaimEncounterRecordDto[] | null;
	count?: number | null;
};

export async function listClaimEncounterRecords(
	params?: Record<string, string>
) {
	return apiClient<ClaimEncounterListResponse>(claimEncounterEndpoints.list(), {
		params,
	});
}

export async function getClaimEncounterRecord(id: string) {
	return apiClient<ApiClaimEncounterRecordDto>(
		claimEncounterEndpoints.detail(id)
	);
}
