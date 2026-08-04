import { apiClient } from "@/lib/api/client";

import { riskScoringEndpoints } from "../../risk-scoring-endpoints";
import type {
	ApiRiskScoringDto,
	RiskScoringCreateDto,
	RiskScoringUpdateDto,
} from "../dto/riskScoringDto";

export async function listRiskScoring() {
	return apiClient<{ results?: ApiRiskScoringDto[]; count?: number }>(
		riskScoringEndpoints.list()
	);
}

export async function getRiskScoring(id: string) {
	return apiClient<ApiRiskScoringDto>(riskScoringEndpoints.detail(id));
}

export async function createRiskScoring(body: RiskScoringCreateDto) {
	return apiClient<ApiRiskScoringDto>(riskScoringEndpoints.create(), {
		method: "POST",
		body: JSON.stringify(body),
	});
}

export async function updateRiskScoring(id: string, body: RiskScoringUpdateDto) {
	return apiClient<ApiRiskScoringDto>(riskScoringEndpoints.update(id), {
		method: "PATCH",
		body: JSON.stringify(body),
	});
}

export async function deleteRiskScoring(id: string) {
	return apiClient<void>(riskScoringEndpoints.delete(id), {
		method: "DELETE",
	});
}
