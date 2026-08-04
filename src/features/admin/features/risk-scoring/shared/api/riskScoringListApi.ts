import { apiClient } from "@/lib/api/client";

import { riskScoringEndpoints } from "../../risk-scoring-endpoints";
import type { ApiRiskScoringRecordDto } from "../dto/riskScoringRecordDto";

export { riskScoringEndpoints };

export type RiskScoringListResponse = {
	results?: ApiRiskScoringRecordDto[] | null;
	count?: number | null;
};

export async function listRiskScoringRecords(params?: Record<string, string>) {
	return apiClient<RiskScoringListResponse>(riskScoringEndpoints.list(), {
		params,
	});
}

export async function getRiskScoringRecord(id: string) {
	return apiClient<ApiRiskScoringRecordDto>(riskScoringEndpoints.detail(id));
}
